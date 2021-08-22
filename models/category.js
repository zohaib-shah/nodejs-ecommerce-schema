'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Product, {
        foreignKey: 'category_id', 
        through: 'CategoryProduct',
        as: 'products' 
      });
      this.hasMany(models.CategoryProductField,{ foreignKey : 'category_id', as : 'available_product_fields' });
    }
  };
  Category.init({
    name: DataTypes.STRING,
    sort_order: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    is_active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};