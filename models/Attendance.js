const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attendance = sequelize.define("Attendance", {
  studentId: {
    type: DataTypes.STRING, // STU001
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING, // YYYY-MM-DD
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // Present | Absent
    allowNull: false,
  },
});

module.exports = Attendance;
