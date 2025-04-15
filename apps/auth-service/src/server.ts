import express, { ErrorRequestHandler, Request, Response } from 'express';
import { config } from 'dotenv';
import { processEnv } from './config';
import morgan from 'morgan';
import authRoutes from './Routes/auth.router';
import { exceptionHandler } from './shared/GlobalErrorHandler';
import { connectDB } from './db/moongooseDBConnect';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//FOR ACCESSING THE DOTENV VARIABLES
config()

//STARTING THE SERVER
const app = express();
//For request Object enable
app.use(express.json());
//for accepting the form data
app.use(express.urlencoded({extended:true}))
//FOR COOKIE PARSING
app.use(cookieParser());


//LOGGING
app.use(morgan('combined'))
app.listen(processEnv.port,(err:any)=>{
    if(err)console.log("error starting the server",err)
    console.log("server started at port",processEnv.port);
    connectDB()
})

app.get('/health',(req:Request,res:Response)=>{
    res.status(200).json({
        status:true,
        message:'auth service is up and running on port '+ processEnv.port
    })
})

//AUTH ROUTES
app.use(authRoutes);
//GLOBAL EXCEPTION HANDLER
app.use(exceptionHandler as unknown as express.ErrorRequestHandler);
