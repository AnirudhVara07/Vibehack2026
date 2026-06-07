import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export const Route = createFileRoute("/select-group")({
  component: SelectGroup,
});

function SelectGroup() {
  const navigate = useNavigate();
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null);

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

  // Refs for drop targets
  const groupRefs = {
    [groupOptions[0]]: useRef<HTMLDivElement>(null),
    [groupOptions[1]]: useRef<HTMLDivElement>(null),
    [groupOptions[2]]: useRef<HTMLDivElement>(null),
  };
  const youBubbleRef = useRef<HTMLDivElement>(null);

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

    for (const [groupName, ref] of Object.entries(groupRefs)) {
      if (ref.current) {
        const targetRect = ref.current.getBoundingClientRect();
        const targetCenter = {
          x: targetRect.left + targetRect.width / 2,
          y: targetRect.top + targetRect.height / 2,
        };
        // Calculate distance between bubble center and target center
        const dist = Math.hypot(
          youCenter.x - targetCenter.x,
          youCenter.y - targetCenter.y
        );

        // Generous collision distance (150px)
        if (dist < 150) {
          hitGroup = groupName;
          break;
        }
      }
    }

    if (hitGroup) {
      setJoinedGroup(hitGroup);
      setTimeout(() => {
        navigate({ to: "/group" });
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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
          <span style={{ color: "rgba(75,172,213,0.40)", fontSize: "11px" }}>
            drag your bubble to a group to join
          </span>
        </div>

        <div className="relative w-full h-full max-w-5xl mx-auto overflow-hidden">
          
          {/* Group 1 (Purple theme) */}
          <motion.div
            ref={groupRefs[groupOptions[0]]}
            className="absolute rounded-full flex flex-col items-center justify-center transition-transform"
            animate={joinedGroup === groupOptions[0] ? { scale: [1, 1.15, 1], transition: { duration: 0.5 } } : { scale: 1 }}
            style={{
              width: "132px", height: "132px",
              left: "20%", top: "15%",
              border: "2px solid rgba(171,139,240,0.58)",
              backgroundColor: "rgba(171,139,240,0.08)",
              animation: "float 8s ease-in-out infinite",
            }}
          >
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-8px", border: "5px solid rgba(171,139,240,0.15)" }} />
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-18px", border: "6px solid rgba(171,139,240,0.06)" }} />
            <span style={{ fontSize: "11.5px", color: "rgba(70,40,120,0.7)", lineHeight: 1.5, textAlign: "center", padding: "0 10px" }}>{groupOptions[0]}</span>
            <span style={{ fontSize: "10px", color: "rgba(70,40,120,0.5)", lineHeight: 1.5 }}>12 inside</span>
          </motion.div>

          {/* Group 2 (Dark Blue theme) */}
          <motion.div
            ref={groupRefs[groupOptions[1]]}
            className="absolute rounded-full flex flex-col items-center justify-center transition-transform"
            animate={joinedGroup === groupOptions[1] ? { scale: [1, 1.15, 1], transition: { duration: 0.5 } } : { scale: 1 }}
            style={{
              width: "155px", height: "155px",
              left: "70%", top: "20%",
              border: "2px solid rgba(75,130,220,0.62)",
              backgroundColor: "rgba(75,130,220,0.08)",
              animation: "float 9.5s ease-in-out infinite 1.2s",
            }}
          >
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-8px", border: "5px solid rgba(75,130,220,0.15)" }} />
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-18px", border: "6px solid rgba(75,130,220,0.06)" }} />
            <span style={{ fontSize: "11.5px", color: "rgba(25,50,110,0.7)", lineHeight: 1.5, textAlign: "center", padding: "0 10px" }}>{groupOptions[1]}</span>
            <span style={{ fontSize: "10px", color: "rgba(25,50,110,0.5)", lineHeight: 1.5 }}>8 inside</span>
          </motion.div>

          {/* Group 3 (Green theme) */}
          <motion.div
            ref={groupRefs[groupOptions[2]]}
            className="absolute rounded-full flex flex-col items-center justify-center transition-transform"
            animate={joinedGroup === groupOptions[2] ? { scale: [1, 1.15, 1], transition: { duration: 0.5 } } : { scale: 1 }}
            style={{
              width: "108px", height: "108px",
              left: "45%", top: "35%",
              border: "2px solid rgba(80,195,150,0.55)",
              backgroundColor: "rgba(80,195,150,0.08)",
              animation: "float 7.5s ease-in-out infinite 0.7s",
            }}
          >
            <div className="absolute rounded-full pointer-events-none" style={{ inset: "-7px", border: "4px solid rgba(80,195,150,0.15)" }} />
            <span style={{ fontSize: "11.5px", color: "rgba(30,90,60,0.7)", lineHeight: 1.5, textAlign: "center", padding: "0 10px" }}>{groupOptions[2]}</span>
            <span style={{ fontSize: "10px", color: "rgba(30,90,60,0.5)", lineHeight: 1.5 }}>5 inside</span>
          </motion.div>

          {/* Small individual bubbles (Mixed themes) */}
          <div
            className="absolute rounded-full"
            style={{ width: "32px", height: "32px", left: "120px", top: "350px", border: "1px solid rgba(171,139,240,0.7)", backgroundColor: "rgba(171,139,240,0.1)", animation: "float-alt 6.2s ease-in-out infinite 0.1s" }}
          />
          <div
            className="absolute rounded-full"
            style={{ width: "24px", height: "24px", left: "400px", top: "280px", border: "1px solid rgba(80,195,150,0.7)", backgroundColor: "rgba(80,195,150,0.1)", animation: "float 5.8s ease-in-out infinite 2.1s" }}
          />
          <div
            className="absolute rounded-full"
            style={{ width: "28px", height: "28px", left: "620px", top: "150px", border: "1px solid rgba(75,130,220,0.6)", backgroundColor: "rgba(75,130,220,0.1)", animation: "float-alt 7.1s ease-in-out infinite 1.4s" }}
          />
          <div
            className="absolute rounded-full"
            style={{ width: "20px", height: "20px", left: "220px", top: "80px", border: "1px solid rgba(147,212,247,0.6)", backgroundColor: "rgba(147,212,247,0.1)", animation: "float 6.5s ease-in-out infinite 0.8s" }}
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
