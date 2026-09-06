import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/timeoff';

export const useTimeOff = () => {
  const [requests, setRequests] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async (params) => {
    try {
      const res = await api.getTimeOffRequests(params);
      setRequests(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, []);

  const fetchAllocations = useCallback(async (params) => {
    try {
      const res = await api.getTimeOffAllocations(params);
      setAllocations(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, []);

  const fetchLeaveTypes = useCallback(async () => {
    try {
      const res = await api.getTimeOffTypes();
      setLeaveTypes(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchRequests(), fetchAllocations(), fetchLeaveTypes()]);
    setLoading(false);
  }, [fetchRequests, fetchAllocations, fetchLeaveTypes]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addRequest = async (data) => {
    try {
      const res = await api.createTimeOffRequest(data);
      await fetchRequests();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const reviewRequest = async (id, status) => {
    try {
      const res = await api.reviewTimeOffRequest(id, { status });
      await fetchRequests();
      await fetchAllocations();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const addAllocation = async (data) => {
    try {
      const res = await api.createTimeOffAllocation(data);
      await fetchAllocations();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const removeAllocation = async (id) => {
    try {
      const res = await api.deleteTimeOffAllocation(id);
      await fetchAllocations();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const addLeaveType = async (data) => {
    try {
      const res = await api.createTimeOffType(data);
      await fetchLeaveTypes();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  return {
    requests,
    allocations,
    leaveTypes,
    loading,
    error,
    fetchAll,
    fetchRequests,
    fetchAllocations,
    fetchLeaveTypes,
    addRequest,
    reviewRequest,
    addAllocation,
    removeAllocation,
    addLeaveType,
  };
};
