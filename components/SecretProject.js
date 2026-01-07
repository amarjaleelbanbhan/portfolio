import { useState, useEffect, useRef, useCallback } from 'react';
import Confetti from 'react-confetti';

const TARGET_FREQUENCY = 0.02;
const TARGET_AMPLITUDE = 40;
const TOLERANCE = 0.003; // Frequency tolerance
const AMP_TOLERANCE = 8; // Amplitude tolerance

export default function SecretProject() {
  const canvasRef = useRef(null);
  const [frequency, setFrequency] = useState(0.01);
  const [amplitude, setAmplitude] = useState(20);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const animationRef = useRef(null);
  const offsetRef = useRef(0);

  // Check if waves match
  const checkMatch = useCallback(() => {
    const freqMatch = Math.abs(frequency - TARGET_FREQUENCY) <= TOLERANCE;
    const ampMatch = Math.abs(amplitude - TARGET_AMPLITUDE) <= AMP_TOLERANCE;
    
    // Calculate match percentage
    const freqDiff = 1 - Math.min(Math.abs(frequency - TARGET_FREQUENCY) / 0.03, 1);
    const ampDiff = 1 - Math.min(Math.abs(amplitude - TARGET_AMPLITUDE) / 50, 1);
    const percentage = Math.round((freqDiff * 50 + ampDiff * 50));
    setMatchPercentage(percentage);

    if (freqMatch && ampMatch && !isUnlocked) {
      setIsUnlocked(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [frequency, amplitude, isUnlocked]);

  useEffect(() => {
    checkMatch();
  }, [checkMatch]);

  // Draw waves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw center line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw TARGET wave (green, static)
      ctx.beginPath();
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 10;
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * TARGET_FREQUENCY) * TARGET_AMPLITUDE;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw PLAYER wave (cyan, animated)
      ctx.beginPath();
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin((x + offsetRef.current) * frequency) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Animate player wave
      offsetRef.current += 2;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequency, amplitude]);

  return (
    <div className="glass-panel p-6 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={400}
          height={600}
          recycle={false}
          numberOfPieces={150}
          colors={['#00ffff', '#00ff88', '#ff00ff', '#ffffff']}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--neon-magenta)] flex items-center gap-2">
          <span>🔒</span> TOP SECRET // CLASSIFIED
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            isUnlocked
              ? 'bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]'
              : 'bg-red-500/20 text-red-400 border border-red-500'
          }`}
        >
          {isUnlocked ? (
            <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg> UNLOCKED</span>
          ) : (
            <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> LOCKED</span>
          )}
        </span>
      </div>

      {!isUnlocked ? (
        <>
          {/* Instructions */}
          <p className="text-gray-400 text-sm mb-2">
            <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></span> Match the <span className="text-[var(--neon-cyan)]">cyan wave</span> to the{' '}
            <span className="text-[var(--neon-green)]">green target</span> to unlock!
          </p>
          <p className="text-gray-500 text-xs mb-4">
            <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></span> <strong>How to play:</strong> Use the sliders below to adjust the cyan wave&apos;s frequency and amplitude until it perfectly overlaps the green target wave. Get above 95% match to unlock!
          </p>

          {/* Wave Canvas */}
          <div className="relative mb-4 rounded-lg overflow-hidden border border-white/10 bg-black/30">
            <canvas
              ref={canvasRef}
              width={350}
              height={150}
              className="w-full"
            />
            {/* Match indicator */}
            <div className="absolute top-2 right-2 text-xs">
              <span className={matchPercentage > 90 ? 'text-[var(--neon-green)]' : 'text-gray-400'}>
                Match: {matchPercentage}%
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-gray-300">Frequency</label>
                <span className="text-[var(--neon-cyan)]">{frequency.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.04"
                step="0.001"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--neon-cyan)]"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-gray-300">Amplitude</label>
                <span className="text-[var(--neon-cyan)]">{amplitude}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={amplitude}
                onChange={(e) => setAmplitude(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--neon-cyan)]"
              />
            </div>
          </div>

          {/* Hint */}
          <p className="text-gray-500 text-xs mt-4 text-center flex items-center justify-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> Hint: Target frequency ≈ 0.02, amplitude ≈ 40
          </p>
        </>
      ) : (
        /* Unlocked Content */
        <div className="text-center py-6 animate-pulse">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-[var(--neon-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-[var(--neon-cyan)] mb-2">
            Autonomous Drone Swarm
          </h4>
          <p className="text-gray-300 text-sm mb-4">
            AI-powered multi-agent coordination system for autonomous drone fleets.
            Built with Python, TensorFlow, and ROS2.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['Python', 'TensorFlow', 'ROS2', 'Computer Vision', 'SLAM'].map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)] border border-[var(--neon-magenta)]/50 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-[var(--neon-green)] text-xs flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            You cracked the code! This project is currently in stealth mode.
          </p>
          <button
            onClick={() => {
              setIsUnlocked(false);
              setFrequency(0.01);
              setAmplitude(20);
            }}
            className="mt-4 px-4 py-2 text-sm text-white bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Lock Again
          </button>
        </div>
      )}
    </div>
  );
}
