import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

const experiences = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc.',
    companyUrl: '#',
    location: 'San Francisco, CA',
    date: '2022 - Present',
    description: [
      'Led the development of a high-traffic e-commerce platform using Next.js and Node.js.',
      'Implemented automated CI/CD pipelines, reducing deployment time by 40%.',
      'Mentored a team of 5 junior developers, fostering a culture of code quality and best practices.',
      'Optimized database queries, resulting in a 30% improvement in application performance.'
    ]
  },
  {
    title: 'Full Stack Developer',
    company: 'Creative Solutions Studio',
    companyUrl: '#',
    location: 'New York, NY',
    date: '2020 - 2022',
    description: [
      'Developed and maintained multiple client projects using React, Express, and MongoDB.',
      'Collaborated with designers to implement pixel-perfect, responsive user interfaces.',
      'Integrated third-party APIs for payment processing, social media, and analytics.',
      'Participated in agile development processes, including daily stand-ups and sprint planning.'
    ]
  },
  {
    title: 'Junior Web Developer',
    company: 'StartUp Hub',
    companyUrl: '#',
    location: 'Austin, TX',
    date: '2018 - 2020',
    description: [
      'Assisted in the development of a real-time collaboration tool using React and Socket.io.',
      'Fixed bugs and implemented new features based on user feedback.',
      'Gained experience in writing clean, modular, and well-documented code.',
      'Learned and applied modern web development tools and workflows.'
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-8 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Experience<span className="text-[#ff4b4b]">.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            My professional journey, showcasing my growth and contributions across different roles and companies.
          </p>
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title + exp.company}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative pl-8 border-l border-slate-800 group"
            >
              <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-slate-800 rounded-full group-hover:bg-cyan-400 transition-colors" />
              <div className="p-10 bg-slate-900 border border-slate-800 rounded-3xl hover:border-cyan-500/50 transition-all group-hover:-translate-y-1">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      {exp.title}
                    </h3>
                    <a
                      href={exp.companyUrl}
                      className="flex items-center gap-2 text-lg font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      {exp.company} <ExternalLink size={16} />
                    </a>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-mono text-sm font-bold mb-1">
                      {exp.date}
                    </div>
                    <div className="text-slate-500 text-sm font-medium">
                      {exp.location}
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {exp.description.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-slate-400 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
