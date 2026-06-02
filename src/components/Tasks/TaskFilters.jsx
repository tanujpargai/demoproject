import React from 'react';
import { Search, X, ListTodo, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const TaskFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  currentFilter, 
  setFilter, 
  stats, 
  highPriorityCount 
}) => {
  const filterPills = [
    { name: 'All', icon: ListTodo, count: stats.total, activeColor: 'bg-violet-600 text-white border-violet-500' },
    { name: 'Completed', icon: CheckCircle, count: stats.completed, activeColor: 'bg-emerald-600 text-white border-emerald-500' },
    { name: 'Pending', icon: Clock, count: stats.pending, activeColor: 'bg-amber-600 text-white border-amber-500' },
    { name: 'High Priority', icon: AlertTriangle, count: highPriorityCount, activeColor: 'bg-rose-600 text-white border-rose-500' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar Input */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="w-5 h-5 text-slate-450" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full pl-11 pr-10 py-3 text-sm text-slate-200 bg-slate-900 border border-slate-800 rounded-2xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 placeholder-slate-500 transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200"
            title="Clear Search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile Horizontal Filter Scrollbar (Hidden on desktop since the sidebar has filters) */}
      <div className="lg:hidden w-full overflow-x-auto pb-2 -mb-2 scrollbar-none flex gap-2">
        {filterPills.map((pill) => {
          const Icon = pill.icon;
          const isActive = currentFilter === pill.name;
          return (
            <button
              key={pill.name}
              onClick={() => setFilter(pill.name)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border flex-shrink-0 transition-all duration-200 ${
                isActive
                  ? pill.activeColor
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{pill.name}</span>
              <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                isActive ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default TaskFilters;
