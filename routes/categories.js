var express = require('express');
var router = express.Router();
const models = require('./../models');
const auth = require('./../middlewares/auth');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const category = require('../models/category');
const User = models.User;
const Category = models.Category;
dotenv.config();

router.get('/',async(req,res,next)=>{
      try {
        const categories = await Category.findAll();
  res.status(200).json(categories);
      }  catch(err){
          return res.status(500).json(err);
      }
});

router.post('/', auth ,async(req,res,next)=>{
    const { name, sort_order , parent_id } = req.body;
    const category = new Category();
    try {
        
        if(name != null){
            category.name = name;
        } else {
            throw "Category Name is required";
        }
        if(sort_order != null){
            category.sort_order = sort_order;
        } else {
            throw "Category sort order is required";
        }
        if(parent_id != null){
            category.parent_id = parent_id;
        } 
        try {
            await category.save();
            res.status(201).json(category);
        } catch(err){
            res.status(500).json({"msg":err});
        }
        
    } catch(err){
        res.status(400).json({ "msg" : "Bad Request" });
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if(category == null){
            res.status(404).json({"msg":"Not found"});
        }
  res.status(200).json(category);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

  router.put('/:id', auth , async(req, res, next) => {//update is only possible from logged in users
   
    try {
        const category = await Category.findByPk(req.params.id);
        if(category == null){
            res.status(404).json({"msg":"Not found"});
        }
        const { name, sort_order , parent_id } = req.body;
        if(name != null){
            category.name = name;
        }
        if(sort_order != null){
            category.sort_order = sort_order;
        }
        if(parent_id != null){
            category.parent_id = parent_id;
        }
        category.save();
  res.status(200).json(category);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

module.exports = router;
