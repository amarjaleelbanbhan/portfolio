import { useEffect, useRef, useState } from 'react';

const DIRECTIONS = [
  ['0% 0%', '50% 0%', '100% 0%'],
  ['0% 50%', '50% 50%', '100% 50%'],
  ['0% 100%', '50% 100%', '100% 100%'],
];

export default function PortfolioMascot() {
  const [direction, setDirection] = useState([1, 1]);
  const [reacting, setReacting] = useState(false);
  const directionRef = useRef('1:1');
  const reactionTimer = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    if (!finePointer.matches) return undefined;

    let frame = 0;
    let latestPointer = null;
    const updateGaze = () => {
      frame = 0;
      if (!latestPointer) return;

      const mascot = document.querySelector('[data-portfolio-mascot]');
      if (!mascot) return;
      const bounds = mascot.getBoundingClientRect();
      const dx = (latestPointer.x - (bounds.left + bounds.width / 2)) / bounds.width;
      const dy = (latestPointer.y - (bounds.top + bounds.height / 2)) / bounds.height;
      const col = dx < -0.28 ? 0 : dx > 0.28 ? 2 : 1;
      const row = dy < -0.28 ? 0 : dy > 0.28 ? 2 : 1;
      const key = `${row}:${col}`;

      if (key !== directionRef.current) {
        directionRef.current = key;
        setDirection([row, col]);
      }
    };

    const onPointerMove = (event) => {
      latestPointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(updateGaze);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => () => window.clearTimeout(reactionTimer.current), []);

  const react = () => {
    setReacting(true);
    window.clearTimeout(reactionTimer.current);
    reactionTimer.current = window.setTimeout(() => setReacting(false), 520);
  };

  return (
    <button
      type="button"
      className={`portfolio-mascot${reacting ? ' is-reacting' : ''}`}
      data-portfolio-mascot
      aria-label="Amar's interactive mascot. Activate to make it react."
      title="Say hello"
      onClick={react}
    >
      <span
        className="portfolio-mascot__sprite"
        aria-hidden="true"
        style={{ backgroundPosition: DIRECTIONS[direction[0]][direction[1]] }}
      />
    </button>
  );
}
