const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fee = sequelize.define("Fee", {
  studentId: {
    type: DataTypes.STRING, // STU001
    allowNull: false,
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paidAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dueAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Fee;
