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
const SearchAttribute = models.SearchAttribute;
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

  //   search attribute routes start
router.get('/:search_id/attributes/',async(req,res,next)=>{
    const { search_id } = req.params;
    const search = Search.findByPk(search_id);
    try {
        if(search == null){
            throw "Search Not found";
        }
    } catch(err){
        res.status(404).json({"msg":err});//Product not found
    }
    try {
        const search_attributes = await SearchAttribute.findAll({ where :{ search_id : search_id } });
        res.status(200).json(search_attributes);
    }  catch(err){
        return res.status(500).json(err);
    }
});

router.get('/:search_id/attributes/:id', async(req, res, next) => {
    const { search_id , id } = req.params;
    const search = Search.findByPk(search_id);
    try {
        if(search == null){
            throw "Search Not found";
        }
    } catch(err){
        res.status(404).json({"msg":err});//Product not found
    }
    try {
        const search_attribute = await SearchAttribute.findByPk(id);
        if(search_attribute == null){
            res.status(404).json({"msg":"Attribute Not found"});
        }
        res.status(200).json(search_attribute);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

  router.post('/:search_id/attributes/', auth ,async(req,res,next)=>{
    const { search_id } = req.params;
    const { value , operator ,category_field_id } = req.body;
    const attribute = new SearchAttribute();
    try {
        if(value == null){
            throw "Value of the field required";
        } else {
            attribute.value = value;
        }
        if(category_field_id == null){
            throw "Every Search Attribute must belong to it's category field";
        } else {
            attribute.category_field_id = category_field_id;
        }
        const category_product_field = await CategoryProductField.findByPk(category_field_id);
        const search = await Search.findByPk(search_id);
        if(category_product_field == null || search == null){
            throw "Invalid category field or search id given";
        }
        attribute.name = category_product_field.name;//copying attribute name from category field 
        try {
            attribute.search_id = search_id;
            attribute.category_field_id = category_field_id;
            await attribute.save();
        res.status(201).json(attribute);
        } catch(err){
            res.status(500).json(err);
        }
        
    } catch(err){
        res.status(400).json(err);
    }
    
});

router.put('/:search_id/attributes/:id', auth ,async(req,res,next)=>{
    const { search_id, id } = req.params;
    const { value , category_field_id } = req.body;
    const attribute = await SearchAttribute.findByPk(id);
    try {
        if(value != null){
            attribute.value = value;
        }
        if(operator != null){
            attribute.operator = operator;
        }
        if(category_field_id != null){
            const category_product_field = await CategoryProductField.findByPk(category_field_id);
            if(category_product_field == null){
                throw "Category field doesn't exist";
            }
            attribute.name = category_product_field.name;
            attribute.category_field_id = category_field_id;
        }
        
        const search = await Search.findByPk(search_id);
        if(search == null){
            throw "Invalid search id given";
        }
        try {
            await attribute.save();
        res.status(201).json(attribute);
        } catch(err){
            res.status(500).json(err);
        }
        
    } catch(err){
        res.status(400).json(err);
    }
    
});
// search attribute routes end

module.exports = router;
