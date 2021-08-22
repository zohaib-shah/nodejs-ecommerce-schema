'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SearchAttribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Search, {
        foreignKey: 'search_id', 
        as: 'search' 
      });
      this.belongsTo(models.CategoryProductField, {
        foreignKey: 'category_field_id', 
        as: 'category_product_field' 
      });  
    }
  };
  SearchAttribute.init({
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    operator: DataTypes.STRING,
    category_field_id: DataTypes.INTEGER,
    search_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'SearchAttribute',
  });
  return SearchAttribute;
};