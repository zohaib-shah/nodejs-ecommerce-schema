'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Category, {
        foreignKey: 'product_id', 
        through: 'CategoryProduct',
        as: 'categories' 
      });
      this.hasMany(models.ProductAttribute,{ foreignKey : 'product_id', as : 'attributes' });
    }
  };
  Product.init({
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    description : DataTypes.TEXT,
    price : DataTypes.FLOAT,
    unit_price : DataTypes.FLOAT,
    taxes : DataTypes.FLOAT, 
    is_active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};