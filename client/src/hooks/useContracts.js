import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/contracts';

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getContracts();
      setContracts(data.data || data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const addContract = async (contractData) => {
    try {
      const newContract = await api.createContract(contractData);
      setContracts(prev => [...prev, newContract.data || newContract]);
      return { success: true, data: newContract.data || newContract };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const updateContract = async (id, contractData) => {
    try {
      const updatedContract = await api.updateContract(id, contractData);
      setContracts(prev => prev.map(c => c.id === id ? (updatedContract.data || updatedContract) : c));
      return { success: true, data: updatedContract.data || updatedContract };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const removeContract = async (id) => {
    try {
      await api.deleteContract(id);
      setContracts(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  return {
    contracts,
    loading,
    error,
    fetchContracts,
    addContract,
    updateContract,
    removeContract,
  };
};
