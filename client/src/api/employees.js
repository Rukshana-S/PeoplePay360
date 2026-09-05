import api from './axios';

export const getEmployees = async (params) => {
  return api.get('/employees', { params });
};

export const getEmployeeById = async (id) => {
  return api.get(`/employees/${id}`);
};

export const createEmployee = async (data) => {
  return api.post('/employees', data);
};

export const updateEmployee = async (id, data) => {
  return api.put(`/employees/${id}`, data);
};

export const deleteEmployee = async (id) => {
  return api.delete(`/employees/${id}`);
};
