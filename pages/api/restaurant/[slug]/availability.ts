import { NextApiRequest, NextApiResponse } from "next";
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()
const numberOfPastTimesToSearch = 2
const numberOfFutureTimesToSearch = 2
const intervalTimeMinutes = 30

export default async function handler (req: NextApiRequest, res: NextApiResponse){
    const {slug, day, time, partySize} = req.query as {slug:string, day:string, time:string, partySize:string}
    if(!day || !time || !partySize){
        return res.status(200).json({
            errorMessage:"Invalid data provided"
        })
    }
    //query restaurant tables in question
    const restaurant = await prisma.restaurant.findUnique({
        where:{
            slug:slug
        },
        select:{
            tables:true,
            open_time:true,
            close_time: true
        }
    })
    if(!restaurant){
        return res.status(200).json({
            errorMessage:"Invalid data provided"
        })
    }


    // calculate search times
    const searchTimes = calculateSearchTimes(time);
    if(!searchTimes){
        return res.status(200).json({
            errorMessage:"Invalid data provided"
        })
    }
    console.log(new Date(`${day}T${searchTimes[0]}`));
    console.log(`${day}T${searchTimes[searchTimes.length-1]}`);
    
    
    // get bookings from those times
    const bookinsInTimes = await prisma.booking.findMany({
        where:{
            booking_time:{
                gte: new Date(`${day}T${searchTimes[0]}`),
                lte: new Date(`${day}T${searchTimes[searchTimes.length-1]}`)
            }
        },
        select:{
            number_of_people:true,
            booking_time:true,
            tables: true
        }
    })

    // organize data, for rach booking, give a key that says which tables are busy
    const bookingTablesObj: {[key:string]:{[key:number]:true}} = {}
    bookinsInTimes.forEach(booking=>{
        bookingTablesObj[booking.booking_time.toISOString()] = booking.tables.reduce((obj, table)=>{
         return {
            ...obj,
            [table.table_id]:true
         }   
        },{})
    })

    const tables = restaurant.tables

    // reformat the searchTimes to include the data in previous obj created
    const searchTimesWithTables = searchTimes.map(searchTime=>{
        return{
            date: new Date(`${day}T${searchTime}`),
            time: searchTime,
            tables
        }
    })

    // remove tables that are not available

    searchTimesWithTables.forEach(t =>{
        t.tables = t.tables.filter(table=>{
            if(bookingTablesObj[t.date.toISOString()]){
                if(bookingTablesObj[t.date.toISOString()][table.id]) return false
            }
            return true
        })
    })

    const availabilities = searchTimesWithTables.map(t=>{
        const sumSeats= t.tables.reduce((sum, table)=>{
            return sum+table.seats
        },0)
        return{
            time:t.time,
            available: sumSeats >= parseInt(partySize)
        }
    }).filter(availability =>{
        const timeIsAfterOpeningHours = new Date(`${day}T${availability.time}`) >= new Date(`${day}T${restaurant.open_time}`)
        const timeIsBeforeClosingHour = new Date(`${day}T${availability.time}`) <= new Date(`${day}T${restaurant.close_time}`)
        return timeIsAfterOpeningHours && timeIsBeforeClosingHour
    })

    return res.json(
        availabilities
    )
}





// Get nearby times
const calculateSearchTimes = (time:string) =>{
    const times = []
    const timeSplit= time.split(":")
    const searchTimeHour = parseInt(timeSplit[0])
    const searchTimeMinute = parseInt(timeSplit[1])
    console.log(searchTimeHour)
    if(isNaN(searchTimeHour) || isNaN(searchTimeMinute)){
        return
    }
    let currSearchTimeHour = searchTimeHour
    let currSearchTimeMinutes = searchTimeMinute
    for(let i =0; i < numberOfPastTimesToSearch; i++){
        let dif = currSearchTimeMinutes - intervalTimeMinutes
        let newTimeHours
        let newTimeMinutes
        if(dif < 0 ){
            newTimeMinutes = 60-(dif*-1)
            if(currSearchTimeHour -1 === 0){
                continue
            }
            newTimeHours = currSearchTimeHour - 1
        }
        else{
            newTimeHours = currSearchTimeHour
            newTimeMinutes = dif
        }
        currSearchTimeHour = newTimeHours
        currSearchTimeMinutes = newTimeMinutes
        const datePush = `${newTimeHours}:${newTimeMinutes===0?"00":newTimeMinutes}:00.000Z`
        times.push(datePush)
    }
    times.push(time)
    currSearchTimeHour = searchTimeHour
    currSearchTimeMinutes = searchTimeMinute
    for(let i =0; i < numberOfFutureTimesToSearch; i++){
        let sum = currSearchTimeMinutes + intervalTimeMinutes
        let newTimeHours
        let newTimeMinutes
        if(sum > 59 ){
            newTimeMinutes = sum - 60
            if(currSearchTimeHour + 1 === 25){
                continue
            }
            newTimeHours = currSearchTimeHour + 1
        }
        else{
            newTimeHours = currSearchTimeHour
            newTimeMinutes = sum
        }
        currSearchTimeHour = newTimeHours
        currSearchTimeMinutes = newTimeMinutes
        times.push(`${newTimeHours}:${newTimeMinutes===0?"00":newTimeMinutes}:00.000Z`)
    }
   return times

}


//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-03-02&time=14:00:00.000Z&partySize=4