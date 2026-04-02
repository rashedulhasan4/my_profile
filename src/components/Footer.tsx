import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, Mail, MapPin, ArrowUp } from 'lucide-react';

const socialLinks = [
  { name: 'GitHub', icon: <Github size={20} />, href: '#' },
  { name: 'LinkedIn', icon: <Linkedin size={20} />, href: '#' },
  { name: 'Twitter', icon: <Twitter size={20} />, href: '#' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="py-32 px-8 md:px-12 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
              Get in Touch<span className="text-[#ff4b4b]">.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-md mb-12">
              I'm always open to new opportunities, collaborations, or just a friendly chat. Feel free to reach out!
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-300 hover:text-cyan-400 transition-colors group cursor-pointer">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Email</div>
                  <div className="text-lg font-medium">hello@johndoe.dev</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300 hover:text-cyan-400 transition-colors group cursor-pointer">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Location</div>
                  <div className="text-lg font-medium">San Francisco, CA</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="p-10 bg-slate-900 border border-slate-800 rounded-3xl hover:border-cyan-500/50 transition-all group">
              <h3 className="text-2xl font-display font-bold text-white mb-6">
                Let's build something amazing together!
              </h3>
              <p className="text-slate-400 mb-8">
                Whether you have a specific project in mind or just want to explore possibilities, I'm here to help.
              </p>
              <a
                href="mailto:hello@johndoe.dev"
                className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-500 text-slate-950 font-bold rounded-full transition-all hover:scale-105 active:scale-95"
              >
                Send a Message <Mail size={18} />
              </a>
            </div>

            <div className="flex items-center gap-6 mt-12">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ y: -5 }}
                  className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-8 pt-12 border-t border-slate-900">
          <div className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} John Doe. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all group"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
