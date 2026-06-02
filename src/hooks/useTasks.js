import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { tasksService } from '../services/tasks';
import { useAuth } from './useAuth';

export const useTasks = (onSuccessNotification, onErrorNotification) => {
  const { user } = useAuth();
  const [allTasks, setAllTasks] = useState([]);

  // Separate loading states:
  //   initialLoading → controls the full-page spinner (only first load)
  //   mutating       → silently tracks in-progress CRUD (no spinner needed)
  const [initialLoading, setInitialLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  // Stable refs for the notification callbacks so they never
  // appear in useCallback dependency arrays (avoids infinite re-fetch loop).
  const onSuccessRef = useRef(onSuccessNotification);
  const onErrorRef   = useRef(onErrorNotification);
  useEffect(() => { onSuccessRef.current = onSuccessNotification; }, [onSuccessNotification]);
  useEffect(() => { onErrorRef.current   = onErrorNotification;   }, [onErrorNotification]);

  // Filtering and Searching states
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Initial fetch ─────────────────────────────────────────────────────────
  // Depends only on user (stable identity from Supabase auth object).
  // We intentionally do NOT include the notification callbacks here.
  const fetchTasks = useCallback(async () => {
    if (!user) {
      // No user → clear tasks and stop the spinner immediately
      setAllTasks([]);
      setInitialLoading(false);
      return;
    }

    setInitialLoading(true);
    setError(null);
    try {
      const data = await tasksService.getTasks();
      setAllTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      onErrorRef.current?.(err.message || 'Failed to fetch tasks');
    } finally {
      setInitialLoading(false);
    }
  }, [user]); // ← only user; notification refs are stable

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── CRUD helpers ──────────────────────────────────────────────────────────
  // These use `mutating` instead of `initialLoading` so the full-page
  // spinner never flashes back in after the first load is done.

  const addTask = async ({ title, description, priority, due_date }) => {
    if (!user) return;
    setMutating(true);
    try {
      const newTask = await tasksService.createTask({
        title,
        description,
        priority,
        due_date: due_date || null,
        status: 'Pending',
        user_id: user.id,
      });
      setAllTasks((prev) => [newTask, ...prev]);
      onSuccessRef.current?.('Task Created');
      return newTask;
    } catch (err) {
      onErrorRef.current?.(err.message || 'Failed to create task');
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const editTask = async (id, updateData) => {
    setMutating(true);
    try {
      const updated = await tasksService.updateTask(id, updateData);
      setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      onSuccessRef.current?.('Task Updated');
      return updated;
    } catch (err) {
      onErrorRef.current?.(err.message || 'Failed to update task');
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const removeTask = async (id) => {
    setMutating(true);
    try {
      await tasksService.deleteTask(id);
      setAllTasks((prev) => prev.filter((t) => t.id !== id));
      onSuccessRef.current?.('Task Deleted');
    } catch (err) {
      onErrorRef.current?.(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setMutating(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const updated = await tasksService.toggleComplete(id, currentStatus);
      setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      const action = currentStatus === 'Completed' ? 'marked as pending' : 'marked as completed';
      onSuccessRef.current?.(`Task ${action}`);
    } catch (err) {
      onErrorRef.current?.(err.message || 'Failed to toggle status');
      throw err;
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === 'Completed').length;
    return { total, completed, pending: total - completed };
  }, [allTasks]);

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;
      if (filter === 'Completed')    return task.status   === 'Completed';
      if (filter === 'Pending')      return task.status   === 'Pending';
      if (filter === 'High Priority') return task.priority === 'High';
      return true;
    });
  }, [allTasks, filter, searchQuery]);

  return {
    tasks: filteredTasks,
    allTasks,
    // Expose `loading` as the initial-only spinner flag
    loading: initialLoading,
    mutating,
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
