import api from './axios';

export const getSchedules = async (params) => {
  return api.get('/schedules', { params });
};

export const getScheduleById = async (id) => {
  return api.get(`/schedules/${id}`);
};

export const createSchedule = async (data) => {
  return api.post('/schedules', data);
};

export const updateSchedule = async (id, data) => {
  return api.put(`/schedules/${id}`, data);
};

export const deleteSchedule = async (id) => {
  return api.delete(`/schedules/${id}`);
};
