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
  Mail as MailIcon,
  Code2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'blog' | 'hero' | 'about' | 'skills' | 'experience'>('projects');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Auth States
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Content States
  const [projects, setProjects] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [heroData, setHeroData] = useState<any>(null);
  const [aboutData, setAboutData] = useState<any>(null);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [experienceData, setExperienceData] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    excerpt: '',
    content: '',
    tech: '',
    live: '',
    code: '',
    image: '🚀',
    date: new Date().toLocaleDateString(),
    readTime: '5 min read',
    // Hero fields
    name: '',
    subtitle: '',
    email: '',
    // About fields
    stats: [],
    // Experience fields
    company: '',
    companyUrl: '',
    location: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchData();
    }
    setLoading(false);
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, blogRes, heroRes, aboutRes, skillsRes, expRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/blog'),
        fetch('/api/hero'),
        fetch('/api/about'),
        fetch('/api/skills'),
        fetch('/api/experience')
      ]);
      setProjects(await projRes.json());
      setBlogPosts(await blogRes.json());
      setHeroData(await heroRes.json());
      setAboutData(await aboutRes.json());
      setSkillsData(await skillsRes.json());
      setExperienceData(await expRes.json());
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
        fetchData();
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

  const handleEditHero = () => {
    setFormData({ ...heroData });
    setActiveTab('hero');
    setIsModalOpen(true);
  };

  const handleEditAbout = () => {
    setFormData({ ...aboutData, description: aboutData.description.join('\n') });
    setActiveTab('about');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    let endpoint = `/api/${activeTab}`;
    let body: any = {};

    if (activeTab === 'projects') {
      body = {
        title: formData.title,
        description: formData.description,
        tech: typeof formData.tech === 'string' ? formData.tech.split(',').map((t: string) => t.trim()) : formData.tech,
        live: formData.live,
        code: formData.code,
        image: formData.image
      };
    } else if (activeTab === 'blog') {
      body = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        date: formData.date,
        readTime: formData.readTime,
        image: formData.image
      };
    } else if (activeTab === 'hero') {
      body = {
        name: formData.name,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        email: formData.email
      };
    } else if (activeTab === 'about') {
      body = {
        title: formData.title,
        description: formData.description.split('\n').filter((s: string) => s.trim()),
        stats: formData.stats
      };
    } else if (activeTab === 'skills') {
      // Skills is an array of categories
      body = skillsData; 
    } else if (activeTab === 'experience') {
      body = experienceData;
    }

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
        fetchData();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Save error", err);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!window.confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
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
              onClick={() => {
                setFormData({
                  title: '', description: '', excerpt: '', content: '',
                  tech: '', live: '', code: '', image: '🚀',
                  date: new Date().toLocaleDateString(), readTime: '5 min read',
                  name: '', subtitle: '', email: '', stats: []
                });
                setIsModalOpen(true);
              }}
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
        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { id: 'projects', icon: <Briefcase size={20} />, label: 'Projects' },
            { id: 'blog', icon: <FileText size={20} />, label: 'Blog' },
            { id: 'hero', icon: <LayoutDashboard size={20} />, label: 'Hero' },
            { id: 'about', icon: <LayoutDashboard size={20} />, label: 'About' },
            { id: 'skills', icon: <Code2 size={20} />, label: 'Skills' },
            { id: 'experience', icon: <Briefcase size={20} />, label: 'Experience' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-[#3a1c1c] text-[#ff4b4b] border border-[#ff4b4b]/30" : "text-slate-400 hover:text-white"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {activeTab === 'projects' || activeTab === 'blog' ? (
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
        ) : activeTab === 'hero' ? (
          <div className="bg-[#1a1a1a] border border-[#333] p-10 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Hero Section Data</h2>
              <button onClick={handleEditHero} className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-full">Edit Hero</button>
            </div>
            {heroData && (
              <div className="space-y-4">
                <p><span className="text-slate-500">Name:</span> {heroData.name}</p>
                <p><span className="text-slate-500">Title:</span> {heroData.title}</p>
                <p><span className="text-slate-500">Subtitle:</span> {heroData.subtitle}</p>
                <p><span className="text-slate-500">Description:</span> {heroData.description}</p>
                <p><span className="text-slate-500">Email:</span> {heroData.email}</p>
              </div>
            )}
          </div>
        ) : activeTab === 'about' ? (
          <div className="bg-[#1a1a1a] border border-[#333] p-10 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">About Section Data</h2>
              <button onClick={handleEditAbout} className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-full">Edit About</button>
            </div>
            {aboutData && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-500 mb-2">Title</h3>
                  <p>{aboutData.title}</p>
                </div>
                <div>
                  <h3 className="text-slate-500 mb-2">Description Paragraphs</h3>
                  {aboutData.description.map((p: string, i: number) => <p key={i} className="mb-2">{p}</p>)}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'skills' ? (
          <div className="bg-[#1a1a1a] border border-[#333] p-10 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Skills Data</h2>
              <button onClick={() => {
                const token = localStorage.getItem('token');
                fetch('/api/skills', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify(skillsData)
                }).then(fetchData);
              }} className="px-6 py-2 bg-green-500 text-black font-bold rounded-full">Save All Skills</button>
            </div>
            <div className="space-y-8">
              {skillsData.map((cat, idx) => (
                <div key={idx} className="p-6 bg-black rounded-2xl border border-[#333]">
                  <input 
                    value={cat.category} 
                    onChange={e => {
                      const newSkills = [...skillsData];
                      newSkills[idx].category = e.target.value;
                      setSkillsData(newSkills);
                    }}
                    className="bg-transparent text-xl font-bold mb-4 outline-none border-b border-[#333] focus:border-[#ff4b4b]"
                  />
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill: string, sIdx: number) => (
                      <input 
                        key={sIdx}
                        value={skill}
                        onChange={e => {
                          const newSkills = [...skillsData];
                          newSkills[idx].skills[sIdx] = e.target.value;
                          setSkillsData(newSkills);
                        }}
                        className="bg-[#1a1a1a] px-3 py-1 rounded-lg text-sm border border-[#333] outline-none focus:border-[#ff4b4b]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#333] p-10 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Experience Data</h2>
              <button onClick={() => {
                const token = localStorage.getItem('token');
                fetch('/api/experience', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify(experienceData)
                }).then(fetchData);
              }} className="px-6 py-2 bg-green-500 text-black font-bold rounded-full">Save All Experience</button>
            </div>
            <div className="space-y-8">
              {experienceData.map((exp, idx) => (
                <div key={idx} className="p-6 bg-black rounded-2xl border border-[#333] space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      value={exp.title} 
                      onChange={e => {
                        const newExp = [...experienceData];
                        newExp[idx].title = e.target.value;
                        setExperienceData(newExp);
                      }}
                      placeholder="Title"
                      className="bg-transparent font-bold outline-none border-b border-[#333] focus:border-[#ff4b4b]"
                    />
                    <input 
                      value={exp.company} 
                      onChange={e => {
                        const newExp = [...experienceData];
                        newExp[idx].company = e.target.value;
                        setExperienceData(newExp);
                      }}
                      placeholder="Company"
                      className="bg-transparent outline-none border-b border-[#333] focus:border-[#ff4b4b]"
                    />
                  </div>
                  <textarea 
                    value={exp.description.join('\n')} 
                    onChange={e => {
                      const newExp = [...experienceData];
                      newExp[idx].description = e.target.value.split('\n');
                      setExperienceData(newExp);
                    }}
                    placeholder="Description (one per line)"
                    className="w-full bg-[#1a1a1a] p-4 rounded-xl outline-none border border-[#333] h-32"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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
                <h2 className="text-2xl font-display font-bold">Edit {activeTab.toUpperCase()}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'hero' ? (
                  <>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Name</label>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-[#333] p-4 rounded-2xl outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Title</label>
                      <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-[#333] p-4 rounded-2xl outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Subtitle</label>
                      <input value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-black border border-[#333] p-4 rounded-2xl outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Description</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-[#333] p-4 rounded-2xl outline-none h-32" />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Email</label>
                      <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-[#333] p-4 rounded-2xl outline-none" />
                    </div>
                  </>
                ) : activeTab === 'about' ? (
                  <>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Title</label>
                      <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-[#333] p-4 rounded-2xl outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">Description (One paragraph per line)</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-[#333] p-4 rounded-2xl outline-none h-64" />
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-5 bg-[#ff4b4b] text-white font-bold rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform mt-8"
                >
                  <Save size={20} /> Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
