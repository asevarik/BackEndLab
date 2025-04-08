import { NextFunction, Request, Response } from "express";
import { createUser } from "../services/auth.services";
import { SuccessResponse } from "../shared/utils/success-response.helper";
import { HTTPAuthSuccessMessages } from "../shared/enums/success-messages.enum";
import { generateTokenAndSetCookie } from "../shared/utils/helperfunctions";

export const userRegistrationController = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userDTO = req.body;
        const user = await createUser(userDTO);
        //Generating the fresh jwt and setting it in the cookie of the client
        generateTokenAndSetCookie(user,res);
        SuccessResponse.created(res,user,HTTPAuthSuccessMessages.CreateSuccess)
    }catch(err){
        //For Global Error handling
        next(err)
    }
}