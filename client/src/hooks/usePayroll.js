import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/payroll';

export const usePayroll = () => {
  const [salaryStructures, setSalaryStructures] = useState([]);
  const [salaryRules, setSalaryRules] = useState([]);
  const [payruns, setPayruns] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStructures = useCallback(async () => {
    try {
      const res = await api.getSalaryStructures();
      setSalaryStructures(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, []);

  const fetchRules = useCallback(async (params) => {
    try {
      const res = await api.getSalaryRules(params);
      setSalaryRules(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, []);

  const fetchPayruns = useCallback(async () => {
    try {
      const res = await api.getPayruns();
      setPayruns(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, []);

  const fetchPayslips = useCallback(async (params) => {
    try {
      const res = await api.getPayslips(params);
      setPayslips(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchStructures(), fetchRules(), fetchPayruns(), fetchPayslips()]);
    setLoading(false);
  }, [fetchStructures, fetchRules, fetchPayruns, fetchPayslips]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addStructure = async (data) => {
    try {
      const res = await api.createSalaryStructure(data);
      await fetchStructures();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const addRule = async (data) => {
    try {
      const res = await api.createSalaryRule(data);
      await fetchRules();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const runPayrun = async (data) => {
    try {
      const res = await api.executePayrun(data);
      await fetchPayruns();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const removePayrun = async (id) => {
    try {
      await api.deletePayrun(id);
      await fetchPayruns();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  return {
    salaryStructures,
    salaryRules,
    payruns,
    payslips,
    loading,
    error,
    fetchAll,
    fetchStructures,
    fetchRules,
    fetchPayruns,
    fetchPayslips,
    addStructure,
    addRule,
    runPayrun,
    removePayrun,
  };
};
