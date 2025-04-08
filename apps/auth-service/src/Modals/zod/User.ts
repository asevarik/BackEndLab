
import {z} from 'zod';

export const userObject = z.object({
    username:z.string().nonempty('username is required'),
    name:z.string().nonempty('first name is required'),
    email:z.string().email().nonempty('Email is required'),
    password:z.string().min(5).nonempty('password is required'),
})

//Exporting the UserObject from the Zod
export type UserObject = z.infer<typeof userObject>;


export const userLoginObject = z.object({
    email:z.string().email().nonempty('Email is required'),
    password:z.string().min(5).nonempty('password is required'),
})

export type UserLoginDTO = z.infer<typeof userLoginObject>;