'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Search extends Model {
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
      this.belongsTo(models.User, {
        foreignKey: 'user_id', 
        as: 'user' 
      });
    }
  };
  Search.init({
    category_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Search',
  });
  return Search;
};