import { useState, useEffect, useRef, useCallback } from 'react';
import Confetti from 'react-confetti';

const REQUIRED_CLICKS = 5;
const GAME_DURATION = 15; // More time
const BUTTON_MOVE_INTERVAL = 1500; // Slower movement (1.5 seconds)

export default function TerminalGame() {
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [clicks, setClicks] = useState(0);
  const [buttonPos, setButtonPos] = useState({ x: 50, y: 50 });
  const [logs, setLogs] = useState([
    '> SECURE TERMINAL v2.0',
    '> Establishing encrypted connection...',
    '> Connection established.',
    '> Type "help" for commands or initialize brute force.',
  ]);
  const containerRef = useRef(null);
  const terminalRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 300, height: 150 });

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Update container size when game starts
  useEffect(() => {
    if (gameState === 'playing' && containerRef.current) {
      const updateSize = () => {
        if (containerRef.current) {
          setContainerSize({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
          });
        }
      };
      // Small delay to ensure container is rendered
      setTimeout(updateSize, 50);
    }
  }, [gameState]);

  // Move button to random position
  const moveButton = useCallback(() => {
    const buttonWidth = 100;
    const buttonHeight = 40;
    const padding = 10;
    const topOffset = 40; // Space for timer/progress bar
    
    const maxX = Math.max(containerSize.width - buttonWidth - padding, padding);
    const maxY = Math.max(containerSize.height - buttonHeight - padding - topOffset, padding);
    
    setButtonPos({
      x: Math.random() * (maxX - padding) + padding,
      y: Math.random() * (maxY - padding) + topOffset,
    });
  }, [containerSize]);

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('lost');
          setLogs((l) => [...l, '> ❌ ACCESS DENIED - TIMEOUT', '> Security protocols engaged.']);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Move button periodically (slower pace)
    const moveInterval = setInterval(moveButton, BUTTON_MOVE_INTERVAL);

    return () => {
      clearInterval(timer);
      clearInterval(moveInterval);
    };
  }, [gameState, moveButton]);

  // Check win condition
  useEffect(() => {
    if (clicks >= REQUIRED_CLICKS && gameState === 'playing') {
      setGameState('won');
      setLogs((l) => [
        ...l,
        '> ✅ ACCESS GRANTED',
        '> Decrypting contact data...',
        '> 📧 EMAIL: banbhanamarjalil@gmail.com',
        '> 📱 PHONE: +92 344 443 2197',
        '> 💬 WHATSAPP: wa.me/923444432197',
      ]);
    }
  }, [clicks, gameState]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setClicks(0);
    setLogs((l) => [
      ...l,
      '> INITIALIZING BRUTE FORCE...',
      '> ⚠️  Bypass security nodes to access contact data!',
      `> Click ACCESS NODE ${REQUIRED_CLICKS} times in ${GAME_DURATION} seconds!`,
    ]);
    // Initial button position will be set after container mounts
    setButtonPos({ x: 50, y: 50 });
  };

  const handleNodeClick = () => {
    if (gameState !== 'playing') return;
    const newClicks = clicks + 1;
    setClicks(newClicks);
    setLogs((l) => [...l, `> Node breached! [${newClicks}/${REQUIRED_CLICKS}]`]);
    moveButton();
  };

  const resetGame = () => {
    setGameState('idle');
    setTimeLeft(GAME_DURATION);
    setClicks(0);
    setLogs([
      '> SECURE TERMINAL v2.0',
      '> System reset.',
      '> Ready for new connection attempt.',
    ]);
  };

  return (
    <div className="glass-panel p-6 relative overflow-hidden">
      {gameState === 'won' && (
        <Confetti
          width={500}
          height={600}
          recycle={false}
          numberOfPieces={200}
          colors={['#00ffff', '#00ff88', '#ff00ff', '#ffffff']}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        />
      )}

      <h2 className="text-xl font-bold text-[var(--neon-green)] mb-4 flex items-center gap-2">
        <span>🔐</span> SECURE CHANNEL
      </h2>

      {/* Terminal Window */}
      <div className="bg-black/90 rounded-lg border border-[var(--neon-green)]/50 overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-black/50 border-b border-[var(--neon-green)]/30">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-[var(--neon-green)] text-xs ml-2">secure@terminal:~$</span>
        </div>

        {/* Terminal Body */}
        <div ref={terminalRef} className="p-4 h-48 overflow-y-auto text-sm scroll-smooth">
          {logs.map((log, i) => (
            <p
              key={i}
              className={`${
                log.includes('ACCESS GRANTED') || log.includes('EMAIL') || log.includes('PHONE') || log.includes('WHATSAPP')
                  ? 'text-[var(--neon-cyan)]'
                  : log.includes('DENIED')
                  ? 'text-red-400'
                  : 'text-[var(--neon-green)]'
              } mb-1`}
            >
              {log}
            </p>
          ))}
          {/* Blinking cursor */}
          <span className="inline-block w-2 h-4 bg-[var(--neon-green)] animate-pulse"></span>
        </div>

        {/* Game Area */}
        {gameState === 'playing' && (
          <div
            ref={containerRef}
            className="relative h-48 mx-4 mb-4 border border-dashed border-[var(--neon-green)]/30 rounded bg-black/50 overflow-hidden"
          >
            {/* Timer and Progress */}
            <div className="absolute top-2 left-2 right-2 flex justify-between text-xs z-10">
              <span className={`${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-[var(--neon-cyan)]'}`}>
                ⏱️ {timeLeft}s
              </span>
              <span className="text-[var(--neon-green)]">
                NODES: {clicks}/{REQUIRED_CLICKS}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-8 left-2 right-2 h-1 bg-white/10 rounded overflow-hidden">
              <div 
                className="h-full bg-[var(--neon-green)] transition-all duration-300"
                style={{ width: `${(clicks / REQUIRED_CLICKS) * 100}%` }}
              />
            </div>

            {/* Moving Button */}
            <button
              onClick={handleNodeClick}
              style={{
                position: 'absolute',
                left: `${buttonPos.x}px`,
                top: `${buttonPos.y}px`,
                transition: 'left 0.15s ease-out, top 0.15s ease-out',
              }}
              className="px-3 py-2 text-xs font-bold text-black bg-[var(--neon-green)] rounded hover:bg-[var(--neon-cyan)] shadow-[0_0_20px_var(--neon-green)] active:scale-95 transition-transform select-none"
            >
              ACCESS NODE
            </button>
          </div>
        )}

        {/* Control Buttons */}
        <div className="p-4 border-t border-[var(--neon-green)]/30">
          {gameState === 'idle' && (
            <button
              onClick={startGame}
              className="w-full py-3 text-sm font-bold text-black bg-[var(--neon-green)] rounded hover:bg-[var(--neon-cyan)] transition-colors shadow-[0_0_20px_var(--neon-green)] flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              INITIALIZE BRUTE FORCE
            </button>
          )}

          {gameState === 'lost' && (
            <button
              onClick={resetGame}
              className="w-full py-3 text-sm font-bold text-white bg-red-600 rounded hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              ACCESS DENIED. RETRY?
            </button>
          )}

          {gameState === 'won' && (
            <div className="text-center">
              <p className="text-[var(--neon-cyan)] text-sm mb-3 flex items-center justify-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> SYSTEM BREACHED SUCCESSFULLY!</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 text-sm font-bold text-white bg-white/10 border border-[var(--neon-cyan)] rounded hover:bg-[var(--neon-cyan)]/20 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
