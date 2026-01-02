import { motion } from 'framer-motion';
import { education } from '../data/portfolio';

export default function Education() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-neon-cyan mb-2">
            Education & Training
          </h2>
          <p className="text-gray-400">Academic Journey</p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-green to-neon-magenta" />

          {education.map((item, index) => (
            <motion.div
              key={item.school}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative flex ${
                index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
              } mb-8`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-neon-cyan border-4 border-midnight z-10 shadow-[0_0_10px_rgba(0,255,255,0.5)]" />

              {/* Content card */}
              <div
                className={`ml-12 md:ml-0 md:w-5/12 ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                }`}
              >
                <div className="glass-panel p-6 hover:border-neon-cyan/50 transition-all group">
                  {/* Icon & Period */}
                  <div className="flex items-center justify-between mb-3">
                    <svg className="w-8 h-8 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <span className="text-xs text-neon-green font-mono bg-neon-green/10 px-2 py-1 rounded">
                      {item.period}
                    </span>
                  </div>

                  {/* Degree */}
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-neon-cyan transition-colors">
                    {item.degree}
                  </h3>

                  {/* School */}
                  <p className="text-neon-magenta font-medium mb-2">
                    {item.school}
                  </p>

                  {/* Description */}
                  {item.description && (
                    <p className="text-gray-400 text-sm mb-2">
                      {item.description}
                    </p>
                  )}

                  {/* Grade */}
                  {item.grade && (
                    <span className="inline-block text-xs text-neon-green bg-neon-green/10 px-2 py-1 rounded">
                      {item.grade}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
