import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../UI/Toast';
import { Avatar } from '../UI/Avatar';
import {
  CheckSquare,
  ListTodo,
  CheckCircle,
  Clock,
  AlertTriangle,
  LogOut,
  User,
  LayoutDashboard,
  X,
} from 'lucide-react';

export const Sidebar = ({ currentFilter, setFilter, isOpen, setIsOpen, stats, highPriorityCount }) => {
  const { user, profile, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  const handleLogout = async () => {
    try {
      await logout();
      success('Logged out successfully');
    } catch (err) {
      error(err.message || 'Failed to logout');
    }
  };

  const navItems = [
    { name: 'All', icon: ListTodo, count: stats.total, color: 'text-violet-400 bg-violet-500/10' },
    { name: 'Completed', icon: CheckCircle, count: stats.completed, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Pending', icon: Clock, count: stats.pending, color: 'text-amber-400 bg-amber-500/10' },
    { name: 'High Priority', icon: AlertTriangle, count: highPriorityCount, color: 'text-rose-400 bg-rose-500/10' },
  ];

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const username = profile?.username ? `@${profile.username}` : user?.email;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent tracking-tight">
              TaskFlow
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {/* ── Main Nav ── */}
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </p>

          {/* Dashboard link */}
          <button
            onClick={() => { navigate('/'); setIsOpen(false); }}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isDashboard ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${isDashboard ? 'text-violet-400' : ''}`} />
            Dashboard
          </button>

          {/* Profile link */}
          <button
            onClick={() => { navigate('/profile'); setIsOpen(false); }}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              location.pathname === '/profile' ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <User className={`w-4 h-4 ${location.pathname === '/profile' ? 'text-violet-400' : ''}`} />
            My Profile
          </button>

          {/* ── Filters (only visible on Dashboard) ── */}
          {isDashboard && (
            <>
              <p className="px-3 mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Task Filters
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentFilter === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => { setFilter(item.name); setIsOpen(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-slate-800/80 text-white border-l-4 border-violet-500 pl-2'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 pl-3'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : ''}`} />
                      <span>{item.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isActive ? 'bg-violet-600 text-white' : item.color}`}>
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* ── User profile footer ── */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3">
          <button
            onClick={() => { navigate('/profile'); setIsOpen(false); }}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-colors group"
          >
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name}
              email={user?.email}
              size="sm"
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                {displayName}
              </p>
              <p className="text-xs text-slate-500 truncate">{username}</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2.5 w-full px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-500/5 text-sm font-medium transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
