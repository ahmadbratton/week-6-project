'use strict';
module.exports = function(sequelize, DataTypes) {
  var messages = sequelize.define('messages', {
    body: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  messages.associate = function (models) {
    messages.belongsTo(models.users, {as:"users", foreignKey: "userId"});
    messages.hasMany(models.likes, {as:"likes", foreignKey: "messageId"});
  }
  return messages;
};
