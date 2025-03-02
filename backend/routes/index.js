const express=require("express")
const rootrouter=express.Router()
const userrouter=require("./users")
const accountrouter=require("./accounts")
rootrouter.use("/user",userrouter)
rootrouter.use("/account",accountrouter)
module.exports=rootrouter