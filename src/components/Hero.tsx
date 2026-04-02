import { motion } from 'motion/react';
import { ArrowRight, Mail } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-cyan-400 font-display font-medium tracking-widest uppercase text-sm mb-4"
          >
            Hey, I’m
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter leading-[0.9] mb-6"
          >
            ABHAY <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff4b4b] to-red-600">PORTFOLIO</span>
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-medium text-slate-300 mb-8 max-w-lg"
          >
            Full Stack Developer crafting high-performance digital experiences.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 text-lg mb-10 max-w-md"
          >
            I build scalable, user-centric applications using modern web technologies. Let's turn your vision into reality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="#contact"
              className="group relative px-8 py-4 bg-[#ff4b4b] text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Let’s Connect <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <div className="flex items-center gap-3 text-slate-300 hover:text-[#ff4b4b] transition-colors">
              <Mail size={20} />
              <span className="font-mono text-sm">hello@abhay.dev</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="hidden lg:block relative"
        >
          <div className="relative z-10 w-full aspect-square bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm p-8 flex items-center justify-center">
            <div className="w-full h-full border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🚀</div>
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Building the future</p>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
