import {  UserModel } from "../Modals/DBSchemas/Moongoose";
import {  UserLoginDTO, UserObject } from "../Modals/zod/User";
import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from "../shared/exceptions/http.exceptions";
import { IMongooseError } from "../shared/extensions/errors.extension";
import bcrypt from "bcryptjs";

export const createUser  = async(userDTO:UserObject)=>{
    try{
        //Generating the salt 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userDTO.password,salt);
        const saveUser = new UserModel({...userDTO,password:hashedPassword});
        //saving the user to the database
        const user = await saveUser.save();
        return user
    }catch (err){
        const error = err as IMongooseError
        if(error.code===11000){
            throw new ConflictException('User already exists with this email or username',userDTO)
        }
        //Some Unknown Error Occured
        throw new InternalServerErrorException('Internal Server Error',error)
    }
}

export const signInUser = async(userDTO:UserLoginDTO)=>{
    try{
        const user = await UserModel.findOne({email:userDTO.email})
        if(!user){
            throw new NotFoundException('User not found',userDTO)
        }
        const isUserHasCorrectPassword = await bcrypt.compare(userDTO.password,user?.password??"")
        
        if(!isUserHasCorrectPassword){
            throw new BadRequestException('Invalid Credentials',userDTO)
        }
        return user
    }catch(e){
        throw e
    }
}

export const getOneUserById = async(userId:string)=>{
    try{
        const user = await UserModel.findOne({_id:userId})
        if(!user){
            throw new NotFoundException('User not found')
        }
        return user
    }catch(e){
        throw e
    }
}

export const getUsers = async()=>{
    try{
        const users = await UserModel.find()        
        if(users.length==0){
            throw new NotFoundException('No Users Found')
        }
        return users
    }catch(err){
        throw err
    }
}