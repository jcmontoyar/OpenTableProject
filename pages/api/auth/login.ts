import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import * as jose from "jose"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check that method is POST
    if (req.method === 'POST') {
        const { password, email } = req.body
        // validate inputs, return error if needed
        let errors = validateErrors(password, email)
        if (errors.length) {
            return res.status(400).json({
                errorMessage: errors[0]
            })
        }

        // validate that the user exists, send error message if it does not
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select:{
                password: true,
                email: true,
                first_name: true
            }
        })
        if (!user) {
            return res.status(401).json({
                errorMessage: "Email or password is incorrect"
            })
        }

        // compare password, if not equal return error msg
        if(! await bcrypt.compare(password, user.password)){
            return res.status(400).json({
                errorMessage: "Email or password is incorrect"
            })
        }

        // Return the JWT
        // Using HS256, we create the JWS to return it to the user
        const alg = "HS256"
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const token = await new jose.SignJWT({email:user.email}).setProtectedHeader({alg}).setExpirationTime("24h").sign(secret)
        return res.status(200).json({token})
    }
    return res.status(404).json("unkown endpoint")
}


const validateErrors = (password: string, email: string): string[] => {
    let errors: string[] = []
    const validationSchema = [
        {
            valid: validator.isLength(password, {
                min: 1
            }),
            errorMessage: "Please input a password"
        },
        {
            valid: validator.isEmail(email),
            errorMessage: "Type a valid email"
        }
    ]

    validationSchema.map(check => {
        if (!check.valid) {
            errors.push(check.errorMessage)
        }
    })
    return errors;
}
