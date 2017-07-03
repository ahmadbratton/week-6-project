'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    username: DataTypes.STRING(20),
    password: DataTypes.STRING(20),
  }, {});
  users.associate = function (models) {
    users.hasMany(models.messages, {as: 'messages', foreignKey: 'userId'});
      users.hasMany(models.likes, {as:"likes", foreignKey: "userId"});
  }
  return users;
};
