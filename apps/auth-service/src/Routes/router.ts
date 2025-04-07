import { Request, Response, Router } from "express";

const authRoutes = Router();

authRoutes.get('/login',(req:Request,res:Response)=>{
    res.status(200).json(({
        status:true,
        message:'login success'
    }))
})

authRoutes.get('/signup',(req:Request,res:Response)=>{
    res.status(200).json(({
        status:true,
        message:'signup success'
    }))
})

export default authRoutes;