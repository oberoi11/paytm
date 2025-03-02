const express=require("express")
const {User, Account } = require("../db")
const { authmiddleware } = require("../middleware")
//why{} for jwt secret key
const {JWT_SECRET_KEY}=require("../config")
const mongoose=require("mongoose")
const accountrouter=express.Router()
accountrouter.get("/balance",authmiddleware,async(req,res)=>{
    const account=await Account.findOne({
        //what is req.userid
        userid:req.userid
    })
    res.json({
        balance:account.balance
    })
})
// accountrouter.post("/transfer",authmiddleware,async(req,res)=>{
//     const {amount,to}=req.body
//     const account=await Account.findOne({
//         userid:req.userid
//     })
//     if(account.balance<amount){
//         return res.json({
//             message:"Insufficient balance"
//         })
//     }
//     const toaccount=await Account.findOne({
//         userid:to
//     })
//     if(!toaccount){
//         return res.status(400).json({
//             message:"Account doesnt exist"
//         })
//     }
//     await Account.updateOne({
//         userid:req.userid,
//         $inc:{
//             balance:-amount
//         }
//     })
//     await Account.updateOne({
//         userid:to,
//         $inc:{
//             balance:amount
//         }
//     })
//     res.json({
//         messgae:"transfer successful"
//     })
// })
accountrouter.post("/transfer",authmiddleware,async(req,res)=>{
    const session=await mongoose.startSession()
    await session.startTransaction()
    const {amount,to}=req.body
    const account = await Account.findOne({
        userid:req.userid
    }).session(session)
    if(!account || account.balance<amount){
        await session.abortTransaction()
        return res.json({
            message:"Insufficient balance"
        })
    }
    const toaccount=await Account.findOne({userid:to}).session(session)
    if(!toaccount){
        await session.abortTransaction()
        return res.status(400).json({
            message:"Account doesnt exist"
        })
    }
    await Account.updateOne({userid:req.userid},{$inc:{balance:-amount}}).session(session)
    await Account.updateOne({userid:to},{$inc:{balance:amount}}).session(session)
    await session.commitTransaction()
    res.json({
        message:"Transaction successfull"
    })
})
module.exports=accountrouter