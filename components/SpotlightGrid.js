import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skills } from '../data/portfolio';

export default function SpotlightGrid() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <section className="section-container">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-slate-100 mb-8 text-glow"
      >
        TECH_STACK
      </motion.h2>
      
      {/* Spotlight Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-2xl bg-midnight/50 p-6 md:p-8 overflow-hidden"
        style={{
          background: isHovering
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(20, 184, 166, 0.06), transparent 40%)`
            : 'transparent',
        }}
      >
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {Object.entries(skills.categories).map((category, idx) => (
            <motion.div
              key={category[0]}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="space-y-3"
            >
              <p className="text-cyan-400 font-code text-sm mb-4 tracking-widest">
                &gt; {category[0].toUpperCase()}
              </p>
              <div className="space-y-3 flex flex-col">
                {category[1].map((skill) => (
                  <SpotlightCard
                    key={skill}
                    skill={skill}
                    mousePosition={mousePosition}
                    containerRef={containerRef}
                    isHovering={isHovering}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hint text */}
        <p className="text-center text-gray-600 text-xs mt-6 transition-opacity duration-300"
           style={{ opacity: isHovering ? 0 : 1 }}>
          Move your mouse to reveal the tech stack
        </p>
      </div>
    </section>
  );
}

function SpotlightCard({ skill, mousePosition, containerRef, isHovering }) {
  const cardRef = useRef(null);
  const [proximity, setProximity] = useState({ isNear: false, distance: 1000, intensity: 0 });

  // Calculate proximity using useEffect to avoid render loop
  useEffect(() => {
    if (!isHovering || !cardRef.current || !containerRef.current) {
      setProximity({ isNear: false, distance: 1000, intensity: 0 });
      return;
    }
    
    const cardRect = cardRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Card center relative to container
    const cardCenterX = cardRect.left - containerRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top - containerRect.top + cardRect.height / 2;
    
    // Distance from mouse to card center
    const dx = mousePosition.x - cardCenterX;
    const dy = mousePosition.y - cardCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const isNear = dist < 200;
    const intensity = Math.max(0, 1 - dist / 250);
    
    setProximity({ isNear, distance: dist, intensity });
  }, [mousePosition.x, mousePosition.y, isHovering, containerRef]);

  const { isNear, intensity } = proximity;
  const borderOpacity = Math.min(intensity * 1.5, 1);
  const glowIntensity = intensity * 0.6;

  return (
    <div
      ref={cardRef}
      className="relative px-3 py-2 rounded text-sm font-code transition-all duration-150 cursor-default"
      style={{
        border: `1px solid rgba(20, 184, 166, ${borderOpacity * 0.8})`,
        background: isNear
          ? `radial-gradient(circle at center, rgba(20, 184, 166, ${glowIntensity * 0.15}) 0%, transparent 70%)`
          : 'transparent',
        textShadow: isNear ? `0 0 ${10 * intensity}px rgba(20, 184, 166, ${intensity})` : 'none',
        boxShadow: isNear
          ? `0 0 ${20 * intensity}px rgba(20, 184, 166, ${glowIntensity}), inset 0 0 ${15 * intensity}px rgba(20, 184, 166, ${glowIntensity * 0.3})`
          : 'none',
      }}
    >
      <span
        className="transition-colors duration-150"
        style={{
          color: isNear
            ? `rgba(20, 184, 166, ${0.5 + intensity * 0.5})`
            : 'rgba(148, 163, 184, 0.4)',
        }}
      >
        {skill}
      </span>
    </div>
  );
}
