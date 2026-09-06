const asyncHandler = require("../utils/asyncHandler");
const contractService = require("../services/contract.service");
const prisma = require("../config/db"); // Needed for employee lookup

// @desc    Get all contracts (with optional filters)
// @route   GET /api/contracts?employeeId=&status=
const getAll = asyncHandler(async (req, res) => {
    // RBAC: If EMPLOYEE, forcefully scope query to their own employeeId
    if (req.user.role === "EMPLOYEE") {
        const employee = await prisma.employee.findUnique({ where: { userId: req.user.id } });
        if (!employee) return res.status(403).json({ success: false, message: "Forbidden: Employee record not found" });
        req.query.employeeId = employee.id;
    }
    const contracts = await contractService.getAllContracts(req.query);
    res.status(200).json({ success: true, count: contracts.length, data: contracts });
});

// @desc    Get single contract with salary structure details
// @route   GET /api/contracts/:id
const getById = asyncHandler(async (req, res) => {
    const contract = await contractService.getContractById(req.params.id);
    
    // RBAC: If EMPLOYEE, ensure this contract belongs to them
    if (req.user.role === "EMPLOYEE") {
        const employee = await prisma.employee.findUnique({ where: { userId: req.user.id } });
        if (!employee || contract.employeeId !== employee.id) {
            return res.status(403).json({ success: false, message: "Forbidden: Access denied to other employee contracts" });
        }
    }
    
    res.status(200).json({ success: true, data: contract });
});

// @desc    Create contract
// @route   POST /api/contracts
const create = asyncHandler(async (req, res) => {
    const contract = await contractService.createContract(req.body);
    res.status(201).json({ success: true, data: contract });
});

// @desc    Update contract
// @route   PUT /api/contracts/:id
const update = asyncHandler(async (req, res) => {
    const contract = await contractService.updateContract(req.params.id, req.body);
    res.status(200).json({ success: true, data: contract });
});

// @desc    Delete contract (DRAFT only)
// @route   DELETE /api/contracts/:id
const remove = asyncHandler(async (req, res) => {
    await contractService.deleteContract(req.params.id);
    res.status(200).json({ success: true, message: "Contract deleted" });
});

module.exports = { getAll, getById, create, update, remove };
