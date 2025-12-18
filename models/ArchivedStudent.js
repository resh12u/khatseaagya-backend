const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ArchivedStudent = sequelize.define("ArchivedStudent", {
  originalStudentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  className: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ArchivedStudent;
