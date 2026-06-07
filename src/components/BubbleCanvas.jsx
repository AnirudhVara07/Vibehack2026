import React, { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

// Hand-authored starting positions (percentage of canvas)
const START_POSITIONS = {
  "big-life": [30, 23],
  morning: [71, 16],
  burnout: [26, 55],
  lonely: [73, 47],
  joys: [45, 81],
  starting: [76, 79],
};

function seed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function BubbleCanvas({ circles, palette, layout, intensity, onOpen }) {
  const containerRef = useRef(null);
  const bubblesRef = useRef([]);
  // Physics state
  const physicsRef = useRef([]);

  // Base speed factor
  const speedMultiplier = intensity === "still" ? 0.2 : intensity === "gentle" ? 0.5 : 1.2;

  // Initialize physics objects
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    physicsRef.current = circles.map((c) => {
      const pos = START_POSITIONS[c.id] || [50, 50];
      const radius = c.size / 2;
      const x = (pos[0] / 100) * rect.width;
      const y = (pos[1] / 100) * rect.height;
      
      const s = seed(c.id);
      const angle = s * Math.PI * 2;
      const speed = (0.5 + s) * speedMultiplier;

      return {
        id: c.id,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius,
        mass: c.size,
      };
    });

  }, [circles, intensity, speedMultiplier]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId;

    const updatePhysics = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const phys = physicsRef.current;

      // Update positions & wall collisions
      for (let i = 0; i < phys.length; i++) {
        const p = phys[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wall collisions
        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx *= -1;
        } else if (p.x + p.radius > rect.width) {
          p.x = rect.width - p.radius;
          p.vx *= -1;
        }

        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vy *= -1;
        } else if (p.y + p.radius > rect.height) {
          p.y = rect.height - p.radius;
          p.vy *= -1;
        }
      }

      // Bubble collisions (O(n^2) is fine for 6 items)
      for (let i = 0; i < phys.length; i++) {
        for (let j = i + 1; j < phys.length; j++) {
          const p1 = phys[i];
          const p2 = phys[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.hypot(dx, dy);
          const minDist = p1.radius + p2.radius;

          if (distance < minDist) {
            // Overlapping - resolve collision
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Rotate velocities
            const v1 = { x: p1.vx * cos + p1.vy * sin, y: p1.vy * cos - p1.vx * sin };
            const v2 = { x: p2.vx * cos + p2.vy * sin, y: p2.vy * cos - p2.vx * sin };

            // 1D elastic collision
            const m1 = p1.mass;
            const m2 = p2.mass;
            const vTotal = v1.x - v2.x;
            
            const v1x = ((m1 - m2) * v1.x + 2 * m2 * v2.x) / (m1 + m2);
            const v2x = vTotal + v1x;

            // Rotate back
            p1.vx = v1x * cos - v1.y * sin;
            p1.vy = v1.y * cos + v1x * sin;
            p2.vx = v2x * cos - v2.y * sin;
            p2.vy = v2.y * cos + v2x * sin;

            // Separate them to prevent sticking
            const overlap = minDist - distance;
            const sepX = (overlap / 2) * cos;
            const sepY = (overlap / 2) * sin;
            
            p1.x -= sepX;
            p1.y -= sepY;
            p2.x += sepX;
            p2.y += sepY;
          }
        }
      }

      // Apply to DOM via refs for 60fps without React re-renders
      for (let i = 0; i < phys.length; i++) {
        const p = phys[i];
        const el = bubblesRef.current[i];
        if (el) {
          el.style.transform = `translate(${p.x - p.radius}px, ${p.y - p.radius}px)`;
        }
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const openBubble = (index, circle) => {
    const el = bubblesRef.current[index];
    if (el) {
      onOpen(circle, el.getBoundingClientRect());
    }
  };

  return (
    <div className="home" ref={containerRef}>
      <header className="home-head" style={{ zIndex: 10, pointerEvents: "none" }}>
        <Link to="/" className="brand pointer-events-auto" style={{ textDecoration: "none", color: "inherit" }}>
          <span className="brand-ring" />
          <h1>Circle</h1>
        </Link>
        <p className="greeting">Welcome to the collective.</p>
      </header>

      <div className="canvas">
        {circles.map((c, i) => {
          const hue = palette[c.colorIndex % palette.length];
          return (
            <button
              key={c.id}
              ref={(el) => (bubblesRef.current[i] = el)}
              className="bubble"
              onClick={() => openBubble(i, c)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: c.size,
                height: c.size,
                willChange: "transform",
                // Initial off-screen or center position before first frame
                transform: `translate(50vw, 50vh)`,
              }}
            >
              <span
                className="bubble-skin"
                style={{
                  background: `radial-gradient(circle at 34% 28%, ${hue.tint}, ${hue.base} 78%)`,
                  width: "100%",
                  height: "100%",
                }}
              >
                <span className="bubble-topic">{c.topic}</span>
                <span className="bubble-blurb">{c.blurb}</span>
                <span className="bubble-count">
                  <i className="dot" />
                  {c.userCount} here now
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="home-foot" style={{ zIndex: 10, pointerEvents: "none" }}>
        Tap a circle to step inside.
      </p>
    </div>
  );
}

export default BubbleCanvas;
