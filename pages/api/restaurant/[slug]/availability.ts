import { NextApiRequest, NextApiResponse } from "next";
import {PrismaClient} from "@prisma/client"
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

const prisma = new PrismaClient()

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
   
    const searchTimesWithTables = await findAvailableTables({time, day, res, restaurant})
    if(!searchTimesWithTables){
        return res.status(200).json({
            errorMessage:"Invalid data provided"
        })
    }

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







//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-03-02&time=14:00:00.000Z&partySize=4