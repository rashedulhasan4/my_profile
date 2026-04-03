import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Blog', href: '#blog' },
  { name: 'Resume', href: '#resume', highlight: true },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['home', 'about', 'projects', 'skills', 'experience', 'blog', 'resume', 'contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          'pointer-events-auto flex items-center justify-between px-8 py-3 rounded-full border transition-all duration-300 max-w-fit md:min-w-[800px]',
          'bg-[#1a1a1a] border-[#333] shadow-2xl'
        )}
      >
        <div className="flex items-center gap-12 w-full justify-between">
          <a
            href="#home"
            className="text-xl font-display font-bold tracking-tight text-white whitespace-nowrap"
          >
            Abhay<span className="text-[#ff4b4b]">.</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-all rounded-full whitespace-nowrap',
                  activeSection === link.href.substring(1)
                    ? 'bg-[#3a1c1c] border border-[#ff4b4b]/30 text-white' 
                    : link.highlight
                    ? 'text-[#ff4b4b] hover:text-[#ff4b4b]/80'
                    : 'text-[#a1a1aa] hover:text-white'
                )}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full left-0 right-0 mt-4 p-4 bg-[#1a1a1a] border border-[#333] rounded-3xl lg:hidden shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'px-4 py-3 text-base font-medium rounded-2xl transition-colors',
                      activeSection === link.href.substring(1)
                        ? 'bg-[#3a1c1c] border border-[#ff4b4b]/30 text-white' 
                        : link.highlight
                        ? 'text-[#ff4b4b]'
                        : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
