import { Response } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { processEnv } from "../../config";
export enum COOKIE_NAMES{
    ACCESS_TOKEN='access_token',
    REFRESH_TOKEN='refresh_token'
}
export enum COOKIE_TIME{
    // FIFTEEN_DAYS=15 * 24 * 60 * 60 * 1000,
    // ONE_HOUR=1 * 60 * 60 * 1000,
    //*setted to 1 minute for refresh token and 30 seconds for access token
    FIFTEEN_DAYS=2 * 60 * 1000,
    ONE_HOUR=30*1000,
    ZERO=0
}

interface JwtCookieOptions{
    cookieName:COOKIE_NAMES,
    maxAge:COOKIE_TIME,
    expiresIn:jwt.SignOptions['expiresIn']
}
export const generateTokenAndSetCookie = (data:any,res:Response,options:JwtCookieOptions)=>{
    try{
        const token = jwt.sign(data,processEnv.jwt_secret??"",{expiresIn:options.expiresIn})
        console.log(token);
        
        res.cookie(options.cookieName,token,{
            maxAge: options.maxAge,
            httpOnly: true, // prevent XSS attacks cross-site scripting attacks
            sameSite: "strict", // CSRF attacks cross-site request forgery attacks
            secure: process.env.NODE_ENV !== "development",
        })        
    }catch(err){
        throw err;
    }
   
}

export const isTokenExpired = (token:JwtPayload)=>{
    return  (Date.now() >= (token?.exp ?? 0) * 1000)
}