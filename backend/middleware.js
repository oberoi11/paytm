const express=require("express")
const { JWT_SECRET_KEY } = require("./config")
const jwt=require("jsonwebtoken")
const authmiddleware=(req,res,next)=>{
    const authheader=req.headers.authorization
    if(!authheader || !authheader.startsWith('Bearer ')){
        return res.status(411).json({
        })
    }
    const token=authheader.split(' ')[1]
    try{
        const decoded=jwt.verify(token,JWT_SECRET_KEY)
        //what is userid where is it
        req.userid=decoded.userid
        next()
    }catch(e){
        return res.status(411).json({
            message:"Cannot validate error"
        })
    }
}
module.exports={authmiddleware}