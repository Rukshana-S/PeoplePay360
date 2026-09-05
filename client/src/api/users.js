import api from './axios';

export const getUsers = async (params) => {
  return api.get('/users', { params });
};

export const getUserById = async (id) => {
  return api.get(`/users/${id}`);
};

export const createUser = async (data) => {
  return api.post('/users', data);
};

export const updateUser = async (id, data) => {
  return api.put(`/users/${id}`, data);
};

export const deleteUser = async (id) => {
  return api.delete(`/users/${id}`);
};
