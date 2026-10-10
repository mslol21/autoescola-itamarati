'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Car,
  GraduationCap,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  HelpCircle,
  Settings,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  AlertCircle,
  Upload,
  Eye,
  Key,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  X,
  Loader2,
  Search,
} from 'lucide-react';
import {
  HeroConfig,
  Service,
  Course,
  GalleryItem,
  NewsArticle,
  Testimonial,
  FaqItem,
  SiteSettings,
  ArticleStatus,
} from '@/lib/types';

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'hero'
    | 'services'
    | 'courses'
    | 'gallery'
    | 'news'
    | 'testimonials'
    | 'faqs'
    | 'settings'
  >('overview');

  // Data states
  const [hero, setHero] = useState<HeroConfig | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Feedback states
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal / Editing states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [previewArticle, setPreviewArticle] = useState<NewsArticle | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  // Delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: string;
    id: string;
    title: string;
  } | null>(null);

  // Password change state
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  // News search and filter
  const [newsSearch, setNewsSearch] = useState('');
  const [newsStatusFilter, setNewsStatusFilter] = useState('todos');

  // Trigger toast notification
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Check initial session
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [hRes, sRes, srvRes, cRes, gRes, nRes, tRes, fRes] = await Promise.all([
        fetch('/api/admin/hero'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/services'),
        fetch('/api/admin/courses'),
        fetch('/api/admin/gallery'),
        fetch('/api/admin/news'),
        fetch('/api/admin/testimonials'),
        fetch('/api/admin/faqs'),
      ]);

      if (hRes.ok) setHero(await hRes.json());
      if (sRes.ok) setSettings(await sRes.json());
      if (srvRes.ok) setServices(await srvRes.json());
      if (cRes.ok) setCourses(await cRes.json());
      if (gRes.ok) setGallery(await gRes.json());
      if (nRes.ok) setNews(await nRes.json());
      if (tRes.ok) setTestimonials(await tRes.json());
      if (fRes.ok) setFaqs(await fRes.json());
    } catch (err) {
      console.error('Error loading data:', err);
      showToast('error', 'Falha ao sincronizar dados com o servidor.');
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Credenciais inválidas.');
      }

      setIsAuthenticated(true);
      loadAllData();
      showToast('success', 'Bem-vindo ao painel administrativo!');
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao realizar login.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      showToast('success', 'Sessão encerrada com sucesso.');
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Image upload helper
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha no upload.');
      }
      return data.url;
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao enviar imagem.');
      return null;
    }
  };

  // ================= SAVE HANDLERS =================
  const saveHero = async () => {
    if (!hero) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Textos e imagem do Hero salvos com sucesso!');
    } catch {
      showToast('error', 'Erro ao salvar alterações do Hero.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Informações de contato e institucionais salvas!');
    } catch {
      showToast('error', 'Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveServiceItem = async (srv: Service) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(srv),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Serviço salvo com sucesso!');
      setEditingService(null);
      loadAllData();
    } catch {
      showToast('error', 'Erro ao salvar serviço.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveCourseItem = async (crs: Course) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crs),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Curso homologado salvo com sucesso!');
      setEditingCourse(null);
      loadAllData();
    } catch {
      showToast('error', 'Erro ao salvar curso.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveGalleryItem = async (item: GalleryItem) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Item da galeria salvo!');
      setEditingGallery(null);
      loadAllData();
    } catch {
      showToast('error', 'Erro ao salvar foto da galeria.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveNewsItem = async (art: NewsArticle) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(art),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Notícia salva no CMS com sucesso!');
      setEditingArticle(null);
      loadAllData();
    } catch {
      showToast('error', 'Erro ao salvar notícia.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveTestimonialItem = async (test: Testimonial) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Depoimento salvo!');
      setEditingTestimonial(null);
      loadAllData();
    } catch {
      showToast('error', 'Erro ao salvar depoimento.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveFaqItem = async (faq: FaqItem) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Pergunta frequente salva!');
      setEditingFaq(null);
      loadAllData();
    } catch {
      showToast('error', 'Erro ao salvar FAQ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdNew !== pwdConfirm) {
      showToast('error', 'A nova senha e a confirmação não coincidem.');
      return;
    }
    if (pwdNew.length < 6) {
      showToast('error', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwdCurrent, newPassword: pwdNew }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast('success', 'Senha administrativa alterada com sucesso!');
      setPwdCurrent('');
      setPwdNew('');
      setPwdConfirm('');
    } catch (err: any) {
      showToast('error', err.message || 'Falha ao alterar senha.');
    }
  };

  // Delete execution
  const executeDelete = async () => {
    if (!deleteConfirmation) return;
    const { type, id } = deleteConfirmation;

    try {
      const endpoint = `/api/admin/${type}?id=${encodeURIComponent(id)}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error();

      showToast('success', 'Item excluído com sucesso.');
      setDeleteConfirmation(null);
      loadAllData();
    } catch {
      showToast('error', 'Erro ao excluir item.');
    }
  };

  // ================= RENDER LOGIN IF NOT AUTHENTICATED =================
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-brand-700" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 via-slate-900 to-brand-950 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7 text-accent-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Painel da Equipe</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Autoescola Itamarati · Gestão de Conteúdo e Publicações
            </p>
          </div>

          {loginError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Usuário
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Seu usuário de acesso"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Sua senha segura"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ambiente administrativo seguro e monitorado.</span>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-accent-500 text-ink hover:bg-accent-400 shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-brand-700 hover:underline">
              ← Voltar ao site público da Autoescola Itamarati
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN AUTHENTICATED DASHBOARD =================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white animate-in slide-in-from-top-4 duration-200 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="bg-brand-950 text-white border-b border-brand-900 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center text-ink font-extrabold text-lg">
            i
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">
              Painel Autoescola Itamarati
            </h1>
            <span className="text-[11px] text-amber-400 font-medium">Área Administrativa</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver no site público</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Dashboard Body with Tabs */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 bg-white rounded-3xl p-3 border border-slate-200/90 shadow-subtle shrink-0">
          <nav className="space-y-1" aria-label="Abas do painel">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-colors ${
                activeTab === 'overview' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-colors ${
                activeTab === 'hero' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Hero & Início</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-colors ${
                activeTab === 'services' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Serviços ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-colors ${
                activeTab === 'courses' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Cursos Senatran ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-colors ${
                activeTab === 'gallery' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Galeria & Fotos ({gallery.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-colors ${
                activeTab === 'news' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notícias CMS ({news.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-colors ${
                activeTab === 'testimonials' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Depoimentos ({testimonials.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-colors ${
                activeTab === 'faqs' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Dúvidas (FAQ) ({faqs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-colors ${
                activeTab === 'settings' ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configurações & Contatos</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle min-h-[600px]">
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Visão Geral do Site</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Resumo dos conteúdos publicados e atalhos rápidos para a equipe administrativa.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-brand-50 border border-brand-100 space-y-1">
                  <span className="text-xs font-bold uppercase text-brand-700">Serviços Ativos</span>
                  <p className="text-3xl font-extrabold text-brand-950">{services.filter((s) => s.active).length}</p>
                </div>
                <div className="p-5 rounded-2xl bg-accent-50 border border-accent-100 space-y-1">
                  <span className="text-xs font-bold uppercase text-accent-800">Cursos Senatran</span>
                  <p className="text-3xl font-extrabold text-accent-950">{courses.filter((c) => c.active).length}</p>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                  <span className="text-xs font-bold uppercase text-emerald-700">Fotos Autorizadas</span>
                  <p className="text-3xl font-extrabold text-emerald-950">
                    {gallery.filter((g) => g.autorizadoUsoImagem).length}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                  <span className="text-xs font-bold uppercase text-purple-700">Notícias Publicadas</span>
                  <p className="text-3xl font-extrabold text-purple-950">
                    {news.filter((n) => n.status === 'publicado').length}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Ações Rápidas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setEditingArticle({
                        id: '',
                        slug: `noticia-${Date.now()}`,
                        title: '',
                        summary: '',
                        content: '',
                        coverImage: '',
                        category: 'Dicas Práticas',
                        author: 'Equipe Itamarati',
                        status: 'publicado',
                        publishedAt: new Date().toISOString().split('T')[0],
                        updatedAt: new Date().toISOString().split('T')[0],
                        isFeaturedHome: false,
                        seoTitle: '',
                        seoDescription: '',
                      });
                      setActiveTab('news');
                    }}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-brand-50 border border-slate-200 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="block text-sm text-slate-900">Nova Notícia / Artigo</strong>
                      <span className="text-xs text-slate-500">Publicar dicas ou novidades</span>
                    </div>
                    <Plus className="w-5 h-5 text-brand-700" />
                  </button>

                  <button
                    onClick={() => {
                      setEditingGallery({
                        id: '',
                        title: '',
                        category: 'conquistas',
                        categoryLabel: 'Conquistas',
                        imageUrl: '',
                        studentName: '',
                        categoryBadge: 'Categoria B',
                        caption: '',
                        isFeaturedHome: true,
                        autorizadoUsoImagem: true,
                        order: gallery.length + 1,
                        createdAt: new Date().toISOString().split('T')[0],
                      });
                      setActiveTab('gallery');
                    }}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-brand-50 border border-slate-200 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="block text-sm text-slate-900">Adicionar Foto de Aluno</strong>
                      <span className="text-xs text-slate-500">Conquistas e aprovações</span>
                    </div>
                    <Plus className="w-5 h-5 text-accent-800" />
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-brand-50 border border-slate-200 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <strong className="block text-sm text-slate-900">Atualizar Telefones/Horários</strong>
                      <span className="text-xs text-slate-500">WhatsApp, endereço e horários</span>
                    </div>
                    <Settings className="w-5 h-5 text-slate-700" />
                  </button>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  O site está conectado ao banco de dados persistente. Todas as alterações salvas aqui são refletidas imediatamente nas páginas públicas.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: HERO CONFIG */}
          {activeTab === 'hero' && hero && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hero da Página Inicial</h2>
                  <p className="text-sm text-slate-500">Personalize a primeira tela que o visitante visualiza no site.</p>
                </div>
                <button
                  type="button"
                  onClick={saveHero}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-accent-500 text-ink hover:bg-accent-400 shadow-md transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Badge Superior</label>
                  <input
                    type="text"
                    value={hero.badge}
                    onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Título Inicial</label>
                    <input
                      type="text"
                      value={hero.title}
                      onChange={(e) => setHero({ ...hero, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Título Destacado (Gradiente)</label>
                    <input
                      type="text"
                      value={hero.titleHighlight}
                      onChange={(e) => setHero({ ...hero, titleHighlight: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-accent-500 text-accent-800 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subtítulo Explicativo</label>
                  <textarea
                    rows={3}
                    value={hero.subtitle}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Texto Botão Principal</label>
                    <input
                      type="text"
                      value={hero.ctaPrimaryText}
                      onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Texto Botão Secundário</label>
                    <input
                      type="text"
                      value={hero.ctaSecondaryText}
                      onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                {/* Hero Image upload & Preview */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Imagem de Destaque do Hero</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                      <img src={hero.heroImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2 flex-grow">
                      <input
                        type="text"
                        value={hero.heroImageUrl}
                        onChange={(e) => setHero({ ...hero, heroImageUrl: e.target.value })}
                        placeholder="URL da imagem (/images/... ou /api/media/...)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-brand-700" />
                        <span>Fazer Upload de Nova Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              if (url) setHero({ ...hero, heroImageUrl: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVIÇOS */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Serviços de Habilitação</h2>
                  <p className="text-sm text-slate-500">Gerencie primeira CNH, adições, renovação e reciclagem.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingService({
                      id: '',
                      slug: `servico-${Date.now()}`,
                      title: '',
                      category: 'primeira-habilitacao',
                      categoryLabel: 'Primeira CNH',
                      shortDesc: '',
                      fullDesc: '',
                      forWhom: '',
                      requirements: ['RG ou documento com foto', 'CPF regular', 'Comprovante de residência'],
                      stages: ['Abertura de processo', 'Exame médico', 'Curso teórico CFC somente online', 'Aulas práticas', 'Exame final'],
                      faqs: [],
                      highlight: false,
                      active: true,
                      whatsappMessage: 'Olá! Gostaria de informações sobre este serviço.',
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-900 text-white hover:bg-brand-800 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Serviço</span>
                </button>
              </div>

              {/* Services Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Título</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {services.map((srv) => (
                      <tr key={srv.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{srv.title}</td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600">{srv.categoryLabel}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              srv.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {srv.active ? 'Ativo no site' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingService(srv)}
                            className="p-1.5 rounded-lg text-brand-700 hover:bg-brand-50"
                            title="Editar serviço"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmation({ type: 'services', id: srv.id, title: srv.title })}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            title="Excluir serviço"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CURSOS SENATRAN */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cursos Profissionalizantes</h2>
                  <p className="text-sm text-slate-500">Cursos 100% online homologados pela Senatran.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingCourse({
                      id: '',
                      slug: `curso-${Date.now()}`,
                      title: '',
                      kicker: 'Curso Homologado · Senatran',
                      shortDesc: '',
                      fullDesc: '',
                      cargaHoraria: '50 horas-aula',
                      modalidade: '100% online',
                      homologacao: 'Homologado pela Senatran',
                      investimento: 'Consulte condições facilitadas',
                      ementa: ['Legislação aplicada', 'Direção defensiva', 'Primeiros socorros'],
                      publicoAlvo: 'Motoristas profissionais',
                      requisitos: ['Idade mínima de 21 anos', 'CNH válida'],
                      active: true,
                      isFeatured: true,
                      badge: 'Novo',
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-900 text-white hover:bg-brand-800 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Curso</span>
                </button>
              </div>

              {/* Courses Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Nome do Curso</th>
                      <th className="py-3 px-4">Carga Horária</th>
                      <th className="py-3 px-4">Destaque</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses.map((crs) => (
                      <tr key={crs.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{crs.title}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">{crs.cargaHoraria}</td>
                        <td className="py-3.5 px-4">
                          {crs.isFeatured ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent-100 text-accent-800">
                              Destaque na Home
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Página de cursos</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingCourse(crs)}
                            className="p-1.5 rounded-lg text-brand-700 hover:bg-brand-50"
                            title="Editar curso"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmation({ type: 'courses', id: crs.id, title: crs.title })}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            title="Excluir curso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: GALERIA CMS COM AUTORIZAÇÃO DE USO DE IMAGEM */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Galeria de Fotos</h2>
                  <p className="text-sm text-slate-500">
                    Gerencie fotos de conquistas, aulas e instalações. Atenção: fotos sem autorização registrada NÃO são publicadas no site público.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingGallery({
                      id: '',
                      title: '',
                      category: 'conquistas',
                      categoryLabel: 'Conquistas',
                      imageUrl: '',
                      studentName: '',
                      categoryBadge: 'Categoria B',
                      caption: '',
                      isFeaturedHome: true,
                      autorizadoUsoImagem: true,
                      order: gallery.length + 1,
                      createdAt: new Date().toISOString().split('T')[0],
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-accent-500 text-ink hover:bg-accent-400 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Foto</span>
                </button>
              </div>

              {/* Gallery Grid in Admin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 relative">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                          {item.categoryLabel}
                        </span>

                        {/* Authorization Badge */}
                        <span
                          className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.autorizadoUsoImagem
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {item.autorizadoUsoImagem ? '✓ Autorizado' : '✗ Sem autorização (Oculto)'}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h3>
                      {item.studentName && <p className="text-xs text-amber-700 font-semibold">{item.studentName}</p>}
                      <p className="text-xs text-slate-500 line-clamp-2">{item.caption}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {item.isFeaturedHome ? 'Destaque na home' : 'Apenas galeria'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingGallery(item)}
                          className="p-1.5 rounded-lg text-brand-700 hover:bg-brand-100"
                          title="Editar foto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmation({ type: 'gallery', id: item.id, title: item.title })}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-100"
                          title="Excluir foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: NOTÍCIAS CMS */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">CMS de Notícias</h2>
                  <p className="text-sm text-slate-500">
                    Crie e publique artigos com sanitização, SEO e indicação de fontes oficiais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingArticle({
                      id: '',
                      slug: `noticia-${Date.now()}`,
                      title: '',
                      summary: '',
                      content: '',
                      coverImage: '',
                      category: 'Legislação Oficial',
                      author: 'Equipe Itamarati',
                      status: 'rascunho',
                      publishedAt: new Date().toISOString().split('T')[0],
                      updatedAt: new Date().toISOString().split('T')[0],
                      isFeaturedHome: false,
                      seoTitle: '',
                      seoDescription: '',
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-900 text-white hover:bg-brand-800 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar Nova Notícia</span>
                </button>
              </div>

              {/* Filter and search bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-grow w-full sm:w-auto">
                  <input
                    type="text"
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    placeholder="Pesquisar notícias por título..."
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={newsStatusFilter}
                  onChange={(e) => setNewsStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                >
                  <option value="todos">Todos os status</option>
                  <option value="publicado">Publicados</option>
                  <option value="rascunho">Rascunhos</option>
                  <option value="arquivado">Arquivados</option>
                </select>
              </div>

              {/* News Articles List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Título</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {news
                      .filter((n) => {
                        if (newsStatusFilter !== 'todos' && n.status !== newsStatusFilter) return false;
                        if (newsSearch && !n.title.toLowerCase().includes(newsSearch.toLowerCase())) return false;
                        return true;
                      })
                      .map((article) => (
                        <tr key={article.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                            {article.title}
                            {article.isFeaturedHome && (
                              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                Destaque Home
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{article.category}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                article.status === 'publicado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : article.status === 'rascunho'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {article.status === 'publicado'
                                ? 'Publicado'
                                : article.status === 'rascunho'
                                ? 'Rascunho'
                                : 'Arquivado'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">{article.publishedAt}</td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => setPreviewArticle(article)}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                              title="Pré-visualizar notícia"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingArticle(article)}
                              className="p-1.5 rounded-lg text-brand-700 hover:bg-brand-50"
                              title="Editar notícia"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirmation({ type: 'news', id: article.id, title: article.title })
                              }
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                              title="Excluir notícia"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: DEPOIMENTOS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Depoimentos de Alunos</h2>
                  <p className="text-sm text-slate-500">
                    Apenas relatos autênticos com origem identificada (sem notas ou selos fictícios).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingTestimonial({
                      id: '',
                      author: '',
                      category: 'Categoria B',
                      text: '',
                      rating: 5,
                      active: true,
                      date: 'Avaliação confirmada',
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-900 text-white hover:bg-brand-800 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Depoimento</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((test) => (
                  <div
                    key={test.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 text-sm font-bold">{test.author}</strong>
                        <span className="text-xs text-amber-700 font-semibold">{test.category}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 italic">&ldquo;{test.text}&rdquo;</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{test.date || 'Confirmado'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial(test)}
                          className="p-1.5 rounded-lg text-brand-700 hover:bg-brand-100"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirmation({ type: 'testimonials', id: test.id, title: test.author })
                          }
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: DÚVIDAS FREQUENTES (FAQ) */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Perguntas Frequentes (FAQ)</h2>
                  <p className="text-sm text-slate-500">Esclareça dúvidas comuns dos alunos organizadas por tópicos.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingFaq({
                      id: '',
                      topic: 'Primeira Habilitação',
                      question: '',
                      answer: '',
                      order: faqs.length + 1,
                      active: true,
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-900 text-white hover:bg-brand-800 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Pergunta</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent-800 block">
                        {faq.topic}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{faq.question}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingFaq(faq)}
                        className="p-1.5 rounded-lg text-brand-700 hover:bg-brand-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirmation({ type: 'faqs', id: faq.id, title: faq.question })
                        }
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: CONFIGURAÇÕES & INSTITUCIONAL & ALTERAR SENHA */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contatos & Configurações</h2>
                  <p className="text-sm text-slate-500">Telefones, WhatsApp, endereço e horários da empresa.</p>
                </div>
                <button
                  type="button"
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-accent-500 text-ink hover:bg-accent-400 shadow-md transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Salvando...' : 'Salvar Informações'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nome da Empresa</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={settings.cnpj}
                    onChange={(e) => setSettings({ ...settings, cnpj: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Telefone Fixo</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">WhatsApp de Atendimento</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-emerald-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">WhatsApp (Número Limpo)</label>
                  <input
                    type="text"
                    value={settings.whatsappClean}
                    onChange={(e) => setSettings({ ...settings, whatsappClean: e.target.value })}
                    placeholder="Ex: 5511970539746"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Bairro / Região</label>
                  <input
                    type="text"
                    value={settings.district}
                    onChange={(e) => setSettings({ ...settings, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">CEP</label>
                  <input
                    type="text"
                    value={settings.cep}
                    onChange={(e) => setSettings({ ...settings, cep: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Horário (Segunda a Sexta)</label>
                  <input
                    type="text"
                    value={settings.openingHoursWeekday}
                    onChange={(e) => setSettings({ ...settings, openingHoursWeekday: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Horário (Sábado)</label>
                  <input
                    type="text"
                    value={settings.openingHoursSaturday}
                    onChange={(e) => setSettings({ ...settings, openingHoursSaturday: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Password Change Box */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5 text-brand-700" />
                  <span>Alterar Senha do Administrador</span>
                </h3>
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Senha Atual</label>
                    <input
                      type="password"
                      required
                      value={pwdCurrent}
                      onChange={(e) => setPwdCurrent(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Nova Senha (Mínimo 6 dígitos)</label>
                    <input
                      type="password"
                      required
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      required
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-900 text-white hover:bg-brand-800 transition-colors"
                  >
                    Atualizar Senha
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: EDIT SERVICE ================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingService.id ? 'Editar Serviço' : 'Novo Serviço'}
              </h3>
              <button onClick={() => setEditingService(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Serviço</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug (URL amigável)</label>
                <input
                  type="text"
                  value={editingService.slug}
                  onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={editingService.category}
                    onChange={(e: any) =>
                      setEditingService({ ...editingService, category: e.target.value, categoryLabel: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="primeira-habilitacao">Primeira Habilitação</option>
                    <option value="adicao">Adição de Categoria</option>
                    <option value="renovacao">Renovação</option>
                    <option value="reciclagem">Reciclagem</option>
                    <option value="especiais">Especiais / Acolhedor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rótulo da Categoria</label>
                  <input
                    type="text"
                    value={editingService.categoryLabel}
                    onChange={(e) => setEditingService({ ...editingService, categoryLabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resumo Curto</label>
                <textarea
                  rows={2}
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição Completa</label>
                <textarea
                  rows={4}
                  value={editingService.fullDesc}
                  onChange={(e) => setEditingService({ ...editingService, fullDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Para quem é indicado</label>
                <input
                  type="text"
                  value={editingService.forWhom}
                  onChange={(e) => setEditingService({ ...editingService, forWhom: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.active}
                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                    className="w-4 h-4 text-brand-700 rounded"
                  />
                  <span className="font-semibold text-slate-800">Serviço ativo e visível no site</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => saveServiceItem(editingService)}
                className="px-5 py-2 rounded-xl bg-brand-900 text-white font-bold hover:bg-brand-800"
              >
                Salvar Serviço
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT COURSE ================= */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCourse.id ? 'Editar Curso' : 'Novo Curso Senatran'}
              </h3>
              <button onClick={() => setEditingCourse(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Curso</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kicker / Chave (Ex: Curso Homologado · Senatran)</label>
                <input
                  type="text"
                  value={editingCourse.kicker}
                  onChange={(e) => setEditingCourse({ ...editingCourse, kicker: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Carga Horária</label>
                  <input
                    type="text"
                    value={editingCourse.cargaHoraria}
                    onChange={(e) => setEditingCourse({ ...editingCourse, cargaHoraria: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modalidade</label>
                  <input
                    type="text"
                    value={editingCourse.modalidade}
                    onChange={(e) => setEditingCourse({ ...editingCourse, modalidade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resumo Curto</label>
                <textarea
                  rows={2}
                  value={editingCourse.shortDesc}
                  onChange={(e) => setEditingCourse({ ...editingCourse, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição Detalhada</label>
                <textarea
                  rows={3}
                  value={editingCourse.fullDesc}
                  onChange={(e) => setEditingCourse({ ...editingCourse, fullDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ementa (1 item por linha)</label>
                <textarea
                  rows={4}
                  value={editingCourse.ementa?.join('\n') || ''}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      ementa: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCourse.isFeatured}
                    onChange={(e) => setEditingCourse({ ...editingCourse, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-accent-500 rounded"
                  />
                  <span className="font-semibold text-slate-800">Destaque na página inicial</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCourse.active}
                    onChange={(e) => setEditingCourse({ ...editingCourse, active: e.target.checked })}
                    className="w-4 h-4 text-brand-700 rounded"
                  />
                  <span className="font-semibold text-slate-800">Curso ativo</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => saveCourseItem(editingCourse)}
                className="px-5 py-2 rounded-xl bg-brand-900 text-white font-bold hover:bg-brand-800"
              >
                Salvar Curso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT GALLERY ITEM (With Mandatory Image Authorization) ================= */}
      {editingGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingGallery.id ? 'Editar Foto da Galeria' : 'Adicionar Foto'}
              </h3>
              <button onClick={() => setEditingGallery(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Imagem</label>
                <input
                  type="text"
                  value={editingGallery.title}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Álbum / Categoria</label>
                  <select
                    value={editingGallery.category}
                    onChange={(e: any) =>
                      setEditingGallery({
                        ...editingGallery,
                        category: e.target.value,
                        categoryLabel: e.target.options[e.target.selectedIndex].text,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="conquistas">Conquistas & Alunos</option>
                    <option value="aulas">Aulas Práticas</option>
                    <option value="estrutura">Estrutura & Simulador</option>
                    <option value="equipe">Nossa Equipe</option>
                    <option value="eventos">Eventos & Treinamentos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Distintivo (Ex: Categoria B)</label>
                  <input
                    type="text"
                    value={editingGallery.categoryBadge || ''}
                    onChange={(e) => setEditingGallery({ ...editingGallery, categoryBadge: e.target.value })}
                    placeholder="Categoria A, B..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Aluno (Opcional)</label>
                <input
                  type="text"
                  value={editingGallery.studentName || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, studentName: e.target.value })}
                  placeholder="Nome do(a) aluno(a)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Legenda / Descrição</label>
                <textarea
                  rows={2}
                  value={editingGallery.caption}
                  onChange={(e) => setEditingGallery({ ...editingGallery, caption: e.target.value })}
                  placeholder="Breve relato ou legenda da foto"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {/* Photo Upload or URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Arquivo da Foto</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border shrink-0">
                    <img src={editingGallery.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <input
                      type="text"
                      value={editingGallery.imageUrl}
                      onChange={(e) => setEditingGallery({ ...editingGallery, imageUrl: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Substituir Foto / Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await handleFileUpload(e.target.files[0]);
                            if (url) setEditingGallery({ ...editingGallery, imageUrl: url });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* CRITICAL PRIVACY CONTROL: AUTORIZAÇÃO DE USO DE IMAGEM */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingGallery.autorizadoUsoImagem}
                    onChange={(e) =>
                      setEditingGallery({ ...editingGallery, autorizadoUsoImagem: e.target.checked })
                    }
                    className="w-5 h-5 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-amber-950 block">
                      Autorização de uso de imagem registrada
                    </span>
                    <span className="text-xs text-amber-800 block">
                      Fotos sem autorização formal do aluno NÃO serão exibidas no site público, em cumprimento à LGPD. Não exponha números de CNH ou documentos pessoais.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="feat-home"
                  checked={editingGallery.isFeaturedHome}
                  onChange={(e) => setEditingGallery({ ...editingGallery, isFeaturedHome: e.target.checked })}
                  className="w-4 h-4 text-accent-500 rounded"
                />
                <label htmlFor="feat-home" className="font-semibold text-slate-800 cursor-pointer">
                  Destacar esta foto na página inicial (Mosaico de conquistas)
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingGallery(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => saveGalleryItem(editingGallery)}
                className="px-5 py-2 rounded-xl bg-accent-500 text-ink font-bold hover:bg-accent-400"
              >
                Salvar Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ARTICLE (Full CMS with SEO and Status) ================= */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingArticle.id ? 'Editar Notícia no CMS' : 'Criar Nova Notícia'}
              </h3>
              <button onClick={() => setEditingArticle(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Matéria</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={editingArticle.slug}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Autor</label>
                  <input
                    type="text"
                    value={editingArticle.author}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status da Publicação</label>
                  <select
                    value={editingArticle.status}
                    onChange={(e: any) =>
                      setEditingArticle({ ...editingArticle, status: e.target.value as ArticleStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    <option value="rascunho">Rascunho (Privado)</option>
                    <option value="publicado">Publicado (No Site)</option>
                    <option value="arquivado">Arquivado</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data de Publicação</label>
                  <input
                    type="date"
                    value={editingArticle.publishedAt}
                    onChange={(e) => setEditingArticle({ ...editingArticle, publishedAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resumo da Notícia</label>
                <textarea
                  rows={2}
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Conteúdo Formatado</label>
                <textarea
                  rows={8}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Escreva o texto completo da matéria..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Imagem de Capa</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-900 border shrink-0">
                    <img src={editingArticle.coverImage} alt="Capa" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <input
                      type="text"
                      value={editingArticle.coverImage}
                      onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fazer Upload de Capa</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await handleFileUpload(e.target.files[0]);
                            if (url) setEditingArticle({ ...editingArticle, coverImage: url });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Official Source Link & SEO */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-700 block">Metadados & Fonte Oficial</span>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Link da Fonte Oficial Externa (ex: Gov.br / DETRAN)
                  </label>
                  <input
                    type="url"
                    value={editingArticle.sourceUrl || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, sourceUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Título SEO</label>
                    <input
                      type="text"
                      value={editingArticle.seoTitle || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, seoTitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Descrição SEO</label>
                    <input
                      type="text"
                      value={editingArticle.seoDescription || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, seoDescription: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="feat-news"
                  checked={editingArticle.isFeaturedHome}
                  onChange={(e) => setEditingArticle({ ...editingArticle, isFeaturedHome: e.target.checked })}
                  className="w-4 h-4 text-accent-500 rounded"
                />
                <label htmlFor="feat-news" className="font-semibold text-slate-800 cursor-pointer">
                  Exibir como destaque na página inicial
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setPreviewArticle(editingArticle)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-brand-700 bg-brand-50 hover:bg-brand-100 font-semibold text-xs sm:text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>Pré-visualizar</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const toSave = { ...editingArticle, status: 'rascunho' as ArticleStatus };
                    saveNewsItem(toSave);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300"
                >
                  Salvar Rascunho
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const toSave = { ...editingArticle, status: 'publicado' as ArticleStatus };
                    saveNewsItem(toSave);
                  }}
                  className="px-5 py-2 rounded-xl bg-accent-500 text-ink font-bold hover:bg-accent-400"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PREVIEW ARTICLE ================= */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-800 bg-accent-50 px-3 py-1 rounded-full">
                Pré-visualização da Matéria
              </span>
              <button onClick={() => setPreviewArticle(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{previewArticle.category}</span>
                <span>•</span>
                <span>{previewArticle.publishedAt}</span>
                <span>•</span>
                <span>Por {previewArticle.author}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {previewArticle.title}
              </h2>
              <p className="text-slate-600 text-base">{previewArticle.summary}</p>
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900">
                <img src={previewArticle.coverImage} alt="Capa" className="w-full h-full object-cover" />
              </div>
              <div className="prose max-w-none text-slate-700 whitespace-pre-line text-sm sm:text-base leading-relaxed pt-2">
                {previewArticle.content}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-brand-900 text-white font-bold"
              >
                Fechar Pré-visualização
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT TESTIMONIAL ================= */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingTestimonial.id ? 'Editar Depoimento' : 'Novo Depoimento'}
              </h3>
              <button onClick={() => setEditingTestimonial(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do(a) Aluno(a)</label>
                <input
                  type="text"
                  value={editingTestimonial.author}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoria Conquistada</label>
                <input
                  type="text"
                  value={editingTestimonial.category}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, category: e.target.value })}
                  placeholder="Categoria A, B ou A/B"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Relato / Depoimento</label>
                <textarea
                  rows={4}
                  value={editingTestimonial.text}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => saveTestimonialItem(editingTestimonial)}
                className="px-5 py-2 rounded-xl bg-brand-900 text-white font-bold"
              >
                Salvar Depoimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT FAQ ================= */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingFaq.id ? 'Editar FAQ' : 'Nova Pergunta Frequente'}
              </h3>
              <button onClick={() => setEditingFaq(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tópico / Assunto</label>
                <input
                  type="text"
                  value={editingFaq.topic}
                  onChange={(e) => setEditingFaq({ ...editingFaq, topic: e.target.value })}
                  placeholder="Primeira Habilitação, Cursos..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pergunta</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resposta</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingFaq(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => saveFaqItem(editingFaq)}
                className="px-5 py-2 rounded-xl bg-brand-900 text-white font-bold"
              >
                Salvar Pergunta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM DELETE ================= */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Confirmar exclusão?</h4>
              <p className="text-xs text-slate-500">
                Você tem certeza que deseja excluir <strong>&ldquo;{deleteConfirmation.title}&rdquo;</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
