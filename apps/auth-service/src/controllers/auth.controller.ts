import { NextFunction, Request, Response } from "express";
import { createUser, getUsers, signInUser } from "../services/auth.services";
import { SuccessResponse } from "../shared/utils/success-response.helper";
import { HTTPAuthSuccessMessages } from "../shared/enums/success-messages.enum";
import {
  COOKIE_NAMES,
  COOKIE_TIME,
  generateTokenAndSetCookie,
} from "../shared/utils/helperfunctions";
import { SSEEventType, sseStore } from "../services/admin_metrics.services";

export const userRegistrationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userDTO = req.body;
    const user = await createUser(userDTO);
    //Generating the fresh jwt and setting it in the cookie of the client
    generateTokenAndSetCookie({ isUserSignedIn: true, userId:user._id,roles:user.roles}, res, {
      cookieName: COOKIE_NAMES.ACCESS_TOKEN,
      maxAge: COOKIE_TIME.ONE_HOUR,
      expiresIn: COOKIE_TIME.ONE_HOUR,
    });
    //CREATING A REFRESH TOKEN
    generateTokenAndSetCookie({ isUserSignedIn: true, userId:user._id }, res, {
        cookieName: COOKIE_NAMES.REFRESH_TOKEN,
        maxAge: COOKIE_TIME.FIFTEEN_DAYS,
        expiresIn: COOKIE_TIME.FIFTEEN_DAYS,
      });
    //Notifying the Admin to see that the user has been registered in real time
    sseStore.broadcast({message:"new client has been connected"},SSEEventType.USER_REGISTERED)
    
    SuccessResponse.created(res, user, HTTPAuthSuccessMessages.CreateSuccess);
  } catch (err) {
    //For Global Error handling
    next(err);
  }
};

export const userSignInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userDTO = req.body;
    const user = await signInUser(userDTO);
    //Generating the fresh jwt and setting it in the cookie of the client
    generateTokenAndSetCookie(
      { isUserSignedIn: true, userId:user._id,roles:user.roles },
      res,
     {
        cookieName:COOKIE_NAMES.ACCESS_TOKEN,
        expiresIn:COOKIE_TIME.ONE_HOUR,
        maxAge:COOKIE_TIME.ONE_HOUR
     }
    );
    
    //CREATING A REFRESH TOKEN
    generateTokenAndSetCookie({ isUserSignedIn: true, userId:user._id }, res, {
        cookieName: COOKIE_NAMES.REFRESH_TOKEN,
        maxAge: COOKIE_TIME.FIFTEEN_DAYS,
        expiresIn: COOKIE_TIME.FIFTEEN_DAYS,
      });
    //Notifying the Admin to see that the user has been Logged  in real time
    sseStore.addClient(user._id as string,res)
    sseStore.broadcast({message:"new client has logged In"},SSEEventType.USER_SIGNED_IN)
    
    SuccessResponse.ok(res, userDTO, HTTPAuthSuccessMessages.SignInSuccess);
  } catch (err) {
    //For Global Error handling
    next(err);
  }
};

export const userLogoutController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    generateTokenAndSetCookie(
        { isUserSignedIn: false},
        res,
       {
          cookieName:COOKIE_NAMES.ACCESS_TOKEN,
          maxAge: COOKIE_TIME.ZERO,
          expiresIn: COOKIE_TIME.ZERO,
       }
      );
      
      //CREATING A REFRESH TOKEN
      generateTokenAndSetCookie({ isUserSignedIn: false}, res, {
          cookieName: COOKIE_NAMES.REFRESH_TOKEN,
          maxAge: COOKIE_TIME.ZERO,
          expiresIn: COOKIE_TIME.ZERO,
        });
    SuccessResponse.ok(res, {}, HTTPAuthSuccessMessages.SignOutSucess);
  } catch (e) {
    //For Global Error handling
    next(e);
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsers();    
    SuccessResponse.ok(res, users, HTTPAuthSuccessMessages.GetSuccess);
  } catch (err) {
    //For Global Error handling
    next(err);
  }
};
