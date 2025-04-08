import { NextFunction, Request, Response } from "express";
import { IHTTPError } from "./extensions/errors.extension";
import { ErrorMessages } from "./enums/error-messages.enum";


export const exceptionHandler = (
  err: IHTTPError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  const statusCode = err.statusCode || 500;
  const message = err.message || ErrorMessages.Generic;
  const response = err.data || null;
  console.log("logs from this some thing",err.message);
  
  //TODO: optional we can add logger in the future

  return res
    .status(statusCode)
    .send({ statusCode, message,
        //If the data is there then send it along with it 
        ...(response && { response })
     });
};