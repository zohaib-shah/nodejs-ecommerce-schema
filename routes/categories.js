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
const CategoryProductField = models.CategoryProductField;
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
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
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

//   product field routes starts
router.get('/:category_id/fields/',async(req,res,next)=>{
    const { category_id } = req.params;
    try {
        const category_product_fields = await CategoryProductField.findAll({ where :{ category_id : category_id } });
      console.log(category_product_fields);
res.status(200).json(category_product_fields);
    }  catch(err){
        return res.status(500).json(err);
    }
});

router.post('/:category_id/fields/', auth ,async(req,res,next)=>{
    const { category_id } = req.params;
    const { name , type , is_active , placement_areas, show_on_filter } = req.body;
    const category_product_field = new CategoryProductField();
    const category = await Category.findByPk(category_id);
    try {
        if(name == null){
            throw "Name of the field required";
        } else {
            category_product_field.name = name;
        }
        if(type == null){
            throw "Type of the field required .i.e. string, integer , float";
        } else {
            category_product_field.type = type;
        }
        if(show_on_filter == null){
            throw "please tell if you need this field while filtering";
        } else {
            category_product_field.show_on_filter = show_on_filter;
        }
        if(category == null){
            throw "Category doesn't exist";
        }
        try {
            category_product_field.category_id = category_id;
            category_product_field.is_active = true;
            await category_product_field.save();
        res.status(201).json(category_product_field);
        } catch(err){
            res.status(500).json(err);
        }
        
    } catch(err){
        res.status(400).json(err);
    }
    
});

router.get('/:category_id/fields/:id', async(req, res, next) => {
    const { category_id , id } = req.params;
    try {
        const category_product_field = await CategoryProductField.findByPk(id);
        if(category_product_field == null){
            res.status(404).json({"msg":"Not found"});
        }
        res.status(200).json(category_product_field);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

  router.put('/:category_id/fields/:id',auth, async(req, res, next) => {
    const { category_id , id } = req.params;
    const category = await Category.findByPk(category_id);
    const category_product_field = await CategoryProductField.findByPk(id);
    const { name , type , is_active , placement_areas, show_on_filter } = req.body;
    try {//check for bad request
        if(category == null){
            throw "Category Doesn't exist";
        }
        if(category_product_field == null){
            throw "Category Product field Doesn't exist";
        }
    } catch(err){
        res.status(400).json({"msg":err});
    }
    if(name != null){
        category_product_field.name = name;
    }
    if(type != null){
        category_product_field.type = type;
    }
    if(is_active != null){
        category_product_field.is_active = is_active;
    }
    if(placement_areas != null){
        category_product_field.placement_areas = placement_areas;
    }
    if(show_on_filter != null){
        category_product_field.show_on_filter = show_on_filter;
    }
    try {
        await category_product_field.save();
        res.status(200).json(category_product_field);
    } catch(err){
        res.status(500).json(err);
    }
  });
// product field routes ends

module.exports = router;
