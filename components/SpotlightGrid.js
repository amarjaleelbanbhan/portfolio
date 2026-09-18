import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFeaturedSkillsGrouped } from '@/lib/content';

// Same four columns as before, now sourced from canonical content.
const SPOTLIGHT_CATEGORIES = ['Languages', 'AI', 'Security', 'Systems'];
const spotlightGroups = getFeaturedSkillsGrouped(SPOTLIGHT_CATEGORIES);

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
          {spotlightGroups.map(({ category, skills: groupSkills }, idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="space-y-3"
            >
              <p className="text-cyan-400 font-code text-sm mb-4 tracking-widest">
                &gt; {category.toUpperCase()}
              </p>
              <div className="space-y-3 flex flex-col">
                {groupSkills.map((skill) => (
                  <SpotlightCard
                    key={skill.slug}
                    skill={skill.name}
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
  // Card centre relative to the container. Measured once on mount via a ref
  // callback (and again on resize) instead of re-measuring every card on every
  // mousemove, which previously drove a full setState cascade per pointer event.
  const [center, setCenter] = useState(null);
  const cardRef = useRef(null);

  const measure = useCallback(() => {
    if (!cardRef.current || !containerRef.current) return;
    const cardRect = cardRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setCenter({
      x: cardRect.left - containerRect.left + cardRect.width / 2,
      y: cardRect.top - containerRect.top + cardRect.height / 2,
    });
  }, [containerRef]);

  const attachCard = useCallback(
    (node) => {
      cardRef.current = node;
      if (node) measure();
    },
    [measure]
  );

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // Derived during render — no state, no effect.
  let intensity = 0;
  if (isHovering && center) {
    const dx = mousePosition.x - center.x;
    const dy = mousePosition.y - center.y;
    intensity = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 250);
  }

  const isNear = intensity > 0.2;
  const borderOpacity = Math.min(intensity * 1.5, 1);
  const glowIntensity = intensity * 0.6;

  return (
    <div
      ref={attachCard}
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
