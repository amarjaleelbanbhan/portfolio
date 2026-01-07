import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const SKILLS = [
  'Python', 'React', 'Next.js', 'Cybersecurity', 'AI', 
  'Node.js', 'Linux', 'SQL', 'TensorFlow'
];

export default function GravitySkills() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current || !canvasRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    const width = containerRef.current.clientWidth;
    const height = window.innerWidth < 640 ? 350 : 500;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Create walls (static bodies)
    const wallOptions = {
      isStatic: true,
      render: { fillStyle: 'transparent' },
    };

    const walls = [
      // Bottom
      Bodies.rectangle(width / 2, height + 25, width + 100, 50, wallOptions),
      // Left
      Bodies.rectangle(-25, height / 2, 50, height + 100, wallOptions),
      // Right
      Bodies.rectangle(width + 25, height / 2, 50, height + 100, wallOptions),
    ];

    Composite.add(world, walls);

    // Create skill pills
    const colors = ['#00ffff', '#00ff88', '#ff00ff', '#00d4ff', '#88ff00'];
    const skillBodies = SKILLS.map((skill, index) => {
      const pillWidth = skill.length * 12 + 40;
      const pillHeight = 40;
      const x = Math.random() * (width - 150) + 75;
      const y = Math.random() * 200 - 300; // Start above canvas
      const color = colors[index % colors.length];

      const pill = Bodies.rectangle(x, y, pillWidth, pillHeight, {
        chamfer: { radius: 20 },
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.01,
        render: {
          fillStyle: 'rgba(0, 0, 0, 0.3)',
          strokeStyle: color,
          lineWidth: 2,
        },
        label: skill,
        skillColor: color,
      });

      return pill;
    });

    Composite.add(world, skillBodies);

    // Add mouse control
    const mouse = Mouse.create(canvasRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Custom renderer for text on bodies
    Events.on(render, 'afterRender', () => {
      const context = render.context;
      
      skillBodies.forEach((body) => {
        const { x, y } = body.position;
        const angle = body.angle;
        
        context.save();
        context.translate(x, y);
        context.rotate(angle);
        
        // Draw text
        context.font = 'bold 14px "Fira Code", monospace';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Add glow effect
        context.shadowColor = body.skillColor || '#00ffff';
        context.shadowBlur = 10;
        
        context.fillText(body.label, 0, 0);
        
        context.restore();
      });
    });

    // Run the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [isClient]);

  // Shake function to re-drop skills
  const handleShake = () => {
    if (!engineRef.current) return;
    
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach((body) => {
      if (!body.isStatic && body.label) {
        Matter.Body.setPosition(body, {
          x: Math.random() * (containerRef.current?.clientWidth || 400 - 100) + 50,
          y: -100,
        });
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * 5,
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
      }
    });
  };

  if (!isClient) {
    return (
      <div className="glass-panel p-6 h-[560px] flex items-center justify-center">
        <p className="text-gray-400">Loading Physics Engine...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[var(--neon-cyan)] flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Interactive Skills
        </h2>
        <button
          onClick={handleShake}
          className="px-4 py-2 text-sm font-medium text-white bg-white/10 border border-[var(--neon-cyan)]/50 rounded-lg hover:bg-[var(--neon-cyan)]/20 hover:border-[var(--neon-cyan)] transition-all duration-300 hover:shadow-[0_0_15px_var(--neon-cyan)]"
        >
          Reset
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-3">Drag and throw the skill pills!</p>
      <div ref={containerRef} className="relative w-full rounded-lg overflow-hidden border border-white/10">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </div>
  );
}
