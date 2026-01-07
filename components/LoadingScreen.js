import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootMessages = [
  'INITIALIZING SYSTEM...',
  'LOADING NEURAL INTERFACE...',
  'CONNECTING TO MAINFRAME...',
  'DECRYPTING PORTFOLIO DATA...',
  'AUTHENTICATING USER...',
  'SYSTEM READY.',
];

export default function LoadingScreen({ onComplete }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect for each line
  useEffect(() => {
    if (currentLine >= bootMessages.length) {
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(onComplete, 500);
      }, 500);
      return;
    }

    const message = bootMessages[currentLine];
    let charIndex = 0;
    setDisplayedText('');

    const typeInterval = setInterval(() => {
      if (charIndex <= message.length) {
        setDisplayedText(message.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setProgress(((currentLine + 1) / bootMessages.length) * 100);
        }, 300);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentLine, onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-midnight flex items-center justify-center overflow-hidden"
        >
          {/* Scanlines effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)'
            }}
          />
          
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />

          <div className="relative w-full max-w-2xl px-8">
            {/* Terminal header */}
            <div className="glass-panel rounded-t-lg border-b-0 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-gray-400 text-sm font-mono">amar@portfolio ~ boot</span>
            </div>
            
            {/* Terminal content */}
            <div className="glass-panel rounded-t-none p-6 font-mono text-sm">
              {/* Previous lines */}
              {bootMessages.slice(0, currentLine).map((msg, i) => (
                <div key={i} className="text-neon-green mb-1 flex items-center gap-2">
                  <span className="text-neon-cyan">&gt;</span>
                  {msg}
                  <span className="text-neon-magenta ml-2">✓</span>
                </div>
              ))}
              
              {/* Current line being typed */}
              {currentLine < bootMessages.length && (
                <div className="text-neon-green flex items-center gap-2">
                  <span className="text-neon-cyan">&gt;</span>
                  {displayedText}
                  <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-neon-cyan transition-opacity`}>█</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
                <span>BOOT PROGRESS</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-midnight-light rounded-full overflow-hidden border border-neon-cyan/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-cyan via-neon-green to-neon-magenta"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Glitch text effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center mt-8 text-neon-cyan/50 text-xs font-mono"
            >
              [ AMAR JALEEL PORTFOLIO v2.0 ]
            </motion.div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-neon-cyan/30" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-neon-cyan/30" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-neon-cyan/30" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-neon-cyan/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
