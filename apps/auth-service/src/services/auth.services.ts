import {  UserModel } from "../Modals/DBSchemas/Moongoose";
import {  UserLoginDTO, UserObject } from "../Modals/zod/User";
import { ConflictException, InternalServerErrorException } from "../shared/exceptions/http.exceptions";
import { IMongooseError } from "../shared/extensions/errors.extension";
import bycrypt from "bcryptjs";
export const createUser  = async(userDTO:UserObject)=>{
    try{
        //Generating the salt 
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(userDTO.password,salt);
        const saveUser = new UserModel({...userDTO,password:hashedPassword});
        //saving the user to the database
        const user = await saveUser.save();
        return userDTO
    }catch (err){
        const error = err as IMongooseError
        if(error.code===11000){
            throw new ConflictException('User already exists with this email or username',userDTO)
        }
        //Some Unknown Error Occured
        throw new InternalServerErrorException('Internal Server Error',error)
    }
}

export const SignInUser = async(userDTO:UserLoginDTO)=>{
    try{

    }catch(e){

    }
}