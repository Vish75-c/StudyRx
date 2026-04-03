import e from "express";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ name, email, password });

        }
        const user=await User.create({name,email,password})
        res.status(201).json({
            _id: user._id,
            name: user.email,
            token: generateToken(user._id)
        });
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user=await User.findOne({email});
        if(!user||!(await user.comparePassword(password))){
            return res.status(401).json({message:"Invalid Email or password"})
        }
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id),
        })
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export default getMe=async (req,res)=>{
    try {
        return res.json({_id:req.user._id,name:req.user.name,email:req.user.email});
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};

export const updatePassword=async (req,res)=>{
    try {
        const {currentPassword,newPassword}=req.body;
        const user=await User.findById(req.user._id)
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({message:"Current Password is incorrect"})
        }
        user.password=newPassword;
        await user.save()
        res.json({message:"Password update successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

export const deleteAccount=async (req,res)=>{
    try {
        await User.findByAndDelete(req.user._id);
        res.json({message:"Account deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
};

