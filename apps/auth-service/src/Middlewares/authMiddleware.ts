import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../shared/exceptions/http.exceptions";
import jwt ,{JsonWebTokenError, JwtPayload, TokenExpiredError} from "jsonwebtoken";
import { COOKIE_NAMES, COOKIE_TIME, generateTokenAndSetCookie } from "../shared/utils/helperfunctions";
import { processEnv } from "../config";
import { getOneUserById, signInUser } from "../services/auth.services";

export const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const token = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];
        //When the access token is not present in the cookies
        if(!token){
         const err = new UnauthorizedException('No Access Token Provided'); 
         throw err;
        }
        console.log("token",req.cookies,token);
        
        //This method already throws error if the jwt is invalid(JWT invalid) or expired
       const decodedToken =  await jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
       req.body = {...req.body,decodedToken}
       next()
    }catch(err: any){

        //If the token is expired from the client side and the refresh token is there then also call the refresh token middleware
        if(err instanceof UnauthorizedException){
            console.log("access token expired redirecting to refresh token middleware");
            refreshTokenMiddleware(req,res,next);
            return;
        }
        //Edge Case if the timing dows not match then the functionality will not break atleast
        if(err instanceof TokenExpiredError){
            console.log("access token expired redirecting to refresh token middleware");
            refreshTokenMiddleware(req,res,next);
            return;
        }
        //Checking if the ACCESS JWT is Expired/Invalidated  Then check the refresh token error
        if( err instanceof JsonWebTokenError){
            refreshTokenMiddleware(req,res,next);
            return;
        }
        //Some uncaught exception
        throw err
    }
}


export const refreshTokenMiddleware = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const token = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
        if(!token){
            throw new UnauthorizedException('No Refresh Token Provided')   
        }
        
        //This method already throws error if the refresh is invalid(JWT invalid) or expired
       const decodedToken =  await jwt.verify(token, processEnv.jwt_secret??"") as JwtPayload;
        //If the refresh token is valid then generate a new access token
        if(decodedToken['isUserSignedIn'] && decodedToken['userId']){
            //Generating the fresh ACCESS TOKEN and setting it in the cookie of the client
            const user = await getOneUserById(decodedToken['userId'])
            const dataTobeSet = {isUserSignedIn:true,userId:user._id,roles:user.roles}
            await generateTokenAndSetCookie(dataTobeSet,res,{
                 cookieName: COOKIE_NAMES.ACCESS_TOKEN,
                 maxAge: COOKIE_TIME.ONE_HOUR,
                 expiresIn: COOKIE_TIME.ONE_HOUR,
                 
            })
            //If the Access Token fails then also adding the decoded Token in the request body
            req.body = {...req.body,decodedToken:dataTobeSet}
            next()
        }
    
    }catch(err:any){
        if(err instanceof UnauthorizedException){
           return next(new UnauthorizedException('Invalid Token.Please Sign In Again'))
        }
        //Checking if the JWT is Expired  Error
        if(err instanceof TokenExpiredError){
            return next(new UnauthorizedException('Token Expired'))
        }
        //If the token is invalid 
        if( err instanceof JsonWebTokenError){
            return next(new UnauthorizedException('Invalid Token.Please Sign In Again'))
        }
        return next(err)
    }
}

export const authorizeRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      
        const user = req.body.decodedToken as { roles?: string[] }; // assume req.user is populated by auth middleware
  
      if (!user || !user.roles || user.roles.length === 0) {
        return next(new UnauthorizedException('User has no roles assigned'));
      }
  
      const hasRole = user.roles.some(role => allowedRoles.includes(role));
      if (!hasRole) {
        return next(new UnauthorizedException('You are not authorized to access this resource'));
      }
  
      next();
    };
  };


