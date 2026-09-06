const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const departmentRoutes = require("./routes/department.routes");
const jobPositionRoutes = require("./routes/jobPosition.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const timeOffTypeRoutes = require("./routes/timeOffType.routes");
const employeeRoutes = require("./routes/employee.routes");
const contractRoutes = require("./routes/contract.routes");
const salaryStructureRoutes = require("./routes/salaryStructure.routes");
const salaryRuleRoutes = require("./routes/salaryRule.routes");
const payrunRoutes = require("./routes/payrun.routes");
const payslipRoutes = require("./routes/payslip.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const timeOffAllocationRoutes = require("./routes/timeOffAllocation.routes");
const timeOffRequestRoutes = require("./routes/timeOffRequest.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const { authMiddleware } = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Authenticate every /api request EXCEPT /api/auth
app.use((req, res, next) => {
    if (req.path.startsWith('/api/auth')) {
        return next();
    }
    if (req.path.startsWith('/api')) {
        return authMiddleware(req, res, next);
    }
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/job-positions", jobPositionRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/time-off-types", timeOffTypeRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/salary-structures", salaryStructureRoutes);
app.use("/api/salary-rules", salaryRuleRoutes);
app.use("/api/payruns", payrunRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/time-off-allocations", timeOffAllocationRoutes);
app.use("/api/time-off-requests", timeOffRequestRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global Error Handler must be the last middleware
app.use(errorHandler);

module.exports = app;