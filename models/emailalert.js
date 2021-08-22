'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailAlert extends Model {
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
      this.belongsTo(models.User, {
        foreignKey: 'user_id', 
        as: 'user' 
      });
    }
  };
  EmailAlert.init({
    sent: DataTypes.BOOLEAN,
    search_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EmailAlert',
  });
  return EmailAlert;
};