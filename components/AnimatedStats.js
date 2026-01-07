import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '../data/portfolio';

function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  
  useEffect(() => {
    if (!inView) return;
    
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, inView]);
  
  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function AnimatedStats() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-magenta/5" />
      
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-neon-cyan mb-2">
            My Journey in Numbers
          </h2>
          <p className="text-gray-400">Milestones & Metrics</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100
              }}
              className="glass-panel p-6 text-center hover:border-neon-cyan/50 transition-all duration-300 group"
            >
              {/* Number */}
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-neon-green mb-2 group-hover:scale-110 transition-transform">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              
              {/* Label */}
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
              
              {/* Decorative line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta group-hover:w-3/4 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
