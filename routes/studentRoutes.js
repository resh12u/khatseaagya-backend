const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const ArchivedStudent = require("../models/ArchivedStudent");
const Fee = require("../models/Fee");

/**
 * Add student
 */
router.post("/", async (req, res) => {
  try {
    const student = await Student.create({
      ...req.body,
      status: "active",
    });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all active students
 */
router.get("/", async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { status: "active" },
      order: [["name", "ASC"]],
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Delete student + cleanup
 */
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await Fee.destroy({ where: { studentId: student.studentId } });

    await ArchivedStudent.create({
      originalStudentId: student.studentId,
      name: student.name,
      className: student.className,
      phone: student.phone,
    });

    await student.destroy();
    res.json({ message: "Student archived" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
