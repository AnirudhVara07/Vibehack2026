import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [showPortal, setShowPortal] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [introPhase, setIntroPhase] = useState(0); // 0: Portal, 1: Welcome, 2: Tagline, 3: Chat, 4: Auth
  const [chatStep, setChatStep] = useState(0); // 0 to 3 for messages
  const [authMode, setAuthMode] = useState<"select" | "signup" | "login">("select");
  const [showShockwave, setShowShockwave] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const skipToAuth = () => {
    setIntroPhase(4);
    setShowAuth(true);
    setAuthMode("select");
    setShowPortal(false);
    setShowShockwave(false);
  };

  const handlePortalClick = () => {
    if (introPhase > 0 || showShockwave) return;
    setShowPortal(false);
    setShowShockwave(true);

    setTimeout(() => setIntroPhase(1), 650); // Phase 1: welcome to circle
    setTimeout(() => setShowShockwave(false), 1050);

    setTimeout(() => setIntroPhase(2), 3200); // Phase 2: tagline

    setTimeout(() => {
      setIntroPhase(3); // Phase 3: chat
      setTimeout(() => setChatStep(1), 800);
      setTimeout(() => setChatStep(2), 2800);
      setTimeout(() => setChatStep(3), 4800);
    }, 5800);

    setTimeout(() => {
      skipToAuth();
    }, 12000);
  };

  const handleSignUp = () => {
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    // Save mock user to localStorage
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    users.push({ email, password });
    localStorage.setItem("mock_users", JSON.stringify(users));
    
    // Proceed to onboarding
    navigate({ to: "/join" });
  };

  const handleOAuth = (provider: string) => {
    // Mock OAuth success
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    users.push({ email: `mock_${provider}@example.com`, password: "oauth_mock_password" });
    localStorage.setItem("mock_users", JSON.stringify(users));
    navigate({ to: "/join" });
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const userExists = users.find((u: any) => u.email === email && u.password === password);

    if (userExists) {
      navigate({ to: "/select-group" });
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-[#FFFFFF] overflow-hidden font-sans"
      onClick={!showAuth ? handlePortalClick : undefined}
      style={{ cursor: !showAuth ? "pointer" : "default" }}
    >
      
      {/* ---------------------------------------------
          PORTAL BLOCK
          --------------------------------------------- */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute rounded-full" style={{ width: "840px", height: "840px", border: "1px solid rgba(147,212,247,0.025)" }} />
          <div className="absolute rounded-full" style={{ width: "630px", height: "630px", border: "1px solid rgba(147,212,247,0.04)" }} />
          <div className="absolute rounded-full" style={{ width: "440px", height: "440px", border: "1px solid rgba(147,212,247,0.07)" }} />
        </div>

        <div className="relative flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <motion.div
              initial={false}
              animate={{ opacity: showPortal ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="340" height="340" viewBox="0 0 340 340" className="relative" style={{ animation: "breathe 4s ease-in-out infinite" }}>
                <circle cx="170" cy="170" r="130" fill="none" stroke="rgba(147,212,247,0.06)" strokeWidth="48" />
                <circle cx="170" cy="170" r="130" fill="none" stroke="rgba(147,212,247,0.12)" strokeWidth="28" />
                <circle cx="170" cy="170" r="130" fill="none" stroke="rgba(147,212,247,0.22)" strokeWidth="13" />
                <circle cx="170" cy="170" r="110" fill="#FFFFFF" stroke="#93D4F7" strokeWidth="10" />
              </svg>
            </motion.div>

            {showShockwave && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  border: "2.5px solid rgba(147,212,247,0.68)",
                  width: "220px", height: "220px",
                  top: "50%", left: "50%",
                  marginLeft: "-110px", marginTop: "-110px",
                  pointerEvents: "none",
                }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 11, opacity: [1, 1, 0] }}
                transition={{
                  scale: { duration: 1.05, ease: [0.2, 0, 0.45, 1] },
                  opacity: { duration: 0.9, times: [0, 0.22, 1], ease: "linear" }
                }}
              />
            )}
          </div>
        </div>
      </div>


      {/* ---------------------------------------------
          CINEMATIC INTRO SEQUENCE
          --------------------------------------------- */}
      <AnimatePresence>
        {introPhase === 1 && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-[#FFFFFF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-medium text-[#4BACD5] tracking-tight">welcome to circle</h2>
          </motion.div>
        )}

        {introPhase === 2 && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-[#FFFFFF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium text-[#4BACD5] tracking-tight text-center px-6">
              when you need to talk,<br />but don't know who to tell.
            </h2>
          </motion.div>
        )}

        {introPhase === 3 && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-[#FFFFFF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="w-full max-w-lg px-6 flex flex-col gap-6">
              <AnimatePresence>
                {chatStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-start gap-1"
                  >
                    <span className="text-xs font-semibold text-[#4BACD5] px-1">FuzzyLion60</span>
                    <div className="px-4 py-3 bg-[#F0F9FF] border border-[#93D4F7]/30 text-[#1B2D4A] rounded-2xl rounded-tl-sm text-sm shadow-sm inline-block max-w-[85%]">
                      I havent slept properly in weeks because of deadlines
                    </div>
                  </motion.div>
                )}
                {chatStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-end gap-1"
                  >
                    <span className="text-xs font-semibold text-[#8B9BB4] px-1">GrizzlyBear32</span>
                    <div className="px-4 py-3 bg-[#F8FAFC] border border-gray-100 text-[#1B2D4A] rounded-2xl rounded-tr-sm text-sm shadow-sm inline-block max-w-[85%]">
                      same, i didnt wanna tell anyone
                    </div>
                  </motion.div>
                )}
                {chatStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mt-4 gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#93D4F7]/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2882B4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-[#2882B4] bg-[#93D4F7]/10 px-3 py-1 rounded-full">
                      thank you for sharing. who else can relate?
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button during intro */}
      {introPhase >= 1 && introPhase <= 3 && (
        <button
          onClick={skipToAuth}
          className="absolute bottom-10 right-8 z-30 pointer-events-auto text-xs font-medium text-[#4BACD5]/70 hover:text-[#2882B4] transition-colors px-4 py-2 rounded-full border border-[#93D4F7]/30 bg-white/80 backdrop-blur-sm"
        >
          Skip →
        </button>
      )}

      {/* ---------------------------------------------
          AUTH SCREEN BLOCK
          --------------------------------------------- */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-auto bg-[#FFFFFF] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={(e) => e.stopPropagation()} // Prevent portal click
            style={{ cursor: "default" }}
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

            <motion.div 
              className="flex flex-col items-center w-full max-w-sm px-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {authMode === "select" && (
                <div className="flex flex-col items-center w-full space-y-6">
                  <h2 className="text-3xl font-medium text-[#1B2D4A] mb-8 tracking-tight">Step into the Circle</h2>
                  <button
                    onClick={() => { setAuthMode("signup"); setError(""); setEmail(""); setPassword(""); }}
                    className="w-full py-4 bg-[#93D4F7]/20 border border-[#93D4F7]/40 text-[#2882B4] rounded-full font-medium text-base hover:bg-[#93D4F7]/30 hover:border-[#93D4F7]/60 active:scale-[0.98] transition-all text-center"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => { setAuthMode("login"); setError(""); setEmail(""); setPassword(""); }}
                    className="w-full py-4 bg-transparent border border-gray-200 text-gray-500 rounded-full font-medium text-base hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all text-center"
                  >
                    Login
                  </button>
                </div>
              )}

              {authMode === "signup" && (
                <div className="flex flex-col w-full space-y-4">
                  <h2 className="text-3xl font-medium text-[#1B2D4A] mb-4 tracking-tight text-center">Create Account</h2>
                  
                  {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}

                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#93D4F7] focus:ring-1 focus:ring-[#93D4F7] outline-none transition-all text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#93D4F7] focus:ring-1 focus:ring-[#93D4F7] outline-none transition-all text-sm"
                  />
                  
                  <div className="flex items-center my-2 gap-3">
                    <div className="flex-1 h-px bg-gray-100"></div>
                    <span className="text-xs font-medium text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-100"></div>
                  </div>

                  <button
                    onClick={() => handleOAuth("google")}
                    className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm flex items-center justify-center gap-3 hover:bg-gray-50 active:scale-[0.98] transition-all"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 opacity-70" />
                    Sign in with Google
                  </button>

                  <button
                    onClick={() => handleOAuth("apple")}
                    className="w-full py-3.5 bg-black border border-black text-white rounded-xl font-medium text-sm flex items-center justify-center gap-3 hover:bg-gray-900 active:scale-[0.98] transition-all"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.91 3.83-.81 1.5.09 2.75.76 3.5 1.83-3.15 1.87-2.61 5.92.51 7.15-.65 1.55-1.45 2.96-2.92 4.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.31-1.89 4.13-3.74 4.25z"/></svg>
                    Sign in with Apple
                  </button>

                  <div className="pt-6">
                    <button
                      onClick={handleSignUp}
                      className="w-full py-4 bg-[#93D4F7]/20 border border-[#93D4F7]/40 text-[#2882B4] rounded-full font-medium text-base hover:bg-[#93D4F7]/30 hover:border-[#93D4F7]/60 active:scale-[0.98] transition-all"
                    >
                      Next
                    </button>
                    <button onClick={() => setAuthMode("select")} className="w-full mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">Back</button>
                  </div>
                </div>
              )}

              {authMode === "login" && (
                <div className="flex flex-col w-full space-y-4">
                  <h2 className="text-3xl font-medium text-[#1B2D4A] mb-4 tracking-tight text-center">Welcome Back</h2>
                  
                  {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}

                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#93D4F7] focus:ring-1 focus:ring-[#93D4F7] outline-none transition-all text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#93D4F7] focus:ring-1 focus:ring-[#93D4F7] outline-none transition-all text-sm"
                  />

                  <div className="pt-6">
                    <button
                      onClick={handleLogin}
                      className="w-full py-4 bg-[#93D4F7]/20 border border-[#93D4F7]/40 text-[#2882B4] rounded-full font-medium text-base hover:bg-[#93D4F7]/30 hover:border-[#93D4F7]/60 active:scale-[0.98] transition-all"
                    >
                      Login
                    </button>
                    <button onClick={() => setAuthMode("select")} className="w-full mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">Back</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
