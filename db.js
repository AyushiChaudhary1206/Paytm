const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://ayushichaudhary:asdfghjkl@cluster0.kshwrlj.mongodb.net/");

const UserSchema=mongoose.Schema({
username:String,
password:String,
firstname:String,
lastname:String
})
const AccountSchema=new mongoose.Schema({
    userid:{
        type:String,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})
const  User=mongoose.model("User",UserSchema);
const  Account=mongoose.model("Account",AccountSchema)
module.exports={
    User,
    Account
}