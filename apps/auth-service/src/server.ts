import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { processEnv } from './config';
import morgan from 'morgan';
import authRoutes from './Routes/router';
//FOR ACCESSING THE DOTENV VARIABLES
config()

//STARTING THE SERVER
const app = express();

//LOGGING
app.use(morgan('combined'))

app.listen(processEnv.port,(err:any)=>{
    if(err)console.log("error starting the server",err)
    console.log("server started at port",processEnv.port);
})

app.get('/health',(req:Request,res:Response)=>{
    res.status(200).json({
        status:true,
        message:'auth service is up and running on port '+ processEnv.port
    })
})

//AUTH ROUTES
app.use(authRoutes);