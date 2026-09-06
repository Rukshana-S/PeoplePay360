import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/schedules';

export const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSchedules();
      setSchedules(data.data || data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const addSchedule = async (scheduleData) => {
    try {
      const newSchedule = await api.createSchedule(scheduleData);
      setSchedules(prev => [...prev, newSchedule.data || newSchedule]);
      return { success: true, data: newSchedule.data || newSchedule };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const updateSchedule = async (id, scheduleData) => {
    try {
      const updatedSchedule = await api.updateSchedule(id, scheduleData);
      setSchedules(prev => prev.map(s => s.id === id ? (updatedSchedule.data || updatedSchedule) : s));
      return { success: true, data: updatedSchedule.data || updatedSchedule };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const removeSchedule = async (id) => {
    try {
      await api.deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
  };
};
