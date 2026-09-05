import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/masterData';

export const useMasterData = () => {
  const [departments, setDepartments] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMasterData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [deptRes, jobRes, scheduleRes] = await Promise.all([
        api.getDepartments(),
        api.getJobPositions(),
        api.getWorkingSchedules()
      ]);

      setDepartments(deptRes.data || deptRes);
      setJobPositions(jobRes.data || jobRes);
      setSchedules(scheduleRes.data || scheduleRes);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch master data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  return {
    departments,
    jobPositions,
    schedules,
    loading,
    error,
    fetchMasterData
  };
};
