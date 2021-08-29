var express = require('express');
var router = express.Router();
const models = require('./../models');
const auth = require('./../middlewares/auth');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const category = require('../models/category');
const User = models.User;
const Search = models.Search;
dotenv.config();

router.get('/',async(req,res,next)=>{
      try {
        const searches = await Search.findAll();
  res.status(200).json(searches);
      }  catch(err){
          return res.status(500).json(err);
      }
});
router.post('/', auth ,async(req,res,next)=>{
    const { category_id, user_id ,  is_active } = req.body;
    const search = new Search();
    try {
        
        if(category_id != null){
            search.category_id = category_id;
        } else {
            throw "category_id is required";
        }
        if(user_id != null){
            search.user_id = user_id;
        } else {
            throw "user_id is required";
        }
         
        try {
            search.is_active = true;
            await search.save();
            res.status(201).json(search);
        } catch(err){
            res.status(500).json({"msg":err});
        }
        
    } catch(err){
        res.status(400).json({ "msg" : "Bad Request" });
    }
});

router.get('/:id', async(req, res, next) => {
    const { id } = req.params;
    try {
        const search = await Search.findByPk(id);
        if(search == null){
            res.status(404).json({"msg":"Not found"});
        }
        res.status(200).json(search);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

  router.put('/:id', auth , async(req, res, next) => {//update is only possible from logged in users
   
    try {
        const { id } = req.params;
        const search = await Search.findByPk(id);
        if(search == null){
            res.status(404).json({"msg":"Not found"});
        }
        const { category_id, user_id ,  is_active } = req.body;
        if(category_id != null){
            search.category_id = category_id;
        }
        if(user_id != null){
            search.user_id = user_id;
        }
        if(is_active != null){
            search.is_active = is_active;
        }
        await search.save();
        res.status(200).json(search);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

module.exports = router;
