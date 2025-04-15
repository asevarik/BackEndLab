import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import { processEnv } from './config';
import morgan from 'morgan'
import helmet from 'helmet';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
//FOR ACCESSING THE DOTENV VARIABLES
config()

//STARTING THE SERVER
const app = express();
//HELMET AND CORS
app.use(helmet())
app.use(cors({origin:"http://localhost:5173",credentials:true}))
//LOGGING
app.use(morgan('combined'))

app.listen(processEnv.port,(err:any)=>{
    if(err)console.log("error starting the server",err)
    console.log("server started at port",processEnv.port);
})

app.use("/auth",createProxyMiddleware({target:`http://${processEnv.authService}`,changeOrigin:true}))

app.get('/health',(req:Request,res:Response)=>{
    res.status(200).json({
        status:true,
        message:'gateway up and running on port '+ processEnv.port
    })
})
