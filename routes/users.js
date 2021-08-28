var express = require('express');
var router = express.Router();
const models = require('./../models');
const auth = require('./../middlewares/auth');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = models.User;
dotenv.config();

router.post('/', async(req, res, next) => {
  try {
    if(typeof req.body.first_name == "undefined"){
      throw "First Name is required";
    }
    if(typeof req.body.last_name == "undefined"){
      throw "Last Name is required";
    }
    if(typeof req.body.username == "undefined"){
      throw "Username is required";
    }
    if(typeof req.body.email == "undefined"){
      throw "Email is required";
    }
    if(typeof req.body.password == "undefined"){
      throw "Password is required";
    }
  } catch(err){
    return res.status(400).json({ "msg":err });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    var usr = {
      first_name : req.body.first_name,
      last_name : req.body.last_name,
      user_name : req.body.username,
      role : "user",//default role
      email : req.body.email,
      hashed_password : await bcrypt.hash(req.body.password, salt),
      city : typeof req.body.city !== "undefined" ? req.body.city : "",
      country : typeof req.body.country !== "undefined" ? req.body.country : ""
    };
    
    created_user = await User.create(usr);
    res.status(201).json(created_user);
  } catch(err){
    return res.status(500).json(err);
  }
  
});

router.post('/login',async(req,res,next)=>{
//res.json({"secret":process.env.SECRET});
const user = await User.findOne({ where : {email : req.body.email }});
if(user){
  const password_valid = await bcrypt.compare(req.body.password,user.hashed_password);
  if(password_valid){
      token = jwt.sign({ "id" : user.id,"email" : user.email,"first_name":user.first_name },process.env.SECRET);
      res.status(200).json({ token : token });
  } else {
    res.status(400).json({ error : "Password Incorrect" });
  }

}else{
  res.status(404).json({ error : "User does not exist" });
}

});

module.exports = router;
