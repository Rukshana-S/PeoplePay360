import api from './axios';

export const getAttendance = async (params) => {
  return api.get('/attendance', { params });
};

export const checkIn = async (employeeId) => {
  return api.post('/attendance/check-in', { employeeId });
};

export const checkOut = async (employeeId) => {
  return api.post('/attendance/check-out', { employeeId });
};
