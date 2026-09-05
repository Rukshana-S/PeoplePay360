const asyncHandler = require("../utils/asyncHandler");
const departmentService = require("../services/department.service");

// @desc    Get all departments
// @route   GET /api/departments
const getAll = asyncHandler(async (req, res) => {
    const departments = await departmentService.getAllDepartments();
    res.status(200).json({ success: true, data: departments });
});

// @desc    Get single department
// @route   GET /api/departments/:id
const getById = asyncHandler(async (req, res) => {
    const department = await departmentService.getDepartmentById(req.params.id);
    res.status(200).json({ success: true, data: department });
});

// @desc    Create department
// @route   POST /api/departments
const create = asyncHandler(async (req, res) => {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json({ success: true, data: department });
});

// @desc    Update department
// @route   PUT /api/departments/:id
const update = asyncHandler(async (req, res) => {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json({ success: true, data: department });
});

// @desc    Delete department
// @route   DELETE /api/departments/:id
const remove = asyncHandler(async (req, res) => {
    await departmentService.deleteDepartment(req.params.id);
    res.status(200).json({ success: true, message: "Department deleted" });
});

module.exports = { getAll, getById, create, update, remove };
