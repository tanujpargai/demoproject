import React from 'react';
import { Calendar, Trash2, Edit3, CheckCircle, Circle, AlertCircle } from 'lucide-react';

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const { id, title, description, priority, status, due_date } = task;

  const isCompleted = status === 'Completed';

  // Priority badge styling
  const priorityStyles = {
    Low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    Medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
    High: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
  };

  // Due date calculations
  const formattedDate = due_date ? new Date(due_date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : null;

  const isOverdue = useMemo(() => {
    if (!due_date || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(due_date);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }, [due_date, isCompleted]);

  return (
    <div
      className={`group relative flex flex-col p-5 rounded-2xl border bg-slate-900 transition-all duration-300 ${
        isCompleted
          ? 'border-slate-850 opacity-60'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-violet-950/10 -translate-y-0 hover:-translate-y-1'
      }`}
    >
      {/* Task Header - Action buttons & Priority Badge */}
      <div className="flex items-start justify-between gap-4">
        {/* Toggle Checkbox and Title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => onToggleStatus(id, status)}
            className="mt-1 flex-shrink-0 text-slate-400 hover:text-violet-400 active:scale-95 transition-all duration-150"
            title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          >
            {isCompleted ? (
              <CheckCircle className="w-5.5 h-5.5 text-violet-500 fill-violet-500/10" />
            ) : (
              <Circle className="w-5.5 h-5.5 text-slate-500 hover:text-slate-350" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-semibold leading-tight text-slate-150 truncate ${
              isCompleted ? 'line-through text-slate-500' : ''
            }`}>
              {title}
            </h3>
          </div>
        </div>

        {/* Priority Badge */}
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${
          priorityStyles[priority] || priorityStyles.Medium
        }`}>
          {priority}
        </span>
      </div>

      {/* Task Description */}
      {description && (
        <p className={`mt-3 text-sm leading-relaxed text-slate-400 line-clamp-2 ${
          isCompleted ? 'text-slate-550' : ''
        }`}>
          {description}
        </p>
      )}

      {/* Spacer */}
      <div className="flex-1 min-h-[1.5rem]" />

      {/* Task Footer - Due Date and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-850/60 mt-auto">
        {/* Due Date Indicator */}
        <div className="flex items-center gap-1.5 text-xs">
          {formattedDate ? (
            <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-rose-400 font-medium' : 'text-slate-400'}`}>
              {isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              ) : (
                <Calendar className="w-3.5 h-3.5" />
              )}
              <span>{isOverdue ? `Overdue: ${formattedDate}` : formattedDate}</span>
            </div>
          ) : (
            <span className="text-slate-600">No due date</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-violet-400 transition-colors"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper hook or memo for performance inside standard JS file (useMemo needs to be imported or referenced via React.useMemo)
import { useMemo } from 'react';
export default TaskCard;
