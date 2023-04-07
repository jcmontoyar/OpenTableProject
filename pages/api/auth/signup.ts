import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import * as jose from "jose"


const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // validate if it is a post request
    if (req.method === "POST") {
        const { firstName, lastName, email, phone, city, password } = req.body

        // validate fields
        let errors = validateFields(firstName, lastName, email, phone, city, password)

        //if any error, return 400 with error message
        if (errors.length) {
            return res.status(400).json({ errorMessage: errors[0] })
        }

        // validate if the user already exists in the DB, if it does returns an error message
        if(await userAlreadyExists(email)){
            return res.status(400).json({ errorMessage: "This user already is registered, please log in"})
        }

        // hash the password using bcrypt and use that to create the user in the db
        const hashedPassword = await bcrypt.hash(password,10)      
        const user = await prisma.user.create({
            data:{
                first_name: firstName,
                last_name: lastName,
                password: hashedPassword,
                city: city,
                email: email,
                phone: phone
            }
        }) 

        // Using HS256, we create the JWS to return it to the user
        const alg = "HS256"
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const token = await new jose.SignJWT({email:user.email}).setProtectedHeader({alg}).setExpirationTime("24h").sign(secret)
        return res.status(200).json({token})
    }
    return res.status(404).json("unkown endpoint")
}

const validateFields = (firstName: string, lastName: string, email: string, phone: string, city: string, password: string): string[] => {
    let errors: string[] = []
    const validatorSchema = [
        {
            valid: validator.isLength(firstName, {
                min: 1,
                max: 20
            }),
            errorMessage: "First name is invalid"
        },
        {
            valid: validator.isLength(lastName, {
                min: 1,
                max: 20
            }),
            errorMessage: "Last name is invalid"
        },
        {
            valid: validator.isEmail(email),
            errorMessage: "Email name is invalid"
        },
        {
            valid: validator.isMobilePhone(phone),
            errorMessage: "Phone name is invalid"
        },
        {
            valid: validator.isLength(city, {
                min: 1,
                max: 20
            }),
            errorMessage: "City is invalid"
        },
        {
            valid: validator.isStrongPassword(password),
            errorMessage: "Password is not string enough"
        },
    ]

    validatorSchema.forEach((check) => {
        if (!check.valid) {
            errors.push(check.errorMessage)
        }
    })
    return errors
}

const userAlreadyExists = async (email:string): Promise<boolean> =>{
    const results = await prisma.user.findUnique({
        where:{
            email: email
        }
    })
    // if result is found (not null) then return true (user exists)
    if(results){
        return true
    }
    return false
}
