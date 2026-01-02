import { motion } from 'framer-motion';
import Link from 'next/link';
import { achievements } from '../data/portfolio';

const typeIcons = {
  certification: '📜',
  award: '🏆',
  achievement: '⭐',
};

const typeColors = {
  certification: 'from-neon-cyan to-blue-500',
  award: 'from-yellow-500 to-orange-500',
  achievement: 'from-neon-green to-emerald-500',
};

export default function Achievements() {
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
            Achievements & Certifications
          </h2>
          <p className="text-gray-400">Recognition & Credentials</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-panel p-6 relative overflow-hidden group"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${typeColors[item.type] || typeColors.certification}`} />
              
              {/* Icon & Type */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{item.icon || typeIcons[item.type]}</span>
                <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded bg-gradient-to-r ${typeColors[item.type] || typeColors.certification} text-midnight font-semibold`}>
                  {item.type}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                {item.title}
              </h3>
              
              {/* Organization & Date */}
              <div className="text-gray-400 text-sm mb-4">
                <span className="text-neon-green">{item.organization}</span>
                <span className="mx-2">•</span>
                <span>{item.date}</span>
              </div>
              
              {/* Verify Link */}
              {item.verifyLink && !item.verifyLink.includes('...') && (
                <a
                  href={item.verifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-neon-cyan hover:text-neon-green transition-colors"
                >
                  <span>Verify Credential</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
        

      </div>
    </section>
  );
}
