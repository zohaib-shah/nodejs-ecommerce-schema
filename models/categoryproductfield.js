'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryProductField extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {
        foreignKey: 'category_id', 
        as: 'category' 
      });
      this.hasMany(models.ProductAttribute,{ foreignKey : 'category_field_id', as : 'linked_attributes' });
      this.hasMany(models.SearchAttribute,{ foreignKey : 'category_field_id', as : 'search_attributes' });
    }
  };
  CategoryProductField.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    category_id: DataTypes.INTEGER,
    placement_areas: DataTypes.STRING,
    show_on_filter: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'CategoryProductField',
  });
  return CategoryProductField;
};