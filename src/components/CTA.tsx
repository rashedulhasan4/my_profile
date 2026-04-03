import { motion } from 'motion/react';
import { Download, FileText } from 'lucide-react';

export default function CTA() {
  return (
    <section id="resume" className="py-32 px-8 md:px-12 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-12 md:p-24 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-slate-800 rounded-[3rem] overflow-hidden text-center group"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 relative z-10">
            Want to know more<span className="text-[#ff4b4b]">?</span>
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12 relative z-10">
            I'm always open to new opportunities and collaborations. Feel free to reach out or check out my resume for more details.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-cyan-500 text-slate-950 font-bold rounded-full flex items-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              <FileText size={20} /> View Resume
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-slate-900 text-white font-bold rounded-full border border-slate-800 flex items-center gap-3 transition-all hover:border-cyan-500/50"
            >
              <Download size={20} /> Download CV
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
