import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
const generateToken=(userId)=>{
    console.log("IN")
    console.log(process.env.JWT_SECRET)
    return jwt.sign({id:userId},"2463",{
        expiresIn:"7d",
    })
}

export default generateToken