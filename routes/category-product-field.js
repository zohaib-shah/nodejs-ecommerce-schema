var express = require('express');
var router = express.Router();
const models = require('./../models');
const auth = require('./../middlewares/auth');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const CategoryProductField = require('../models/CategoryProductField');
const User = models.User;
const CategoryProductField = models.CategoryProductField;
dotenv.config();

router.get('/',async(req,res,next)=>{
      try {
        const category_product_fields = await CategoryProductField.findAll();
  res.status(200).json(category_product_fields);
      }  catch(err){
          return res.status(500).json(err);
      }
});

router.post('/', auth ,async(req,res,next)=>{
    const { name, sort_order , parent_id } = req.body;
    const CategoryProductField = new CategoryProductField();
    try {
        
        if(name != null){
            CategoryProductField.name = name;
        } else {
            throw "CategoryProductField Name is required";
        }
        if(sort_order != null){
            CategoryProductField.sort_order = sort_order;
        } else {
            throw "CategoryProductField sort order is required";
        }
        if(parent_id != null){
            CategoryProductField.parent_id = parent_id;
        } 
        try {
            await CategoryProductField.save();
            res.status(201).json(CategoryProductField);
        } catch(err){
            res.status(500).json({"msg":err});
        }
        
    } catch(err){
        res.status(400).json({ "msg" : "Bad Request" });
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        const CategoryProductField = await CategoryProductField.findByPk(req.params.id);
        if(CategoryProductField == null){
            res.status(404).json({"msg":"Not found"});
        }
  res.status(200).json(CategoryProductField);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

  router.put('/:id', auth , async(req, res, next) => {//update is only possible from logged in users
   
    try {
        const CategoryProductField = await CategoryProductField.findByPk(req.params.id);
        if(CategoryProductField == null){
            res.status(404).json({"msg":"Not found"});
        }
        const { name, sort_order , parent_id } = req.body;
        if(name != null){
            CategoryProductField.name = name;
        }
        if(sort_order != null){
            CategoryProductField.sort_order = sort_order;
        }
        if(parent_id != null){
            CategoryProductField.parent_id = parent_id;
        }
        CategoryProductField.save();
  res.status(200).json(CategoryProductField);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

module.exports = router;
