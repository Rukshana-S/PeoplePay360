const asyncHandler = require("../utils/asyncHandler");
const contractService = require("../services/contract.service");

// @desc    Get all contracts (with optional filters)
// @route   GET /api/contracts?employeeId=&status=
const getAll = asyncHandler(async (req, res) => {
    const contracts = await contractService.getAllContracts(req.query);
    res.status(200).json({ success: true, count: contracts.length, data: contracts });
});

// @desc    Get single contract with salary structure details
// @route   GET /api/contracts/:id
const getById = asyncHandler(async (req, res) => {
    const contract = await contractService.getContractById(req.params.id);
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
