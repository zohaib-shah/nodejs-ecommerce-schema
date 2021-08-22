'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductAttribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {
        foreignKey: 'product_id', 
        as: 'product' 
      });
      this.belongsTo(models.CategoryProductField, {
        foreignKey: 'category_field_id', 
        as: 'category_field' 
      });
    }
  };
  ProductAttribute.init({
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    category_field_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductAttribute',
  });
  return ProductAttribute;
};