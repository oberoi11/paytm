const express=require("express")
const userrouter=express.Router()
const {JWT_SECRET_KEY}=require("../config")
const {authmiddleware}=require("../middleware")
const jwt=require("jsonwebtoken")
const {User,Account}=require("../db")
const zod=require("zod")
const signupbody=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
})
const signinbody=zod.object({
    username:zod.string().email(),
    password:zod.string()
})
const updatebody=zod.object({
    password:zod.string().optional(),
    firsname:zod.string().optional(),
    lastname:zod.string().optional()
})
userrouter.post("/signup",async(req,res)=>{
    const {success}=signupbody.safeParse(req.body)
    if(!success){
        return res.json({
            message:"Invalid input"
        })
    }
    const find=await User.findOne({
        username:req.body.username
    })
    if(find){
        return res.json({
            message:"User already Exists"
        })
    }
    const user=await User.create({
        username:req.body.username,
        password:req.body.password,
        lastname:req.body.lastname,
        firstname:req.body.firstname
    })
    const userid=user._id
    await Account.create({
        userid,
        balance:Math.random()*10000+1
    })
    const token=jwt.sign({
        userid
    },JWT_SECRET_KEY)
    return res.json({
        token:token
    })
})
userrouter.post("/signin",async(req,res)=>{
    const {success}=signinbody.safeParse(req.body)
    if(!success){
        return res.json({
            message:"Invalid input"
        })
    }
    const find=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })
    if(find){
        const token=jwt.sign({
            userid:find._id
        },JWT_SECRET_KEY)
        return res.json({
            token:token
        })
    }
    return res.status(411).json({
        message:"Error while logging on"
    })
})
userrouter.put("/",authmiddleware,async(req,res)=>{
    const {success}=updatebody.safeParse(req.body)
    if(!success){
        return res.json({
            message:"Error while updating information"
        })
    }
    //where was userid
    await User.updateOne({_id:req.userid},req.body)
    res.json({
        message:"User updated successfully"
    })
})
userrouter.get("/bulk",async(req,res)=>{
    const filter=req.query.filter || ""
    const user=await User.find({
        $or:[{
            firstname:{
                "$regex":filter
            },
            lastname:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user:user.map(user=>({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user._id
        }))
    })
})
module.exports=userrouter