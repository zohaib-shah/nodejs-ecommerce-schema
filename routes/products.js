var express = require('express');
var router = express.Router();
const models = require('./../models');
const auth = require('./../middlewares/auth');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const category = require('../models/category');
const User = models.User;
const Product = models.Product;
dotenv.config();

router.get('/',async(req,res,next)=>{
      try {
        const products = await Product.findAll();
  res.status(200).json(products);
      }  catch(err){
          return res.status(500).json(err);
      }
});
router.post('/', auth ,async(req,res,next)=>{
    const { sku, name ,  description, price , unit_price , taxes } = req.body;
    const product = new Product();
    try {
        
        if(name != null){
            product.name = name;
        } else {
            throw "Product Name is required";
        }
        if(sku != null){
            product.sku = sku;
        } else {
            throw "Product SKU or unique key is required";
        }
        if(description != null){
            product.description = description;
        } else {
            throw "Product description is requried";
        }
        if(price != null){
            product.price = price;
        } else {
            throw "Product price is requried";
        }
        if(unit_price != null){
            product.unit_price = unit_price;
        } else {
            product.unit_price = 0.00; //unit price is optional
        }
        if(taxes != null){
            product.taxes = taxes;
        } else {
            product.taxes = 0.00; //taxes is optional
        } 
        try {
            await product.save();
            res.status(201).json(product);
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
        const product = await Product.findByPk(id);
        if(product == null){
            res.status(404).json({"msg":"Not found"});
        }
        res.status(200).json(product);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

  router.put('/:id', auth , async(req, res, next) => {//update is only possible from logged in users
   
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if(product == null){
            res.status(404).json({"msg":"Not found"});
        }
        const { sku, name ,  description, price , unit_price , taxes } = req.body;
        if(sku != null){
            product.sku = sku;
        }
        if(name != null){
            product.name = name;
        }
        if(description != null){
            product.description = description;
        }
        if(price != null){
            product.price = price;
        }
        if(unit_price != null){
            product.unit_price = unit_price;
        }
        if(taxes != null){
            product.taxes = taxes;
        }
        
        await product.save();
        res.status(200).json(product);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

module.exports = router;
