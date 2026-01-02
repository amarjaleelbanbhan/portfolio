import { motion } from 'framer-motion';

export default function SkillBar({ label, level }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-slate-200 mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-slate-400">{level}%</span>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="h-full rounded-full bg-gradient-to-r from-accent via-sky-500 to-blue-500"
        />
      </div>
    </div>
  );
}
