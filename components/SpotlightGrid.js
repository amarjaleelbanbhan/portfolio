/**
 * The homepage tech stack.
 *
 * The spotlight is kept — it is one of the site's signatures and it costs
 * nothing but a `mousemove` on a container. What changed in Phase 16 is what it
 * illuminates: each card now carries the work the technology was actually used
 * in and links into the Skill Galaxy, so the section is evidence rather than a
 * list of nouns that happen to glow.
 *
 * Cards are real links, not decorated divs. That means keyboard users reach
 * them, the glow is not the only affordance, and a touch user gets the same
 * destination without a hover state existing at all.
 */
import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getFeaturedSkillsGrouped, getSkillEvidenceLabels } from '@/lib/content';

// The same four columns as before, still sourced from canonical content — now
// carrying each skill's evidence alongside its name.
const SPOTLIGHT_CATEGORIES = ['Languages', 'AI', 'Security', 'Systems'];
const spotlightGroups = getFeaturedSkillsGrouped(SPOTLIGHT_CATEGORIES).map(
  ({ category, skills }) => ({
    category,
    skills: skills.map((skill) => ({
      slug: skill.slug,
      name: skill.name,
      evidence: getSkillEvidenceLabels(skill.slug),
    })),
  })
);

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
    <section className="section-container" aria-labelledby="tech-stack-heading">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between flex-wrap gap-4 mb-8"
      >
        <div>
          <h2 id="tech-stack-heading" className="text-3xl font-bold text-slate-100 text-glow m-0">
            TECH_STACK
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
            Each one is listed with what it was used to build. No proficiency percentages.
          </p>
        </div>
        <Link
          href="/skills"
          className="text-sm font-medium text-neon-cyan hover:text-white transition-colors font-code min-h-[44px] inline-flex items-center"
        >
          Explore the skill galaxy →
        </Link>
      </motion.div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {spotlightGroups.map(({ category, skills: groupSkills }, idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="space-y-3 min-w-0"
            >
              <p className="text-cyan-400 font-code text-sm mb-4 tracking-widest">
                &gt; {category.toUpperCase()}
              </p>
              <ul className="list-none m-0 p-0 space-y-3 flex flex-col">
                {groupSkills.map((skill) => (
                  <li key={skill.slug} className="min-w-0">
                    <SpotlightCard
                      skill={skill}
                      mousePosition={mousePosition}
                      containerRef={containerRef}
                      isHovering={isHovering}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p
          className="text-center text-slate-600 text-xs mt-6 transition-opacity duration-300"
          style={{ opacity: isHovering ? 0 : 1 }}
        >
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
    <Link
      ref={attachCard}
      href={`/skills#skill-${skill.slug}`}
      className="group block relative px-3 py-2.5 rounded text-sm font-code transition-all duration-150 min-h-[44px]"
      style={{
        // The resting border is faint but present: without it the cards are
        // invisible until hovered, which leaves a touch user with nothing.
        border: `1px solid rgba(20, 184, 166, ${Math.max(borderOpacity * 0.8, 0.14)})`,
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
        className="block transition-colors duration-150 group-hover:text-neon-cyan"
        style={{
          color: isNear ? `rgba(20, 184, 166, ${0.6 + intensity * 0.4})` : 'rgba(203, 213, 225, 0.85)',
        }}
      >
        {skill.name}
      </span>
      {skill.evidence.length > 0 && (
        <span className="block text-[10px] text-slate-500 leading-snug mt-1 truncate">
          {skill.evidence.join(' · ')}
        </span>
      )}
    </Link>
  );
}
