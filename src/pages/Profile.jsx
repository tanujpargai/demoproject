import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useToast } from '../components/UI/Toast';
import { Avatar } from '../components/UI/Avatar';
import {
  ArrowLeft,
  Camera,
  Save,
  X,
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  FileText,
  AtSign,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// ─── Skeleton loading card ─────────────────────────────────────────────────
const SkeletonField = () => (
  <div className="space-y-1.5">
    <div className="h-3 w-24 bg-slate-800 rounded animate-pulse" />
    <div className="h-11 w-full bg-slate-800 rounded-xl animate-pulse" />
  </div>
);

// ─── Field wrapper ──────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full px-4 py-2.5 text-sm text-slate-200 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 placeholder-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

// ─── Main Profile page ──────────────────────────────────────────────────────
export const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { loading, uploading, saveProfile, uploadAvatar, checkUsername } = useProfile();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form values
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    phone: '',
    college: '',
    course: '',
  });

  // Validation
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        college: profile.college || '',
        course: profile.course || '',
      });
    }
  }, [profile]);

  // ── Username uniqueness debounce ────────────────────────────────────────
  useEffect(() => {
    if (!editing) return;
    if (!form.username.trim() || form.username === profile?.username) {
      setUsernameAvailable(true);
      return;
    }
    const timeout = setTimeout(async () => {
      setUsernameChecking(true);
      const available = await checkUsername(form.username.trim(), user.id);
      setUsernameAvailable(available);
      setUsernameChecking(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [form.username, editing]);

  // ── Image picker ────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Only image files are accepted');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toastError('Image must be smaller than 2 MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ── Cancel edit ────────────────────────────────────────────────────────
  const handleCancel = () => {
    setEditing(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    setValidationError('');
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        college: profile.college || '',
        course: profile.course || '',
      });
    }
  };

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setValidationError('');

    if (!form.full_name.trim()) {
      setValidationError('Full name is required');
      return;
    }
    if (!form.username.trim()) {
      setValidationError('Username is required');
      return;
    }
    if (!usernameAvailable) {
      setValidationError('Username is already taken');
      return;
    }

    try {
      // Upload avatar first if a new file was selected
      if (selectedFile) {
        await uploadAvatar(user.id, selectedFile);
      }

      await saveProfile(user.id, {
        full_name: form.full_name.trim(),
        username: form.username.trim(),
        bio: form.bio.trim(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        course: form.course.trim(),
      });

      await refreshProfile();
      setEditing(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      success('Profile updated successfully!');
    } catch (err) {
      toastError(err.message || 'Failed to update profile');
    }
  };

  const avatarSrc = previewUrl || profile?.avatar_url || null;
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-8 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">My Profile</h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Avatar + basic info card ── */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-violet-600/8 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with camera overlay in edit mode */}
            <div className="relative group flex-shrink-0">
              <Avatar
                src={avatarSrc}
                name={profile?.full_name}
                email={user?.email}
                size="2xl"
                className="ring-4 ring-slate-900 shadow-xl"
              />

              {editing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Change avatar"
                >
                  {uploading ? (
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  ) : (
                    <Camera className="w-7 h-7 text-white" />
                  )}
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
              {loading && !profile ? (
                <>
                  <div className="h-6 w-40 bg-slate-800 rounded animate-pulse mx-auto sm:mx-0" />
                  <div className="h-4 w-28 bg-slate-800 rounded animate-pulse mx-auto sm:mx-0 mt-2" />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white truncate">{displayName}</h2>
                  <p className="text-sm text-slate-400">@{profile?.username || '—'}</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                    <Mail className="w-3.5 h-3.5" />
                    {user?.email}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {memberSince}
                  </p>
                </>
              )}
            </div>

            {/* Edit toggle button */}
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/10 active:scale-95"
              >
                <User className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Bio display (non-edit) */}
          {!editing && profile?.bio && (
            <p className="mt-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
              {profile.bio}
            </p>
          )}
        </div>

        {/* ── Profile details / edit form ── */}
        {loading && !profile ? (
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900 space-y-5">
            {[...Array(6)].map((_, i) => <SkeletonField key={i} />)}
          </div>
        ) : editing ? (
          /* ── EDIT MODE ── */
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900 space-y-5">
            <h3 className="text-base font-bold text-slate-100">Edit Information</h3>

            {validationError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {validationError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name" icon={User}>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </Field>

              <Field label="Username" icon={AtSign}>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm pointer-events-none">@</span>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                      }))
                    }
                    placeholder="username"
                    className={`${inputClass} pl-7 pr-9`}
                  />
                  {/* Availability indicator */}
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    {usernameChecking ? (
                      <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                    ) : form.username && form.username !== profile?.username ? (
                      usernameAvailable ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )
                    ) : null}
                  </div>
                </div>
                {!usernameAvailable && !usernameChecking && (
                  <p className="text-xs text-rose-400 mt-1">Username is already taken</p>
                )}
              </Field>

              <Field label="Phone" icon={Phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </Field>

              <Field label="College" icon={GraduationCap}>
                <input
                  type="text"
                  value={form.college}
                  onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))}
                  placeholder="Your college or university"
                  className={inputClass}
                />
              </Field>

              <Field label="Course" icon={BookOpen}>
                <input
                  type="text"
                  value={form.course}
                  onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
                  placeholder="e.g. B.Tech Computer Science"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Bio" icon={FileText}>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Tell us a little about yourself..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>

            {/* Avatar preview hint */}
            {previewUrl && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
                <Camera className="w-4 h-4 flex-shrink-0" />
                New avatar selected — it will be uploaded when you save.
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 text-sm font-medium transition-colors w-full sm:w-auto justify-center"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || uploading || !usernameAvailable || usernameChecking}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all w-full sm:w-auto justify-center"
              >
                {loading || uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {uploading ? 'Uploading...' : loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          /* ── VIEW MODE ── */
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900">
            <h3 className="text-base font-bold text-slate-100 mb-5">Profile Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', value: profile?.full_name, icon: User },
                { label: 'Username', value: profile?.username ? `@${profile.username}` : '—', icon: AtSign },
                { label: 'Email', value: user?.email, icon: Mail },
                { label: 'Phone', value: profile?.phone || '—', icon: Phone },
                { label: 'College', value: profile?.college || '—', icon: GraduationCap },
                { label: 'Course', value: profile?.course || '—', icon: BookOpen },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="space-y-1">
                  <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </dt>
                  <dd className="text-sm text-slate-200 truncate">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
