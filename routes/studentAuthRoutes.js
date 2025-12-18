const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

/**
 * Student login
 */
router.post("/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;

    const student = await Student.findOne({
      where: { studentId, password, status: "active" },
    });

    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      studentId: student.studentId,
      name: student.name,
      className: student.className,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
