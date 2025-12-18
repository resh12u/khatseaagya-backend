const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

/**
 * Create admin (run once)
 */
router.post("/create", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await Admin.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ username, password });
    res.json({ message: "Admin created", admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin login
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
