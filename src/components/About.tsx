import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Briefcase, Users } from 'lucide-react';

const iconMap: any = {
  Briefcase: <Briefcase size={24} />,
  Award: <Award size={24} />,
  Users: <Users size={24} />,
};

export default function About() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <section id="about" className="py-32 px-8 md:px-12 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
              {data.title}<span className="text-[#ff4b4b]">.</span>
            </h2>
            <div className="space-y-6 text-slate-400 text-lg">
              {data.description.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {data.stats.map((stat: any, i: number) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-colors group"
                >
                  <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    {iconMap[stat.icon] || <Award size={24} />}
                  </div>
                  <div className="text-3xl font-display font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-9xl mb-4">👨‍💻</div>
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Profile Image Placeholder</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
