const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

/**
 * Save attendance for all students on a date
 */
router.post("/bulk", async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    for (const r of records) {
      const { studentId, status } = r;

      const existing = await Attendance.findOne({
        where: { studentId, date },
      });

      if (existing) {
        await existing.update({ status });
      } else {
        await Attendance.create({ studentId, date, status });
      }
    }

    res.json({ message: "Attendance saved successfully" });
  } catch (err) {
    console.error("ATTENDANCE BULK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get attendance summary for a student
 */
router.get("/summary/:studentId", async (req, res) => {
  try {
    const records = await Attendance.findAll({
      where: { studentId: req.params.studentId },
    });

    const total = records.length;
    const present = records.filter(r => r.status === "Present").length;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

    res.json({ total, present, percentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
