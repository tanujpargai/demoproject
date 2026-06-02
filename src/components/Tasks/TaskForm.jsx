import React, { useState, useEffect } from 'react';
import { X, Calendar, MessageSquare, Tag, FileText } from 'lucide-react';

export const TaskForm = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!task;

  // Populate initial values when task changes or modal opens
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setDueDate(task.due_date ? task.due_date.substring(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-850 bg-slate-900/60 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white leading-none">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-455 font-medium">
              {error}
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1.5">
            <label htmlFor="task-title" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <FileText className="w-3.5 h-3.5" />
              <span>Title *</span>
            </label>
            <input
              id="task-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design app landing page"
              className="w-full px-4 py-3 text-sm text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-violet-500 placeholder-slate-600 transition-colors duration-250"
            />
          </div>

          {/* Description input */}
          <div className="space-y-1.5">
            <label htmlFor="task-desc" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Description</span>
            </label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              rows={3}
              className="w-full px-4 py-3 text-sm text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-violet-500 placeholder-slate-600 resize-none transition-colors duration-250"
            />
          </div>

          {/* Two-column layout for Priority and Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority Selection */}
            <div className="space-y-1.5">
              <label htmlFor="task-priority" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Tag className="w-3.5 h-3.5" />
                <span>Priority</span>
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 text-sm text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-violet-500 transition-colors duration-250 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label htmlFor="task-duedate" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due Date</span>
              </label>
              <input
                id="task-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 text-sm text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-violet-500 transition-colors duration-250 cursor-pointer"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-850">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-250 hover:bg-slate-850 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TaskForm;
