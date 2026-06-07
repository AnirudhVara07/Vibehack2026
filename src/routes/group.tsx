import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import CircleChat from "../components/CircleChat";

export const Route = createFileRoute("/group")({
  component: GroupComponent,
});

const PALETTES = {
  garden: [
    { base: "#E04F72", tint: "#FFF4F6" },
    { base: "#F28C38", tint: "#FFF9F2" },
    { base: "#D1B221", tint: "#FDFDF5" },
    { base: "#37A177", tint: "#F2FBF6" },
    { base: "#2D8C9C", tint: "#F0F9FB" },
    { base: "#7265B8", tint: "#F8F6FF" },
  ]
};

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

// Deterministic seed for pseudo-random colors and counts
function seedTopic(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

interface UserSession {
  sessionId: string;
  displayName: string;
  timeSlot: string;
  joinedAt: string;
}

function GroupComponent() {
  const navigate = useNavigate();
  // Bypass strict type checking for search params to easily pass ?topic=...
  const search: any = Route.useSearch();
  const topic = search?.topic || "general";
  
  const [session, setSession] = useState<UserSession | null>(null);
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mindcircle_user_session");
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
  }, []);

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

  const handleBack = () => {
    navigate({ to: "/select-group" });
  };

  // Construct circle object dynamically
  const s = seedTopic(topic);
  const circle = {
    id: topic,
    topic: topic,
    userCount: 5 + (s % 15),
  };
  
  const hue = PALETTES.garden[s % PALETTES.garden.length];

  return (
    <div className="w-full h-screen bg-[#FFFFFF] flex flex-col font-sans overflow-hidden">
      {/* Header bar (Logo + Buttons) */}
      <header className="flex-none p-6 flex justify-between items-center z-20">
        <a
          href="/"
          className="font-medium cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0"
          style={{ color: "rgba(75,172,213,0.48)", fontSize: "13px", textDecoration: "none" }}
        >
          circle
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="text-xs font-medium px-4 py-1.5 rounded-full ring-1 ring-[#2882B4]/30 bg-transparent text-[#2882B4] hover:bg-[#2882B4]/5 transition-colors"
          >
            Leave circle
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-medium px-4 py-1.5 rounded-full ring-1 ring-red-200 bg-transparent text-red-400 hover:bg-red-50 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main content (Chat window) */}
      <main className="flex-1 min-h-0 w-full flex items-center justify-center px-4 sm:px-12">
        <div className="w-full max-w-2xl h-full max-h-[700px] rounded-[24px] overflow-hidden shadow-2xl ring-1 ring-black/5 flex flex-col relative z-10">
          <CircleChat
            circle={circle}
            hue={hue}
            connectionLayout="stacked"
            intensity="gentle"
            userSession={session}
            onBack={handleBack}
          />
        </div>
      </main>

      {/* Footer (Affirmations) */}
      <footer className="flex-none p-6 pt-4 z-20">
        <div className="max-w-[220px]">
          <p
            className="text-xs italic text-[#4BACD5]/50"
            key={affirmation}
            style={{ animation: "fadeInOut 12s ease-in-out" }}
          >
            "{affirmation}"
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
