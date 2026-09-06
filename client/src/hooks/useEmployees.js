import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/employees';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEmployees();
      setEmployees(data.data || data); // handle standard axios vs custom envelope
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = async (employeeData) => {
    try {
      const newEmp = await api.createEmployee(employeeData);
      setEmployees(prev => [...prev, newEmp.data || newEmp]);
      return { success: true, data: newEmp.data || newEmp };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      const updatedEmp = await api.updateEmployee(id, employeeData);
      setEmployees(prev => prev.map(emp => emp.id === id ? (updatedEmp.data || updatedEmp) : emp));
      return { success: true, data: updatedEmp.data || updatedEmp };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const removeEmployee = async (id) => {
    try {
      const res = await api.deleteEmployee(id);
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: 'TERMINATED' } : emp));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
  };
};
