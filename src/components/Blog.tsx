import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Fetch blog error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-32 px-8 md:px-12 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Blog<span className="text-[#ff4b4b]">.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Sharing my thoughts, experiences, and insights on modern web development and technology.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#ff4b4b] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all hover:-translate-y-2"
              >
                <div className="aspect-video bg-slate-800 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                  {post.image}
                </div>
                <div className="p-10">
                  <div className="flex items-center gap-4 mb-4 text-slate-500 text-xs font-mono uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} /> {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} /> {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-8 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                  >
                    Read More <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-lg font-bold text-slate-300 hover:text-cyan-400 transition-colors group"
          >
            View all posts <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
