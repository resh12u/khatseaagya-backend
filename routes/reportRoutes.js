const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Fee = require("../models/Fee");
const Attendance = require("../models/Attendance");

/**
 * Get full report for a student
 */
router.get("/student/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const student = await Student.findOne({
      where: { studentId },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const fees = await Fee.findAll({
      where: { studentId },
      order: [["month", "ASC"]],
    });

    const attendance = await Attendance.findAll({
      where: { studentId },
    });

    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === "Present").length;
    const attendancePercentage =
      totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

    res.json({
      student: {
        studentId: student.studentId,
        name: student.name,
        className: student.className,
        phone: student.phone,
      },
      fees,
      attendance: {
        totalDays,
        presentDays,
        percentage: attendancePercentage,
      },
    });
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
