import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/users';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getUsers(params);
      setUsers(res.data || res || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (data) => {
    try {
      const res = await api.createUser(data);
      await fetchUsers();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const editUser = async (id, data) => {
    try {
      const res = await api.updateUser(id, data);
      await fetchUsers();
      return { success: true, data: res.data || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const removeUser = async (id) => {
    try {
      await api.deleteUser(id);
      await fetchUsers();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
  };
};
