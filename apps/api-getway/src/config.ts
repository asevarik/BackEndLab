import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("Missing environment variables!");
}

//Add Config Variable Names here....
export const processEnv = {
  port: parseInt(process.env.PORT, 10),
  authService: process.env.AUTH_SERVICE_URL,
};