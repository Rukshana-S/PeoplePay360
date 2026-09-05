import api from './axios';

export const getDepartments = async () => {
  return api.get('/departments');
};

export const getJobPositions = async () => {
  return api.get('/job-positions');
};

export const getWorkingSchedules = async () => {
  return api.get('/schedules');
};
