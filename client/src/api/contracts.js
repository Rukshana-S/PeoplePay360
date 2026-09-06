import api from './axios';

export const getContracts = async (params) => {
  return api.get('/contracts', { params });
};

export const getContractById = async (id) => {
  return api.get(`/contracts/${id}`);
};

export const createContract = async (data) => {
  return api.post('/contracts', data);
};

export const updateContract = async (id, data) => {
  return api.put(`/contracts/${id}`, data);
};

export const deleteContract = async (id) => {
  return api.delete(`/contracts/${id}`);
};
