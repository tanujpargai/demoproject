# TaskFlow 🚀

A modern, responsive **Task Management Web Application** built with React, Vite, Tailwind CSS, and Supabase — featuring a full User Profile System.

---

## ✨ Features

### Authentication
- Email & password sign-up / login via Supabase Auth
- Protected routes (unauthenticated users redirected to `/login`)
- Auto-profile creation on sign-up via a Supabase database trigger

### Dashboard
- Welcome banner with personalised greeting
- Task statistics (Total / Completed / Pending)
- Clickable **Profile Card** showing avatar, name, and task counts

### Task Management
- Create, edit, delete tasks
- Mark tasks as Completed / Pending (toggle)
- Priority levels: Low · Medium · High (colour-coded badges)
- Due dates with overdue detection
- Filter by: All · Completed · Pending · High Priority
- Search tasks by title or description
- Per-user Row Level Security — each user sees only their own tasks

### User Profiles
- Dedicated `/profile` page
- Edit: full name, username, bio, phone, college, course
- Avatar upload to Supabase Storage (`avatars` bucket) with:
  - Image file type validation
  - 2 MB size limit
  - Live preview before saving
- Live username availability checker
- Skeleton loading state while profile loads

### UI/UX
- Dark-mode-first design (slate-950 base)
- Responsive sidebar — collapses to mobile drawer on small screens
- Header with avatar, username, and dropdown menu (My Profile · Dashboard · Logout)
- Toast notifications for every key action
- Custom scrollbar styling

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS 3 |
| Backend / DB | Supabase (Postgres + Auth + Storage) |
| Routing | React Router v6 |
| Icons | Lucide React |
| Fonts | Inter · Outfit (Google Fonts) |

---

## 📁 Project Structure

```
src/
├── lib/
│   └── supabase.js          # Supabase client
├── services/
│   ├── auth.js              # Auth API wrappers
│   ├── tasks.js             # Task CRUD
│   └── profiles.js          # Profile CRUD + avatar upload
├── hooks/
│   ├── useAuth.jsx          # Auth context (user + profile state)
│   ├── useTasks.js          # Task state, filtering, stats
│   └── useProfile.js        # Profile operations with loading state
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   ├── Tasks/
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskStats.jsx
│   │   └── TaskFilters.jsx
│   └── UI/
│       ├── Toast.jsx
│       └── Avatar.jsx
├── pages/
│   ├── Login.jsx
│   ├── SignUp.jsx
│   ├── Dashboard.jsx
│   └── Profile.jsx
└── App.jsx
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tanujpargai/demoproject.git
cd demoproject
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase project URL and anon key:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set up Supabase

Run the SQL from the [Database Setup](#database-setup) section below in your Supabase SQL editor.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄 Database Setup

Run the following SQL in your Supabase project's SQL editor:

```sql
-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  priority text DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed')),
  due_date date,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own tasks"   ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text, username text UNIQUE, bio text, avatar_url text,
  phone text, college text, course text,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE base_username text; new_username text; counter integer := 0;
BEGIN
  base_username := COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  new_username  := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = new_username) LOOP
    counter := counter + 1; new_username := base_username || counter::text;
  END LOOP;
  INSERT INTO public.profiles (id, full_name, username, bio) VALUES (new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new_username, 'Hello, I am using TaskFlow!');
  RETURN new;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar"    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = split_part(name,'/',1));
CREATE POLICY "Users can update their own avatar"    ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = split_part(name,'/',1));
CREATE POLICY "Users can delete their own avatar"    ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = split_part(name,'/',1));
```

---

## 📝 License

MIT
