import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Code2, Database, Layout, Terminal } from 'lucide-react';

const iconMap: any = {
  Code2: <Code2 size={24} />,
  Layout: <Layout size={24} />,
  Database: <Database size={24} />,
  Terminal: <Terminal size={24} />,
};

export default function Skills() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <section id="skills" className="py-32 px-8 md:px-12 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Skills & Expertise<span className="text-[#ff4b4b]">.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            My technical toolkit is constantly evolving, focused on modern web technologies and best practices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, i) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-10 bg-slate-900 border border-slate-800 rounded-3xl hover:border-cyan-500/50 transition-all group"
            >
              <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                {iconMap[category.icon] || <Code2 size={24} />}
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-6">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill: string) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
