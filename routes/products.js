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
const ProductAttribute = models.ProductAttribute;
const CategoryProductField = models.CategoryProductField;
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

//   product attribute routes start
router.get('/:product_id/attributes/',async(req,res,next)=>{
    const { product_id } = req.params;
    const product = Product.findByPk(product_id);
    try {
        if(product == null){
            throw "Product Not found";
        }
    } catch(err){
        res.status(404).json({"msg":err});//Product not found
    }
    try {
        const product_attributes = await ProductAttribute.findAll({ where :{ product_id : product_id } });
        res.status(200).json(product_attributes);
    }  catch(err){
        return res.status(500).json(err);
    }
});

router.get('/:product_id/attributes/:id', async(req, res, next) => {
    const { product_id , id } = req.params;
    const product = Product.findByPk(product_id);
    try {
        if(product == null){
            throw "Product Not found";
        }
    } catch(err){
        res.status(404).json({"msg":err});//Product not found
    }
    try {
        const product_attribute = await ProductAttribute.findByPk(id);
        if(product_attribute == null){
            res.status(404).json({"msg":"Attribute Not found"});
        }
        res.status(200).json(product_attribute);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

  router.post('/:product_id/attributes/', auth ,async(req,res,next)=>{
    const { product_id } = req.params;
    const { value , category_field_id } = req.body;
    const attribute = new ProductAttribute();
    try {
        if(value == null){
            throw "Value of the field required";
        } else {
            attribute.value = value;
        }
        if(category_field_id == null){
            throw "Every Product Attribute must belong to it's category field";
        } else {
            attribute.category_field_id = category_field_id;
        }
        const category_product_field = await CategoryProductField.findByPk(category_field_id);
        const product = await Product.findByPk(product_id);
        if(category_product_field == null || product == null){
            throw "Invalid category field or product id given";
        }
        attribute.name = category_product_field.name;//copying attribute name from category field 
        try {
            attribute.product_id = product_id;
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

router.put('/:product_id/attributes/:id', auth ,async(req,res,next)=>{
    const { product_id, id } = req.params;
    const { value , category_field_id } = req.body;
    const attribute = await ProductAttribute.findByPk(id);
    try {
        if(value != null){
            attribute.value = value;
        }
        if(category_field_id != null){
            const category_product_field = await CategoryProductField.findByPk(category_field_id);
            if(category_product_field == null){
                throw "Category field doesn't exist";
            }
            attribute.name = category_product_field.name;
            attribute.category_field_id = category_field_id;
        }
        
        const product = await Product.findByPk(product_id);
        if(product == null){
            throw "Invalid product id given";
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
// product attribute routes end

//   product images routes start
router.get('/:product_id/images/',async(req,res,next)=>{
    const { product_id } = req.params;
    const product = Product.findByPk(product_id);
    try {
        if(product == null){
            throw "Product Not found";
        }
    } catch(err){
        res.status(404).json({"msg":err});//Product not found
    }
    try {
        const product_images = await ProductImage.findAll({ where :{ product_id : product_id } });
        res.status(200).json(product_images);
    }  catch(err){
        return res.status(500).json(err);
    }
});

router.get('/:product_id/images/:id', async(req, res, next) => {
    const { product_id , id } = req.params;
    const product = Product.findByPk(product_id);
    try {
        if(product == null){
            throw "Product Not found";
        }
    } catch(err){
        res.status(404).json({"msg":err});//Product not found
    }
    try {
        const product_image = await ProductImage.findByPk(id);
        if(product_image == null){
            res.status(404).json({"msg":"Image Not found"});
        }
        res.status(200).json(product_image);
      }  catch(err){
          return res.status(500).json(err);
      }
  });

  router.post('/:product_id/images/', auth ,async(req,res,next)=>{
    const { product_id } = req.params;
    const { title , alt , slug , url , mime_type } = req.body;
    const image = new ProductImage();
    try {
        if(title == null){
            throw "title of image required";
        } else {
            image.title = title;
        }
        if(url == null){
            throw "URL of image required";
        } else {
            image.url = url;
        }
        if(alt == null){
            image.alt = "";
        } else {
            image.alt = alt;
        }
        if(slug == null){
            image.slug = "";
        } else {
            image.slug = slug;
        }
        if(mime_type == null){
            image.mime_type = "";
        } else {
            image.mime_type = mime_type;
        }
        
        const product = await Product.findByPk(product_id);
        if(product == null){
            throw "Invalid product id given";
        }
        
        try {
            image.product_id = product_id;
            
            await image.save();
        res.status(201).json(image);
        } catch(err){
            res.status(500).json(err);
        }
        
    } catch(err){
        res.status(400).json(err);
    }
    
});

router.put('/:product_id/images/:id', auth ,async(req,res,next)=>{
    const { product_id, id } = req.params;
    const { title , alt , slug , url , mime_type } = req.body;
    const image = await ProductImage.findByPk(id);
    try {
        if(title != null){
            image.title = title;
        }
        if(alt != null){
            image.alt = alt;
        }
        if(slug != null){
            image.slug = slug;
        }
        if(url != null){
            image.url = url;
        }
        if(mime_type != null){
            image.mime_type = mime_type;
        }
      
        
        const product = await Product.findByPk(product_id);
        if(product == null){
            throw "Invalid product id given";
        }
        try {
            await image.save();
        res.status(201).json(attribute);
        } catch(err){
            res.status(500).json(err);
        }
        
    } catch(err){
        res.status(400).json(err);
    }
    
});
// product images routes end

module.exports = router;
