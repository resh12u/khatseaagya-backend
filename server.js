// ✅ MUST be first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

// ✅ Import models so Sequelize registers them
require("./models/Admin");
require("./models/Student");
require("./models/Attendance");
require("./models/Fee");
require("./models/ArchivedStudent");

// ✅ Routes
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const feeRoutes = require("./routes/feeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const reportRoutes = require("./routes/reportRoutes");
const studentAuthRoutes = require("./routes/studentAuthRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.send("KhatSeAagya Backend Running");
});

/* ===== API ROUTES ===== */
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/student-auth", studentAuthRoutes);
app.use("/api/admin-auth", adminAuthRoutes);

/* ===== START SERVER AFTER DB SYNC ===== */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync();
    console.log("SQLite database synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Sync Error:", err.message);
    process.exit(1);
  }
})();
