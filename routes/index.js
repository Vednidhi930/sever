var express = require('express');
var router = express.Router();
const userModel=require("./users");
const passport = require('passport');
const upload=require("./multer")
const localStrategy=require("passport-local")
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get("/profile",isLoggedIn,async (req,res)=>{
  let user=await userModel.findOne({username:req.session.passport.user})
  res.render("profile",{user})
})

router.get("/login",(req,res)=>{
   res.render("login")
})


router.post("/register",(req,res,next)=>{
  const{username,email,fullname}=req.body
  let data=new userModel({username,email,fullname})
  userModel.register(data,req.body.password)
  .then(()=>{
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/profile")
    })
  })
})

router.post("/upload",isLoggedIn,upload.single("profileimage"),async(req,res,next)=>{

  let userdata=await userModel.findOne({username:req.session.passport.user})
  userdata.profileImage=req.file.filename;
  await userdata.save()
  res.redirect("/profile")

})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/",
}),(req,res)=>{})

router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err) {return next(err)}
    res.redirect("/")
  })
})

function isLoggedIn(req,res,next){
if(req.isAuthenticated()) return next() 
res.redirect("/login")
}


module.exports = router;
