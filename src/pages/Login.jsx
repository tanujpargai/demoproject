import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/UI/Toast';
import { CheckSquare, Mail, Lock, LogIn } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('All fields are required');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await login(email.trim(), password);
      success('Login Success');
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
      error(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md space-y-8 p-8 sm:p-10 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative z-10">
        
        {/* App Logo */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/10">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Log in to manage your tasks with TaskFlow
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-455 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-violet-500 placeholder-slate-650 transition-colors"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-violet-500 placeholder-slate-650 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-violet-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
