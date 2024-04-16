const mongoose=require("mongoose")
const plm=require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1/testauthenticate");

let userSchema=mongoose.Schema({
  username:String,
  email:String,
  password:String,
  fullname:String,
  profileImage:String,
})

userSchema.plugin(plm);

module.exports=mongoose.model("user",userSchema);
