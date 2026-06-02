import { useState, useEffect, useCallback, useMemo } from 'react';
import { tasksService } from '../services/tasks';
import { useAuth } from './useAuth';

export const useTasks = (onSuccessNotification, onErrorNotification) => {
  const { user } = useAuth();
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering and Searching states
  const [filter, setFilter] = useState('All'); // 'All', 'Completed', 'Pending', 'High Priority'
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await tasksService.getTasks();
      setAllTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      if (onErrorNotification) onErrorNotification(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [user, onErrorNotification]);

  // Load tasks on mount or when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setAllTasks([]);
    }
  }, [user, fetchTasks]);

  // Add Task
  const addTask = async ({ title, description, priority, due_date }) => {
    if (!user) return;
    setLoading(true);
    try {
      const newTask = await tasksService.createTask({
        title,
        description,
        priority,
        due_date: due_date || null,
        status: 'Pending',
        user_id: user.id
      });
      setAllTasks((prev) => [newTask, ...prev]);
      if (onSuccessNotification) onSuccessNotification('Task Created');
      return newTask;
    } catch (err) {
      if (onErrorNotification) onErrorNotification(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Edit Task
  const editTask = async (id, updateData) => {
    setLoading(true);
    try {
      const updated = await tasksService.updateTask(id, updateData);
      setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (onSuccessNotification) onSuccessNotification('Task Updated');
      return updated;
    } catch (err) {
      if (onErrorNotification) onErrorNotification(err.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete Task
  const removeTask = async (id) => {
    setLoading(true);
    try {
      await tasksService.deleteTask(id);
      setAllTasks((prev) => prev.filter((t) => t.id !== id));
      if (onSuccessNotification) onSuccessNotification('Task Deleted');
    } catch (err) {
      if (onErrorNotification) onErrorNotification(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle Task status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const updated = await tasksService.toggleComplete(id, currentStatus);
      setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (onSuccessNotification) {
        const action = currentStatus === 'Completed' ? 'marked as pending' : 'marked as completed';
        onSuccessNotification(`Task ${action}`);
      }
    } catch (err) {
      if (onErrorNotification) onErrorNotification(err.message || 'Failed to toggle status');
      throw err;
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === 'Completed').length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [allTasks]);

  // Filtered and searched tasks list
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      // 1. Apply search filter
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Apply category filters
      if (filter === 'Completed') return task.status === 'Completed';
      if (filter === 'Pending') return task.status === 'Pending';
      if (filter === 'High Priority') return task.priority === 'High';

      return true; // For 'All' filter
    });
  }, [allTasks, filter, searchQuery]);

  return {
    tasks: filteredTasks,
    allTasks,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggleStatus,
    stats,
  };
};
