const express = require("express");
const router = express.Router();
const Fee = require("../models/Fee");
const Student = require("../models/Student");

/**
 * Add or update fee (business studentId)
 */
router.post("/", async (req, res) => {
  try {
    const studentId = String(req.body.studentId).trim(); // STU001
    const month = String(req.body.month).trim();
    const totalAmount = Number(req.body.totalAmount);
    const paidAmount = Number(req.body.paidAmount);

    if (!studentId || !month) {
      return res.status(400).json({ message: "studentId and month required" });
    }

    const student = await Student.findOne({ where: { studentId } });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const dueAmount = totalAmount - paidAmount;
    let status = "Unpaid";
    if (paidAmount > 0 && paidAmount < totalAmount) status = "Partial";
    if (paidAmount >= totalAmount) status = "Paid";

    let fee = await Fee.findOne({ where: { studentId, month } });

    if (fee) {
      await fee.update({ totalAmount, paidAmount, dueAmount, status });
    } else {
      fee = await Fee.create({
        studentId,
        month,
        totalAmount,
        paidAmount,
        dueAmount,
        status,
      });
    }

    res.json({ message: "Fee saved successfully", fee });
  } catch (err) {
    console.error("FEE POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all fees (manual join with students)
 */
router.get("/", async (req, res) => {
  try {
    const fees = await Fee.findAll({ order: [["createdAt", "DESC"]] });
    const students = await Student.findAll();

    const studentMap = {};
    students.forEach((s) => {
      studentMap[s.studentId] = s.name;
    });

    const result = fees.map((f) => ({
      id: f.id,
      studentId: f.studentId,
      studentName: studentMap[f.studentId] || "Deleted Student",
      month: f.month,
      totalAmount: f.totalAmount,
      paidAmount: f.paidAmount,
      dueAmount: f.dueAmount,
      status: f.status,
    }));

    res.json(result);
  } catch (err) {
    console.error("FEE GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
