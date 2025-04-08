import { NextFunction, Request, Response } from "express";
import { userObject, UserObject } from "../Modals/zod/User";
import { BadRequestException } from "../shared/exceptions/http.exceptions";
import { HTTPMessages } from "../shared/models/http-messages";
//Sanitizes the User Modal based on the regiteration
export const sanatizeUserModelMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const user = req.body;
    try{
        const isUserValid = await userObject.safeParseAsync(user);
        if(!isUserValid.success){
            
            const erros = await isUserValid.error.flatten().fieldErrors;
            //If the user has not provided in the body or anything
            if(Object.keys(erros).length === 0){
                throw new BadRequestException("No Input Provided");
            }
            //undefined asa first parameter is to make sure that the error is not a string (want to use the default message)
            throw new BadRequestException(undefined,erros)
        }
        //If successful then proceed to the next middleware
        next();
    }catch(err){
        //Rethrow the error to the global error handler
        //This is to make sure that the error is handled in the global error handler
       throw err
    }
}