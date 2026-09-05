import api from './axios';

// Salary Structures
export const getSalaryStructures = async () => {
  return api.get('/salary-structures');
};

export const getSalaryStructureById = async (id) => {
  return api.get(`/salary-structures/${id}`);
};

export const createSalaryStructure = async (data) => {
  return api.post('/salary-structures', data);
};

export const updateSalaryStructure = async (id, data) => {
  return api.put(`/salary-structures/${id}`, data);
};

export const deleteSalaryStructure = async (id) => {
  return api.delete(`/salary-structures/${id}`);
};

// Salary Rules
export const getSalaryRules = async (params) => {
  return api.get('/salary-rules', { params });
};

export const getSalaryRuleById = async (id) => {
  return api.get(`/salary-rules/${id}`);
};

export const createSalaryRule = async (data) => {
  return api.post('/salary-rules', data);
};

export const updateSalaryRule = async (id, data) => {
  return api.put(`/salary-rules/${id}`, data);
};

export const deleteSalaryRule = async (id) => {
  return api.delete(`/salary-rules/${id}`);
};

// Payruns
export const getPayruns = async () => {
  return api.get('/payruns');
};

export const getPayrunById = async (id) => {
  return api.get(`/payruns/${id}`);
};

export const executePayrun = async (data) => {
  return api.post('/payruns', data);
};

export const deletePayrun = async (id) => {
  return api.delete(`/payruns/${id}`);
};

// Payslips
export const getPayslips = async (params) => {
  return api.get('/payslips', { params });
};

export const getPayslipById = async (id) => {
  return api.get(`/payslips/${id}`);
};
