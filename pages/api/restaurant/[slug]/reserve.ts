import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

const prisma = new PrismaClient
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug, day, time, partySize } = req.query as { slug: string, day: string, time: string, partySize: string }
    const {bookerEmail, bookerPhone, bookerFirstName,bookerLastName, bookerOcassion, bookerRequest} = req.body
    console.log(req.body);
    console.log(req.query);
    
    
    // valitations: make sure restaurant exists, and that time makes sense
    const restaurant = await prisma.restaurant.findUnique({
        where: {
            slug
        },
        select: {
            tables: true,
            open_time: true,
            close_time: true,
            id:true
        }
    })
    if (!restaurant) {
        console.log("here 1")
        return res.status(400).json({ errorMessage: "Invalid data" })
        
    }




    if (new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) || new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)) {
        console.log("here 2")
        return res.status(400).json({ errorMessage: "Restaurant is not open at that time" })
     
    }

    const searchTimesWithTables = await findAvailableTables({ time, day, res, restaurant })
    if (!searchTimesWithTables) {
        console.log("here 3")
        return res.status(400).json({
            errorMessage: "Invalid data provided"
        })
       
    }

    const searchTimeWithTables = searchTimesWithTables.find((t) => {
        return t.date.toISOString() === new Date(`${day}T${time}`).toISOString()
    })
    if (!searchTimeWithTables) {
        console.log("here 4")
        return res.status(400).json({
            errorMessage: "Not longer available"
        })
    }

    const tablesCount: { 2: number[], 4: number[] } = {
        2: [],
        4: []
    }

    searchTimeWithTables.tables.forEach(table => {
        if (table.seats === 2) {
            tablesCount[2].push(table.id)
        }
        else {
            tablesCount[4].push(table.id)
        }
    })

    const tablesToBook: number[] = []
    let seatsRemaining = parseInt(partySize)
    while (seatsRemaining > 0) {
        if (seatsRemaining >= 3) {
            if (tablesCount[4].length) {
                tablesToBook.push(tablesCount[4][0])
                tablesCount[4].shift();
                seatsRemaining = seatsRemaining - 4
            }
            else {

                tablesToBook.push(tablesCount[2][0])
                tablesCount[2].shift();
                seatsRemaining = seatsRemaining - 2
            }
        }else{
            if (tablesCount[2].length) {
                tablesToBook.push(tablesCount[2][0])
                tablesCount[2].shift();
                seatsRemaining = seatsRemaining - 2
            }
            else {

                tablesToBook.push(tablesCount[4][0])
                tablesCount[4].shift();
                seatsRemaining = seatsRemaining - 4
            }
        }

    }

    // book them tables
    const booking = await prisma.booking.create({
        data:{
            number_of_people : parseInt(partySize),
            booking_time : new Date(`${day}T${time}`),
            booker_email : bookerEmail,
            booker_phone : bookerPhone,
            booker_first_name : bookerFirstName,
            booker_last_name : bookerLastName,
            restaurant_id: restaurant.id, 
            ocassion: bookerOcassion,
            booker_request: bookerRequest
        }
    })
    const bookingsOnTablesData = tablesToBook.map(table_id =>{
        return {
            table_id,
            booking_id : booking.id
        }
    })

    await prisma.bookingsOnTable.createMany({
        data: bookingsOnTablesData
    })

    return res.json({
        booking
    })


}

//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-03-02&time=14:00:00.000Z&partySize=4