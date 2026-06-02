import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../UI/Toast';
import { Avatar } from '../UI/Avatar';
import { Menu, Plus, CheckSquare, User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';

export const Header = ({ setIsOpen, onAddTaskClick, currentFilter }) => {
  const { user, profile, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await logout();
      success('Logged out successfully');
    } catch (err) {
      error(err.message || 'Failed to logout');
    }
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const username = profile?.username || user?.email?.split('@')[0];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
      {/* Left: mobile menu toggle + brand or page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 lg:hidden border border-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand (mobile only) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">TaskFlow</span>
        </div>

        {/* Page title (desktop only) */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            {currentFilter === 'All' ? 'My Tasks' : `${currentFilter} Tasks`}
          </h1>
          <p className="text-xs text-slate-500">Manage, organize, and complete your tasks</p>
        </div>
      </div>

      {/* Right: add task + avatar dropdown */}
      <div className="flex items-center gap-3">
        {/* New Task Button */}
        {onAddTaskClick && (
          <button
            onClick={onAddTaskClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-500/10 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        )}

        {/* User avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
          >
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name}
              email={user?.email}
              size="sm"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">@{username}</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 py-1.5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* User summary */}
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-sm font-semibold text-slate-100 truncate">{displayName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>

              {[
                {
                  label: 'My Profile',
                  icon: User,
                  action: () => { navigate('/profile'); setDropdownOpen(false); },
                },
                {
                  label: 'Dashboard',
                  icon: LayoutDashboard,
                  action: () => { navigate('/'); setDropdownOpen(false); },
                },
              ].map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {label}
                </button>
              ))}

              <div className="my-1 border-t border-slate-800" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
