'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ProductImage.init({
    title: DataTypes.STRING,
    alt: DataTypes.STRING,
    url: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    mime_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductImage',
  });
  return ProductImage;
};