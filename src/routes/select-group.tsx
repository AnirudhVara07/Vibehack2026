import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export const Route = createFileRoute("/select-group")({
  component: SelectGroup,
});

function seed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

const SIZES = [132, 155, 108, 32, 24, 28, 20];

function SelectGroup() {
  const navigate = useNavigate();
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);
  const physicsRef = useRef<any[]>([]);

  // Affirmation phrases
  const AFFIRMATIONS = [
    "You are not alone in this.",
    "It's okay to not be okay.",
    "Your feelings are valid.",
    "You deserve to be heard.",
    "Small steps still count.",
    "You are stronger than you think.",
    "Healing isn't linear.",
    "You matter more than you know.",
    "Rest is productive too.",
    "Be gentle with yourself today.",
  ];
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    const pick = () => setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
    pick();
    const interval = setInterval(pick, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mindcircle_user_session");
    localStorage.removeItem("mock_users");
    navigate({ to: "/" });
  };

  // AI Analysis state
  const [worryInput, setWorryInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [groupOptions, setGroupOptions] = useState<string[]>([
    "exam stress",
    "loneliness",
    "anxiety"
  ]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Remove old groupRefs, replace with a single index check logic
  const youBubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const items = [
      { id: groupOptions[0], size: SIZES[0], start: [20, 15] },
      { id: groupOptions[1], size: SIZES[1], start: [70, 20] },
      { id: groupOptions[2], size: SIZES[2], start: [45, 35] },
      { id: "dec1", size: SIZES[3], start: [15, 60] },
      { id: "dec2", size: SIZES[4], start: [40, 50] },
      { id: "dec3", size: SIZES[5], start: [80, 25] },
      { id: "dec4", size: SIZES[6], start: [30, 15] },
    ];

    physicsRef.current = items.map((c) => {
      const radius = c.size / 2;
      const x = (c.start[0] / 100) * rect.width;
      const y = (c.start[1] / 100) * rect.height;

      const s = seed(c.id);
      const angle = s * Math.PI * 2;
      const speedMultiplier = 0.5;
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
  }, [groupOptions]);

  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const phys = physicsRef.current;

      for (let i = 0; i < phys.length; i++) {
        const p = phys[i];
        p.x += p.vx;
        p.y += p.vy;

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

      for (let i = 0; i < phys.length; i++) {
        for (let j = i + 1; j < phys.length; j++) {
          const p1 = phys[i];
          const p2 = phys[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.hypot(dx, dy);
          const minDist = p1.radius + p2.radius;

          if (distance < minDist) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const v1 = { x: p1.vx * cos + p1.vy * sin, y: p1.vy * cos - p1.vx * sin };
            const v2 = { x: p2.vx * cos + p2.vy * sin, y: p2.vy * cos - p2.vx * sin };

            const m1 = p1.mass;
            const m2 = p2.mass;
            const vTotal = v1.x - v2.x;
            
            const v1x = ((m1 - m2) * v1.x + 2 * m2 * v2.x) / (m1 + m2);
            const v2x = vTotal + v1x;

            p1.vx = v1x * cos - v1.y * sin;
            p1.vy = v1.y * cos + v1x * sin;
            p2.vx = v2x * cos - v2.y * sin;
            p2.vy = v2.y * cos + v2x * sin;

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

  const handleAnalyzeWorries = async () => {
    if (!worryInput.trim()) return;
    setIsAnalyzing(true);

    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey) throw new Error("API key is missing");

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are an empathetic categorization assistant. The user will share their worries. Respond ONLY with a valid JSON array of exactly 3 short strings (1-3 words max each) representing support group categories they should join based on their worries. Do not include any markdown, backticks, or extra text."
            },
            {
              role: "user",
              content: worryInput
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) throw new Error("Failed to fetch from DeepSeek");
      
      const data = await response.json();
      let suggestions: string[] = [];
      try {
        const parsed = JSON.parse(data.choices[0].message.content);
        if (Array.isArray(parsed)) {
          suggestions = parsed;
        } else if (parsed.categories && Array.isArray(parsed.categories)) {
          suggestions = parsed.categories;
        } else {
          suggestions = Object.values(parsed);
        }
      } catch (e) {
        suggestions = data.choices[0].message.content.replace(/[\[\]"']/g, '').split(',').map((s: string) => s.trim());
      }
      
      const top3 = suggestions.slice(0, 3).map((s: string) => s.toLowerCase());
      if (top3.length === 3) {
        setGroupOptions(top3);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback
      setGroupOptions(["career stress", "future anxiety", "social burnout"]);
    } finally {
      setIsAnalyzing(false);
      setWorryInput(""); // Clear input
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalyzeWorries();
    }
  };

  const handleDragEnd = () => {
    if (!youBubbleRef.current) return;
    
    // Get the exact location of the bubble when released
    const youRect = youBubbleRef.current.getBoundingClientRect();
    const youCenter = {
      x: youRect.left + youRect.width / 2,
      y: youRect.top + youRect.height / 2,
    };

    let hitGroup = null;

    for (let i = 0; i < 3; i++) {
      const ref = bubblesRef.current[i];
      if (ref) {
        const targetRect = ref.getBoundingClientRect();
        const targetCenter = {
          x: targetRect.left + targetRect.width / 2,
          y: targetRect.top + targetRect.height / 2,
        };
        const dist = Math.hypot(
          youCenter.x - targetCenter.x,
          youCenter.y - targetCenter.y
        );

        if (dist < (SIZES[i] / 2) + 25) { // Radius of target + Radius of you bubble (25px)
          hitGroup = groupOptions[i];
          break;
        }
      }
    }

    if (hitGroup) {
      setJoinedGroup(hitGroup);
      setTimeout(() => {
        navigate({ to: "/group", search: { topic: hitGroup } as any });
      }, 600);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 40 });
      animate(y, 0, { type: "spring", stiffness: 400, damping: 40 });
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#FFFFFF] overflow-hidden font-sans">
      <motion.div
        className="absolute inset-0 z-20 pointer-events-auto bg-[#FFFFFF]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute top-6 left-6 z-[100] pointer-events-auto">
          <a
            href="/"
            className="font-medium cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0"
            style={{ color: "rgba(75,172,213,0.48)", fontSize: "13px", textDecoration: "none" }}
          >
            circle
          </a>
        </div>
        <div className="absolute top-6 right-6 z-[100] pointer-events-auto">
          <button
            onClick={handleLogout}
            className="text-xs font-medium px-4 py-1.5 rounded-full ring-1 ring-red-200 bg-transparent text-red-400 hover:bg-red-50 transition-colors"
          >
            Log out
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
          <span style={{ color: "rgba(75,172,213,0.40)", fontSize: "11px" }}>
            drag your bubble to a group to join
          </span>
        </div>

        {/* Affirmation phrases - bottom left */}
        <div className="absolute bottom-6 left-6 max-w-[220px] pointer-events-none z-[100]">
          <p
            className="text-xs italic text-[#4BACD5]/50"
            key={affirmation}
            style={{ animation: "fadeInOut 12s ease-in-out" }}
          >
            "{affirmation}"
          </p>
        </div>
        <style>{`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            85% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>

        <div className="relative w-full h-full max-w-5xl mx-auto overflow-hidden" ref={containerRef}>
          
          {/* Group 1 (Purple theme) */}
          <motion.div
            ref={(el) => { bubblesRef.current[0] = el; }}
            className="absolute rounded-full flex flex-col items-center justify-center transition-transform"
            animate={joinedGroup === groupOptions[0] ? { scale: [1, 1.15, 1], transition: { duration: 0.5 } } : { scale: 1 }}
            style={{
              width: SIZES[0], height: SIZES[0],
              top: 0, left: 0,
              border: "2px solid rgba(171,139,240,0.58)",
              backgroundColor: "rgba(171,139,240,0.08)",
              willChange: "transform",
            }}
          >
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-8px", border: "5px solid rgba(171,139,240,0.15)" }} />
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-18px", border: "6px solid rgba(171,139,240,0.06)" }} />
            <span style={{ fontSize: "11.5px", color: "rgba(70,40,120,0.7)", lineHeight: 1.5, textAlign: "center", padding: "0 10px" }}>{groupOptions[0]}</span>
            <span style={{ fontSize: "10px", color: "rgba(70,40,120,0.5)", lineHeight: 1.5 }}>12 inside</span>
          </motion.div>

          {/* Group 2 (Dark Blue theme) */}
          <motion.div
            ref={(el) => { bubblesRef.current[1] = el; }}
            className="absolute rounded-full flex flex-col items-center justify-center transition-transform"
            animate={joinedGroup === groupOptions[1] ? { scale: [1, 1.15, 1], transition: { duration: 0.5 } } : { scale: 1 }}
            style={{
              width: SIZES[1], height: SIZES[1],
              top: 0, left: 0,
              border: "2px solid rgba(75,130,220,0.62)",
              backgroundColor: "rgba(75,130,220,0.08)",
              willChange: "transform",
            }}
          >
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-8px", border: "5px solid rgba(75,130,220,0.15)" }} />
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-18px", border: "6px solid rgba(75,130,220,0.06)" }} />
            <span style={{ fontSize: "11.5px", color: "rgba(25,50,110,0.7)", lineHeight: 1.5, textAlign: "center", padding: "0 10px" }}>{groupOptions[1]}</span>
            <span style={{ fontSize: "10px", color: "rgba(25,50,110,0.5)", lineHeight: 1.5 }}>8 inside</span>
          </motion.div>

          {/* Group 3 (Green theme) */}
          <motion.div
            ref={(el) => { bubblesRef.current[2] = el; }}
            className="absolute rounded-full flex flex-col items-center justify-center transition-transform"
            animate={joinedGroup === groupOptions[2] ? { scale: [1, 1.15, 1], transition: { duration: 0.5 } } : { scale: 1 }}
            style={{
              width: SIZES[2], height: SIZES[2],
              top: 0, left: 0,
              border: "2px solid rgba(80,195,150,0.55)",
              backgroundColor: "rgba(80,195,150,0.08)",
              willChange: "transform",
            }}
          >
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-7px", border: "4px solid rgba(80,195,150,0.15)" }} />
            <span style={{ fontSize: "11.5px", color: "rgba(30,90,60,0.7)", lineHeight: 1.5, textAlign: "center", padding: "0 10px" }}>{groupOptions[2]}</span>
            <span style={{ fontSize: "10px", color: "rgba(30,90,60,0.5)", lineHeight: 1.5 }}>5 inside</span>
          </motion.div>

          {/* Small individual bubbles (Mixed themes) */}
          <div
            ref={(el) => { bubblesRef.current[3] = el; }}
            className="absolute rounded-full"
            style={{ width: SIZES[3], height: SIZES[3], top: 0, left: 0, border: "1px solid rgba(171,139,240,0.7)", backgroundColor: "rgba(171,139,240,0.1)", willChange: "transform" }}
          />
          <div
            ref={(el) => { bubblesRef.current[4] = el; }}
            className="absolute rounded-full"
            style={{ width: SIZES[4], height: SIZES[4], top: 0, left: 0, border: "1px solid rgba(80,195,150,0.7)", backgroundColor: "rgba(80,195,150,0.1)", willChange: "transform" }}
          />
          <div
            ref={(el) => { bubblesRef.current[5] = el; }}
            className="absolute rounded-full"
            style={{ width: SIZES[5], height: SIZES[5], top: 0, left: 0, border: "1px solid rgba(75,130,220,0.6)", backgroundColor: "rgba(75,130,220,0.1)", willChange: "transform" }}
          />
          <div
            ref={(el) => { bubblesRef.current[6] = el; }}
            className="absolute rounded-full"
            style={{ width: SIZES[6], height: SIZES[6], top: 0, left: 0, border: "1px solid rgba(147,212,247,0.6)", backgroundColor: "rgba(147,212,247,0.1)", willChange: "transform" }}
          />

          {/* Your bubble (Light Blue theme, no text) */}
          <motion.div
            ref={youBubbleRef}
            className="absolute rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            drag
            onDragEnd={handleDragEnd}
            animate={joinedGroup ? { opacity: 0, scale: 0, transition: { duration: 0.3 } } : { opacity: 1, scale: 1 }}
            style={{
              x, y,
              width: "50px", height: "50px",
              left: "calc(50% - 25px)", bottom: "80px",
              border: "2px solid rgba(90,184,227,0.80)",
              backgroundColor: "rgba(90,184,227,0.25)",
            }}
            whileTap={joinedGroup ? {} : { scale: 0.95 }}
            whileDrag={joinedGroup ? {} : { scale: 1.1, backgroundColor: "rgba(90,184,227,0.4)" }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
            >
              <div
                className="absolute rounded-full pointer-events-none"
                style={{ inset: "-6px", border: "3.5px solid rgba(90,184,227,0.2)" }}
              />
            </div>
          </motion.div>
          
          {/* AI Worry Input Box */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-[320px] px-4 pointer-events-auto z-50">
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-2.5 bg-[#FFFFFF]/80 border border-[#93D4F7]/40 rounded-xl backdrop-blur-md shadow-sm">
                <span className="text-xs font-medium text-[#2882B4] animate-pulse">Analyzing your thoughts...</span>
              </div>
            ) : (
              <input
                type="text"
                value={worryInput}
                onChange={(e) => setWorryInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e as any)}
                placeholder="What worries you?"
                className="w-full px-4 py-2.5 rounded-xl border border-[#93D4F7]/40 bg-[#FFFFFF]/80 text-xs text-[#1B2D4A] focus:outline-none focus:ring-2 focus:ring-[#93D4F7]/60 focus:border-[#93D4F7]/60 transition-all shadow-sm backdrop-blur-md placeholder-gray-400 text-center"
              />
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
