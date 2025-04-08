import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("Missing environment variables!");
}

//Add Config Variable Names here....
export const processEnv = {
  port: parseInt(process.env.PORT, 10),
  mongo_uri: process.env.MONGO_URI,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expiration: process.env.JWT_EXPIRE,
};