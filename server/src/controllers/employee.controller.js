const asyncHandler = require("../utils/asyncHandler");
const employeeService = require("../services/employee.service");

// @desc    Get all employees (with optional filters)
// @route   GET /api/employees?departmentId=&status=&employeeType=&search=
const getAll = asyncHandler(async (req, res) => {
    const employees = await employeeService.getAllEmployees(req.query);
    res.status(200).json({ success: true, count: employees.length, data: employees });
});

// @desc    Get single employee with full details
// @route   GET /api/employees/:id
const getById = asyncHandler(async (req, res) => {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.status(200).json({ success: true, data: employee });
});

// @desc    Create employee
// @route   POST /api/employees
const create = asyncHandler(async (req, res) => {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({ success: true, data: employee });
});

// @desc    Update employee
// @route   PUT /api/employees/:id
const update = asyncHandler(async (req, res) => {
    const employee = await employeeService.updateEmployee(req.params.id, req.body);
    res.status(200).json({ success: true, data: employee });
});

// @desc    Soft-delete employee (sets status to TERMINATED)
// @route   DELETE /api/employees/:id
const remove = asyncHandler(async (req, res) => {
    await employeeService.deleteEmployee(req.params.id);
    res.status(200).json({ success: true, message: "Employee terminated" });
});

module.exports = { getAll, getById, create, update, remove };
