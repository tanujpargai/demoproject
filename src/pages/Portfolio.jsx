import React, { useState } from 'react';
import { Sidebar } from '../components/Layout/Sidebar';
import { Header } from '../components/Layout/Header';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../components/UI/Toast';
import { useCallback } from 'react';
import {
  ExternalLink,
  Globe,
  Sparkles,
  Eye,
  ArrowUpRight,
  Monitor,
  GraduationCap,
  Briefcase,
  FlaskConical,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    title: 'Business Med',
    description: 'A polished business-focused website with a medium-scale layout, featuring professional service offerings and modern enterprise aesthetics.',
    url: 'https://business-med.vercel.app/',
    category: 'Business',
    icon: Briefcase,
    accent: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
    border: 'hover:border-blue-500/40',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    tag: 'Enterprise',
  },
  {
    id: 2,
    title: 'Business Low',
    description: 'A sleek, lightweight business landing page optimised for speed and conversions — ideal for startups and lean ventures.',
    url: 'https://business-low.vercel.app/',
    category: 'Business',
    icon: Briefcase,
    accent: 'from-indigo-500 to-purple-500',
    glow: 'shadow-indigo-500/20',
    border: 'hover:border-indigo-500/40',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    tag: 'Startup',
  },
  {
    id: 3,
    title: 'Education Med',
    description: 'An engaging educational platform with structured course layouts, vibrant visuals, and a student-centric user experience.',
    url: 'https://education-med.vercel.app/',
    category: 'Education',
    icon: GraduationCap,
    accent: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    border: 'hover:border-emerald-500/40',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    tag: 'E-Learning',
  },
  {
    id: 4,
    title: 'Education Easy',
    description: 'A clean, minimal education portal designed for simplicity — making learning accessible and distraction-free for all users.',
    url: 'https://education-easy.vercel.app/',
    category: 'Education',
    icon: GraduationCap,
    accent: 'from-violet-500 to-pink-500',
    glow: 'shadow-violet-500/20',
    border: 'hover:border-violet-500/40',
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    tag: 'E-Learning',
  },
  {
    id: 5,
    title: 'Integral Labs 1',
    description: 'A cutting-edge tech lab portfolio showcasing innovative projects, research highlights, and team expertise with a bold identity.',
    url: 'https://integral-labs1.vercel.app/',
    category: 'Tech',
    icon: FlaskConical,
    accent: 'from-rose-500 to-orange-500',
    glow: 'shadow-rose-500/20',
    border: 'hover:border-rose-500/40',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    tag: 'Labs',
  },
  {
    id: 6,
    title: 'Integral Labs 2',
    description: 'The second iteration of Integral Labs — refined UI, expanded sections, and deeper brand storytelling for a premium tech presence.',
    url: 'https://integral-labs2-mcaf.vercel.app/',
    category: 'Tech',
    icon: FlaskConical,
    accent: 'from-amber-500 to-yellow-400',
    glow: 'shadow-amber-500/20',
    border: 'hover:border-amber-500/40',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    tag: 'Labs',
  },
];

const PreviewModal = ({ project, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  if (!project) return null;
  const Icon = project.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ height: 'clamp(400px, 85vh, 800px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br ${project.accent} shadow-md`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{project.title}</p>
              <p className="text-xs text-slate-500">{project.url}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Live
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* iframe */}
        <div className="relative flex-1 bg-white overflow-hidden">
          <iframe
            src={project.url}
            title={project.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
          />
        </div>

        {/* Nav arrows */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, index, onPreview }) => {
  const Icon = project.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition-all duration-500 ${project.border} hover:shadow-2xl ${project.glow} hover:-translate-y-1`}
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow orb */}
      <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br ${project.accent} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none`} />

      {/* Website Preview Thumbnail */}
      <div className="relative overflow-hidden bg-slate-950 aspect-video shrink-0">
        {/* iframe scaled-down preview */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <iframe
            src={project.url}
            title={`Preview of ${project.title}`}
            className="w-full h-full border-0"
            style={{
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
              width: '200%',
              height: '200%',
              pointerEvents: 'none',
            }}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            tabIndex={-1}
          />
        </div>

        {/* Overlay on hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-300 ${hovered ? 'opacity-100 bg-slate-950/70 backdrop-blur-[2px]' : 'opacity-0'}`}
        >
          <button
            onClick={() => onPreview(project)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-slate-800/90 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all shadow-xl"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r ${project.accent} rounded-xl hover:opacity-90 transition-all shadow-xl`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Visit
          </a>
        </div>

        {/* Category badge over thumbnail */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${project.badge} backdrop-blur-sm`}>
          <Icon className="w-3 h-3" />
          {project.tag}
        </div>

        {/* Live indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500"></span>
          </span>
          Live
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className={`flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${project.accent} shadow-lg shrink-0`}>
              <Icon className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">{project.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{project.category}</p>
            </div>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            title="Open site"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed flex-1 mt-1">
          {project.description}
        </p>

        {/* URL chip */}
        <div className="flex items-center gap-1.5 mt-4 px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800">
          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-xs text-slate-500 truncate font-mono">{project.url.replace('https://', '')}</span>
        </div>
      </div>
    </div>
  );
};

export const Portfolio = () => {
  const { success, error } = useToast();
  const handleSuccess = useCallback((msg) => success(msg), [success]);
  const handleError   = useCallback((msg) => error(msg),   [error]);

  const { stats, allTasks } = useTasks(handleSuccess, handleError);
  const highPriorityCount = allTasks.filter((t) => t.priority === 'High').length;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewProject, setPreviewProject] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Business', 'Education', 'Tech'];

  const filtered = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  const previewIndex = previewProject ? PROJECTS.findIndex((p) => p.id === previewProject.id) : -1;

  const handlePrev = () => {
    if (previewIndex > 0) setPreviewProject(PROJECTS[previewIndex - 1]);
  };
  const handleNext = () => {
    if (previewIndex < PROJECTS.length - 1) setPreviewProject(PROJECTS[previewIndex + 1]);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100 font-sans">
      <Sidebar
        currentFilter={filter}
        setFilter={setFilter}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        stats={stats}
        highPriorityCount={highPriorityCount}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        <Header
          setIsOpen={setSidebarOpen}
          currentFilter="Portfolio"
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-6 lg:p-8 space-y-8">

          {/* Hero Section */}
          <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/30 shadow-2xl">
            {/* Background orbs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/8 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Our Work</span>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  Portfolio &amp; Live Projects
                </h1>
                <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                  Explore our handcrafted websites — from lean startups to polished enterprise solutions. Each project is live, interactive, and built to impress.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 md:flex-col md:items-end shrink-0">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <Monitor className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-bold text-white">{PROJECTS.length}</span>
                  <span className="text-xs text-slate-400">Live Sites</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <span className="relative flex w-2 h-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">All Systems Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                    : 'text-slate-400 bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({PROJECTS.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onPreview={setPreviewProject}
              />
            ))}
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-600">
            <Globe className="w-3.5 h-3.5" />
            <span>All projects are live and hosted on Vercel</span>
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {previewProject && (
        <PreviewModal
          project={previewProject}
          onClose={() => setPreviewProject(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={previewIndex > 0}
          hasNext={previewIndex < PROJECTS.length - 1}
        />
      )}
    </div>
  );
};

export default Portfolio;
