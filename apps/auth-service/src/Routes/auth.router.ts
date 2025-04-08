import { Request, Response, Router } from "express";
import { sanatizeUserModelMiddleware } from "../Middlewares/sanitizationMiddleware";
import { userRegistrationController } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.get('/login',(req:Request,res:Response)=>{
    res.status(200).json(({
        status:true,
        message:'login success'
    }))
})

authRoutes.post('/signup',sanatizeUserModelMiddleware,userRegistrationController)

authRoutes.get('/logout',(req:Request,res:Response)=>{
    res.status(200).json(
        {
            status:true,
            message:'logut successfull'
        }
    )
})

export default authRoutes;