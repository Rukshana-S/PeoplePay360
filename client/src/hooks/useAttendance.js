import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/attendance';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAttendance(params);
      setAttendance(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const doCheckIn = async (employeeId) => {
    try {
      const res = await api.checkIn(employeeId);
      await fetchAttendance();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const doCheckOut = async (employeeId) => {
    try {
      const res = await api.checkOut(employeeId);
      await fetchAttendance();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  return {
    attendance,
    loading,
    error,
    fetchAttendance,
    doCheckIn,
    doCheckOut,
  };
};
