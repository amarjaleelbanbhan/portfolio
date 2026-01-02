'use client';

export default function NeonButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 sm:px-6 py-3 bg-transparent border border-accent text-accent font-code uppercase tracking-wide sm:tracking-widest text-xs sm:text-sm font-semibold rounded-md transition-all duration-300 hover:bg-accent/10 hover:shadow-[0_0_20px_rgba(20,184,166,0.6)] active:scale-95 w-full sm:w-auto"
    >
      {children}
    </button>
  );
}
