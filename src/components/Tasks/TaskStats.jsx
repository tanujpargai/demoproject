import React from 'react';
import { Layers, CheckCircle2, Clock } from 'lucide-react';

export const TaskStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: Layers,
      color: 'from-violet-500 to-indigo-500',
      shadowColor: 'shadow-violet-500/10',
      borderColor: 'border-violet-500/20',
      iconBg: 'bg-violet-500/10 text-violet-400',
    },
    {
      label: 'Completed Tasks',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      label: 'Pending Tasks',
      value: stats.pending,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/10',
      borderColor: 'border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`relative overflow-hidden p-6 rounded-2xl border bg-slate-900 border-slate-800/80 shadow-md ${card.shadowColor} transition-all duration-300 hover:scale-[1.01]`}
          >
            {/* Glowing Accent lines */}
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${card.color}`} />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.label}
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1 leading-none tracking-tight">
                  {card.value}
                </h3>
              </div>
              
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.iconBg}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default TaskStats;
