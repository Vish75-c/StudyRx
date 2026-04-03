import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config();
export const verifyToken = (req, res, next) => {

    const token = req.cookies.jwt;
    // console.log(token);
    if (!token) return res.status(401).send("You are not authenticated")
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send("Token is not valid")
        } else {
            req.userId = payload.userId;
            // console.log(req.user);
            next()
        }
    })


}