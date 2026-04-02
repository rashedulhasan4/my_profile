import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "John is an exceptional developer who consistently delivers high-quality work. His expertise in full-stack development and attention to detail are truly impressive.",
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "Tech Innovations Inc.",
    avatar: "👩‍💼"
  },
  {
    quote: "Working with John was a pleasure. He is a great communicator and always goes the extra mile to ensure the project's success. Highly recommended!",
    name: "Michael Smith",
    role: "Founder & CEO",
    company: "Creative Solutions Studio",
    avatar: "👨‍💼"
  },
  {
    quote: "John's ability to solve complex technical challenges is remarkable. He is a valuable asset to any team and a true professional in every sense.",
    name: "Emily Davis",
    role: "Lead Designer",
    company: "StartUp Hub",
    avatar: "👩‍🎨"
  },
  {
    quote: "I've had the pleasure of collaborating with John on several projects. His technical skills and problem-solving abilities are top-notch.",
    name: "David Wilson",
    role: "Senior Developer",
    company: "Global Tech Solutions",
    avatar: "👨‍💻"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 px-8 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Testimonials<span className="text-[#ff4b4b]">.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Hear what my clients and colleagues have to say about working with me.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-12 bg-slate-900 border border-slate-800 rounded-3xl hover:border-cyan-500/50 transition-all group"
            >
              <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Quote size={32} />
              </div>
              <p className="text-slate-300 text-lg italic mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-display font-bold">
                    {testimonial.name}
                  </div>
                  <div className="text-slate-500 text-sm font-medium">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
