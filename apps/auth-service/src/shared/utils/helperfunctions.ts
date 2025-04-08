import { Response } from "express";
import jwt from "jsonwebtoken";
import { UserLoginDTO } from "../../Modals/zod/User";
import { processEnv } from "../../config";

export const generateTokenAndSetCookie = (userDTO:UserLoginDTO,res:Response)=>{
    try{
        const token = jwt.sign(userDTO,processEnv.jwt_secret??"",{expiresIn:"15d"})
        res.cookie("jwt",token,{
            maxAge: 15 * 24 * 60 * 60 * 1000, //MS for 15 days
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks
            sameSite: "strict", // CSRF attacks cross-site request forgery attacks
            secure: process.env.NODE_ENV !== "development",
        })
    }catch(err){
        throw err;
    }
   
}