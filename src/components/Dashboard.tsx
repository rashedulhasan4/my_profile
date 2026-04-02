import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  X, 
  Save,
  LogIn,
  Lock,
  Mail as MailIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'blog'>('projects');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Auth States
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Content States
  const [projects, setProjects] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    excerpt: '',
    content: '',
    tech: '',
    live: '',
    code: '',
    image: '🚀',
    date: new Date().toLocaleDateString(),
    readTime: '5 min read'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchData(token);
    }
    setLoading(false);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const [projRes, blogRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/blog')
      ]);
      setProjects(await projRes.json());
      setBlogPosts(await blogRes.json());
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        fetchData(data.token);
      } else {
        setAuthError(data.error || 'Login failed');
      }
    } catch (err) {
      setAuthError('Connection error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const endpoint = activeTab === 'projects' ? '/api/projects' : '/api/blog';
    const body = activeTab === 'projects' ? {
      title: formData.title,
      description: formData.description,
      tech: formData.tech.split(',').map(t => t.trim()),
      live: formData.live,
      code: formData.code,
      image: formData.image
    } : {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      date: formData.date,
      readTime: formData.readTime,
      image: formData.image
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        fetchData(token);
        setIsModalOpen(false);
        setFormData({
          title: '', description: '', excerpt: '', content: '',
          tech: '', live: '', code: '', image: '🚀',
          date: new Date().toLocaleDateString(), readTime: '5 min read'
        });
      }
    } catch (err) {
      console.error("Save error", err);
    }
  };

  const handleDelete = async (id: string, type: 'projects' | 'blog') => {
    if (!window.confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData(token!);
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#ff4b4b] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#1a1a1a] border border-[#333] p-10 md:p-12 rounded-[2.5rem] shadow-2xl"
      >
        <div className="w-20 h-20 bg-[#3a1c1c] rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Lock className="text-[#ff4b4b]" size={40} />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">Admin Login</h1>
        <p className="text-slate-400 mb-8 text-center">Enter your credentials to manage your portfolio.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={loginData.email}
              onChange={e => setLoginData({...loginData, email: e.target.value})}
              className="w-full bg-black border border-[#333] pl-12 pr-4 py-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={e => setLoginData({...loginData, password: e.target.value})}
              className="w-full bg-black border border-[#333] pl-12 pr-4 py-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors"
            />
          </div>
          {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
          <button
            type="submit"
            className="w-full py-4 bg-[#ff4b4b] text-white font-bold rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            <LogIn size={20} /> Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Dashboard<span className="text-[#ff4b4b]">.</span></h1>
            <p className="text-slate-400">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#ff4b4b] text-white font-bold rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus size={20} /> Add New
            </button>
            <button
              onClick={handleLogout}
              className="p-3 bg-[#1a1a1a] border border-[#333] rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => setActiveTab('projects')}
            className={cn(
              "px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2",
              activeTab === 'projects' ? "bg-[#3a1c1c] text-[#ff4b4b] border border-[#ff4b4b]/30" : "text-slate-400 hover:text-white"
            )}
          >
            <Briefcase size={20} /> Projects
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={cn(
              "px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2",
              activeTab === 'blog' ? "bg-[#3a1c1c] text-[#ff4b4b] border border-[#ff4b4b]/30" : "text-slate-400 hover:text-white"
            )}
          >
            <FileText size={20} /> Blog Posts
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeTab === 'projects' ? projects : blogPosts).map((item) => (
            <motion.div
              layout
              key={item._id}
              className="bg-[#1a1a1a] border border-[#333] p-8 rounded-3xl group relative"
            >
              <button
                onClick={() => handleDelete(item._id, activeTab)}
                className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={16} />
              </button>
              <div className="text-4xl mb-4">{item.image}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                {activeTab === 'projects' ? item.description : item.excerpt}
              </p>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                {activeTab === 'projects' ? item.tech?.join(', ') : item.date}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1a1a1a] border border-[#333] p-10 rounded-[2.5rem] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold">Add {activeTab === 'projects' ? 'Project' : 'Blog Post'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Title</label>
                  <input
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black border border-[#333] p-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors"
                  />
                </div>

                {activeTab === 'projects' ? (
                  <>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Description</label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-black border border-[#333] p-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors h-32"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Tech Stack (comma separated)</label>
                      <input
                        required
                        value={formData.tech}
                        onChange={e => setFormData({...formData, tech: e.target.value})}
                        className="w-full bg-black border border-[#333] p-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors"
                        placeholder="React, Next.js, Tailwind"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Live Link</label>
                        <input
                          value={formData.live}
                          onChange={e => setFormData({...formData, live: e.target.value})}
                          className="w-full bg-black border border-[#333] p-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Code Link</label>
                        <input
                          value={formData.code}
                          onChange={e => setFormData({...formData, code: e.target.value})}
                          className="w-full bg-black border border-[#333] p-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Excerpt</label>
                      <textarea
                        required
                        value={formData.excerpt}
                        onChange={e => setFormData({...formData, excerpt: e.target.value})}
                        className="w-full bg-black border border-[#333] p-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors h-24"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Content</label>
                      <textarea
                        required
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        className="w-full bg-black border border-[#333] p-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors h-48"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Icon/Emoji</label>
                    <input
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-black border border-[#333] p-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors"
                    />
                  </div>
                  {activeTab === 'blog' && (
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Read Time</label>
                      <input
                        value={formData.readTime}
                        onChange={e => setFormData({...formData, readTime: e.target.value})}
                        className="w-full bg-black border border-[#333] p-4 rounded-2xl focus:border-[#ff4b4b] outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-[#ff4b4b] text-white font-bold rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform mt-8"
                >
                  <Save size={20} /> Save {activeTab === 'projects' ? 'Project' : 'Post'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
