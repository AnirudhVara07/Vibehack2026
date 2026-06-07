import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ChatLobby from "../components/ChatLobby";

export const Route = createFileRoute("/group")({
  component: GroupComponent,
});

interface UserSession {
  sessionId: string;
  mindset: string;
  university?: string;
  course?: string;
  yearOfStudy?: string;
  area?: string;
  livingSituation?: string;
  displayName: string;
  timeSlot: string;
  joinedAt: string;
}

function GroupComponent() {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    // Read session from localStorage
    try {
      const stored = localStorage.getItem("mindcircle_user_session");
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#1B2D4A] font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#FFFFFF]/80 backdrop-blur-md flex justify-between items-center border-b border-[#93D4F7]/20">
        <Link
          to="/"
          className="font-sans text-xl  tracking-tight text-[#2882B4] hover:opacity-85 transition-opacity"
        >
          MindCircle
        </Link>
        <div className="flex items-center gap-3">
          {session && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4FAFD] ring-1 ring-[#93D4F7]/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-[#2882B4]">
                {session.displayName}
              </span>
            </div>
          )}
          <Link
            to="/"
            className="text-xs font-medium px-4 py-1.5 rounded-full ring-1 ring-black/5 bg-transparent text-[#2882B4] hover:bg-black/5 transition-colors"
          >
            Leave Circle
          </Link>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <ChatLobby userSession={session} />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#4BACD5]/60">
        MindCircle · Secure & Anonymous Student Circles
      </footer>
    </div>
  );
}
