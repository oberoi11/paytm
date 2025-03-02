const mongoose=require("mongoose")
mongoose.connect("Write you own connection")
const userschema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        minLength:6,
        maxLength:50
    },
    password:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    }
})
const accountschema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})
const User=mongoose.model('User',userschema)
const Account=mongoose.model('Account',accountschema)
module.exports={User,Account}
