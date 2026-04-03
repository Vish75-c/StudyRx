import express from "express"
import { Router } from "express";
import { register,login,getMe,updatePassword,deleteAccount } from "../controllers/authController.js";

import protect from "../middleware/auth.js";

const authRoutes=Router();
authRoutes.post("/register",register);
authRoutes.post("/login",login)
authRoutes.get("/me",protect,getMe);
authRoutes.put("/password",protect,updatePassword)
authRoutes.delete("/delete",protect,deleteAccount)

export default authRoutes