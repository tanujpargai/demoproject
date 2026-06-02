import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../components/UI/Toast';
import { Sidebar } from '../components/Layout/Sidebar';
import { Header } from '../components/Layout/Header';
import { TaskStats } from '../components/Tasks/TaskStats';
import { TaskFilters } from '../components/Tasks/TaskFilters';
import { TaskCard } from '../components/Tasks/TaskCard';
import { TaskForm } from '../components/Tasks/TaskForm';
import { Avatar } from '../components/UI/Avatar';
import {
  ClipboardList,
  Plus,
  Sparkles,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleSuccess = (msg) => success(msg);
  const handleError = (msg) => error(msg);

  const {
    tasks,
    allTasks,
    loading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    addTask,
    editTask,
    removeTask,
    toggleStatus,
    stats,
  } = useTasks(handleSuccess, handleError);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const highPriorityCount = useMemo(
    () => allTasks.filter((t) => t.priority === 'High').length,
    [allTasks]
  );

  const handleAddTaskClick = () => { setEditingTask(null); setFormOpen(true); };
  const handleEditTaskClick = (task) => { setEditingTask(task); setFormOpen(true); };
  const handleFormSubmit = async (taskData) => {
    if (editingTask) await editTask(editingTask.id, taskData);
    else await addTask(taskData);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        currentFilter={filter}
        setFilter={setFilter}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        stats={stats}
        highPriorityCount={highPriorityCount}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        <Header
          setIsOpen={setSidebarOpen}
          onAddTaskClick={handleAddTaskClick}
          currentFilter={filter}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-6 lg:p-8 space-y-6 md:space-y-8">

          {/* ── Welcome + Profile card row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

            {/* Welcome banner (takes 2 cols) */}
            <div className="lg:col-span-2 relative overflow-hidden p-6 md:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-violet-950/20 shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Productivity Hub</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Hello, {displayName}! 👋
                </h2>
                <p className="text-xs md:text-sm text-slate-400 max-w-lg">
                  Welcome back to TaskFlow. Here's your workspace summary for today. Keep checking items off!
                </p>
              </div>
            </div>

            {/* Profile card (1 col) — clicking navigates to /profile */}
            <button
              onClick={() => navigate('/profile')}
              className="group relative overflow-hidden p-5 rounded-3xl border border-slate-800 bg-slate-900 shadow-xl hover:border-violet-700/40 hover:shadow-violet-950/20 transition-all duration-300 text-left"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-[40px] pointer-events-none" />

              <div className="relative flex items-center gap-4 mb-4">
                <Avatar
                  src={profile?.avatar_url}
                  name={profile?.full_name}
                  email={user?.email}
                  size="lg"
                  className="ring-2 ring-slate-800 group-hover:ring-violet-700/40 transition-all"
                />
                <div className="min-w-0">
                  <p className="text-base font-bold text-white truncate">{displayName}</p>
                  {profile?.username && (
                    <p className="text-xs text-slate-500 truncate">@{profile.username}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-slate-500">Completed</span>
                  </div>
                  <p className="text-xl font-bold text-white">{stats.completed}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-slate-500">Pending</span>
                  </div>
                  <p className="text-xl font-bold text-white">{stats.pending}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-3 text-xs text-violet-400 group-hover:text-violet-300 transition-colors font-medium">
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

          {/* Task Statistics */}
          <TaskStats stats={stats} />

          {/* Search + Filter Bar */}
          <TaskFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentFilter={filter}
            setFilter={setFilter}
            stats={stats}
            highPriorityCount={highPriorityCount}
          />

          {/* Tasks List */}
          {loading && allTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
              <p className="text-sm text-slate-400">Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 rounded-3xl border border-dashed border-slate-800/80 bg-slate-900/10 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4">
                <ClipboardList className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-200">No tasks found</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm">
                {searchQuery
                  ? 'No tasks match your search. Try different keywords or filters.'
                  : filter === 'All'
                  ? 'Your workspace is empty. Create your first task to get started!'
                  : `No tasks found matching "${filter}" filter.`}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddTaskClick}
                  className="mt-5 flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create First Task
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={toggleStatus}
                  onEdit={handleEditTaskClick}
                  onDelete={removeTask}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <TaskForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={editingTask}
      />
    </div>
  );
};

export default Dashboard;
