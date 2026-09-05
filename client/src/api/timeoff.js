import api from './axios';

// Time Off Requests
export const getTimeOffRequests = async (params) => {
  return api.get('/time-off-requests', { params });
};

export const createTimeOffRequest = async (data) => {
  return api.post('/time-off-requests', data);
};

export const reviewTimeOffRequest = async (id, data) => {
  return api.put(`/time-off-requests/${id}/review`, data);
};

// Time Off Allocations
export const getTimeOffAllocations = async (params) => {
  return api.get('/time-off-allocations', { params });
};

export const createTimeOffAllocation = async (data) => {
  return api.post('/time-off-allocations', data);
};

// Time Off Types
export const getTimeOffTypes = async () => {
  return api.get('/time-off-types');
};

export const createTimeOffType = async (data) => {
  return api.post('/time-off-types', data);
};

export const updateTimeOffType = async (id, data) => {
  return api.put(`/time-off-types/${id}`, data);
};

export const deleteTimeOffType = async (id) => {
  return api.delete(`/time-off-types/${id}`);
};
