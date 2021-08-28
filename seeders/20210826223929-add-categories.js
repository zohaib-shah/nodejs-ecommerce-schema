var faker = require('faker');
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   var categories = ["Electronics","Real Estate","Books","Fashion","Online Products"];
   var dummyJSON = [];
   for(var i = 0 ; i < 5 ; i++){
      dummyJSON.push({
        name : categories[i],
        sort_order : 0,
        parent_id : 0,
        is_active : 1,
        createdAt : new Date(),
    updatedAt : new Date()
      });
   }
   await queryInterface.bulkInsert('Categories',dummyJSON,{});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Categories', null, {});
  }
};