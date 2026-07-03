import React, { createContext, useContext, useState, useCallback } from 'react';
import { todoAPI } from '../utils/api';
import toast from 'react-hot-toast';

const TodoContext = createContext(null);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [categories, setCategories] = useState(['General']);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ completed: '', priority: '', category: '', search: '' });

  const fetchTodos = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await todoAPI.getAll({ ...filters, ...params });
      setTodos(data.todos);
      setStats(data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await todoAPI.getCategories();
      setCategories(['General', ...data.categories.filter(c => c !== 'General')]);
    } catch {}
  }, []);

  const createTodo = async (todoData) => {
    try {
      const { data } = await todoAPI.create(todoData);
      setTodos(prev => [data.todo, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
      toast.success('Task created!');
      return data.todo;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const { data } = await todoAPI.update(id, updates);
      setTodos(prev => prev.map(t => t._id === id ? data.todo : t));
      if (updates.completed !== undefined) {
        setStats(prev => ({
          ...prev,
          completed: updates.completed ? prev.completed + 1 : prev.completed - 1,
          pending: updates.completed ? prev.pending - 1 : prev.pending + 1,
        }));
      }
      return data.todo;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  };

  const deleteTodo = async (id) => {
    const todo = todos.find(t => t._id === id);
    try {
      await todoAPI.delete(id);
      setTodos(prev => prev.filter(t => t._id !== id));
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        completed: todo?.completed ? prev.completed - 1 : prev.completed,
        pending: !todo?.completed ? prev.pending - 1 : prev.pending,
      }));
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
      throw err;
    }
  };

  const clearCompleted = async () => {
    try {
      await todoAPI.clearCompleted();
      setTodos(prev => prev.filter(t => !t.completed));
      setStats(prev => ({ ...prev, total: prev.total - prev.completed, completed: 0 }));
      toast.success('Completed tasks cleared');
    } catch (err) {
      toast.error('Failed to clear completed tasks');
    }
  };

  const toggleAll = async (completed) => {
    try {
      await todoAPI.toggleAll(completed);
      setTodos(prev => prev.map(t => ({ ...t, completed })));
      setStats(prev => ({ ...prev, completed: completed ? prev.total : 0, pending: completed ? 0 : prev.total }));
    } catch (err) {
      toast.error('Failed to toggle tasks');
    }
  };

  return (
    <TodoContext.Provider value={{
      todos, stats, categories, loading, filters,
      setFilters, fetchTodos, fetchCategories,
      createTodo, updateTodo, deleteTodo, clearCompleted, toggleAll,
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
};
