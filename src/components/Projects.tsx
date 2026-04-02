import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Fetch projects error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-32 px-8 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Projects<span className="text-[#ff4b4b]">.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A selection of my recent work, showcasing my expertise in building robust and scalable digital solutions.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#ff4b4b] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all hover:-translate-y-2"
              >
                <div className="aspect-video bg-slate-800 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                  {project.image}
                </div>
                <div className="p-10">
                  <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech?.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full border border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    {project.live && (
                      <a
                        href={project.live}
                        className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                    {project.code && (
                      <a
                        href={project.code}
                        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        <Github size={16} /> Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
