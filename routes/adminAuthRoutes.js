const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
require("dotenv").config();

const router = express.Router();

/* ===============================
   SEED SINGLE ADMIN (ONCE)
================================ */
async function seedAdmin() {
  try {
    const existingAdmin = await Admin.findOne({
      where: { username: process.env.ADMIN_USERNAME },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );

      await Admin.create({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
      });

      console.log("✅ Admin seeded");
    }
  } catch (err) {
    console.error("❌ Admin seed error:", err.message);
  }
}

seedAdmin();

/* ===============================
   ADMIN LOGIN
================================ */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      username: admin.username,
    });
  } catch (err) {
    console.error("❌ Admin login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
