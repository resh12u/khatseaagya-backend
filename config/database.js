const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
  dialectModule: require("better-sqlite3"),
});

module.exports = sequelize;
