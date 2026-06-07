import React from "react";
import { SCRIPT, GUIDE_REPLIES, SELF } from "../data/mockData.js";
import { chatWithGuide } from "../ai";
// CircleChat.jsx — inside a circle. Dynamic theming inherited from the bubble,
// scripted playout, and the AI Guide's "Connection" message.
// Props: circle, hue, connectionLayout ('side'|'stacked'), intensity, onBack

const SPEED = { still: 1.28, gentle: 1, lively: 0.72 };

function mix(base, pct, other = "#FFFFFF") {
  return `color-mix(in srgb, ${base} ${pct}%, ${other})`;
}

// ── small pieces ─────────────────────────────────────────────────────────────
function GuideTag({ hue }) {
  return (
    <span className="guide-tag">
      <span className="guide-ring" style={{ borderColor: mix(hue.base, 70) }} />
      Guide
    </span>
  );
}

function Typing({ side, hue }) {
  return (
    <div className={"row " + side}>
      <div
        className="typing"
        style={{ background: side === "right" ? mix(hue.base, 40) : "#FFFFFF" }}
      >
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function GuideMessage({ msg, hue }) {
  return (
    <div
      className="guide-card"
      style={{ background: mix(hue.base, 12), borderColor: mix(hue.base, 32) }}
    >
      <GuideTag hue={hue} />
      <p className="guide-text">{msg.text}</p>
    </div>
  );
}

function ConnectionMessage({ msg, hue, layout }) {
  return (
    <div
      className="guide-card connection"
      style={{ background: mix(hue.base, 14), borderColor: mix(hue.base, 36) }}
    >
      <GuideTag hue={hue} />
      <p className="connection-label">{msg.label}</p>
      <div className={"quotes " + (layout === "stacked" ? "stacked" : "side")}>
        {msg.quotes.map((q, i) => (
          <figure
            key={i}
            className="quote"
            style={{
              background: mix(hue.base, 22),
              borderColor: mix(hue.base, 50),
            }}
          >
            <blockquote>{q.text}</blockquote>
            <figcaption>{q.sender}</figcaption>
          </figure>
        ))}
      </div>
      <p className="guide-text synth">{msg.text}</p>
    </div>
  );
}

function PeerMessage({ msg }) {
  return (
    <div className="row left">
      <div className="peer">
        <span className="who">{msg.sender}</span>
        <div className="bubble-msg other">{msg.text}</div>
      </div>
    </div>
  );
}

function SelfMessage({ msg, hue }) {
  return (
    <div className="row right">
      <div className="self">
        <div
          className="bubble-msg me"
          style={{ background: mix(hue.base, 46) }}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}

function Message({ msg, hue, layout }) {
  if (msg.kind === "guide") return <GuideMessage msg={msg} hue={hue} />;
  if (msg.kind === "connection")
    return <ConnectionMessage msg={msg} hue={hue} layout={layout} />;
  if (msg.kind === "self") return <SelfMessage msg={msg} hue={hue} />;
  return <PeerMessage msg={msg} />;
}

// ── chat ─────────────────────────────────────────────────────────────────────
function CircleChat({
  circle,
  hue,
  connectionLayout,
  intensity,
  userSession,
  onBack,
}) {
  const displayName = userSession?.displayName || SELF;
  const [messages, setMessages] = React.useState([]);
  const [typing, setTyping] = React.useState(null);
  const [draft, setDraft] = React.useState("");
  const wsRef = React.useRef(null);
  const feedRef = React.useRef(null);

  // Initialize WebSocket
  React.useEffect(() => {
    // Auto-detect: local dev → ws://localhost:3001, tunnel → env var
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('10.') || host.startsWith('192.168.');
    const wsUrl = isLocal
      ? 'ws://localhost:3001'
      : (import.meta.env.VITE_WS_TUNNEL_URL || `wss://${host}:3001`);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.topic === circle.topic) {
          setMessages((p) => [...p, payload.msg]);
        }
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };

    return () => ws.close();
  }, [circle.topic]);

  // auto-scroll feed to bottom on any change
  React.useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  // Initial welcome message from the guide
  React.useEffect(() => {
    setMessages([
      { id: "g0", kind: "guide", text: "Welcome to the circle. I am your guide. Take a deep breath, and whenever you're ready, say hello." }
    ]);
  }, []);

  const broadcast = (msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ topic: circle.topic, msg }));
    }
  };

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    
    const userMsg = { id: "u" + Date.now(), kind: "self", sender: displayName, text };
    const peerMsg = { ...userMsg, kind: "peer" }; // How others will see it
    
    setMessages((p) => [...p, userMsg]);
    broadcast(peerMsg);
    setTyping({ side: "left" });

    // Send to DeepSeek via Client Fetch
    try {
      const res = await chatWithGuide({
        data: {
          messages: [...messages, userMsg],
          circleTopic: circle.topic,
          userName: displayName
        }
      });
      
      setTyping(null);
      if (res.text) {
        const guideMsg = { id: "g" + Date.now(), kind: "guide", text: res.text };
        setMessages((p) => [...p, guideMsg]);
        broadcast(guideMsg);
      } else if (res.error) {
        setMessages((p) => [...p, { id: "e" + Date.now(), kind: "guide", text: res.error }]);
      }
    } catch (e) {
      setTyping(null);
      setMessages((p) => [...p, { id: "e" + Date.now(), kind: "guide", text: "Connection interrupted. Please try again." }]);
    }
  };

  return (
    <div
      className="chat"
      style={{
        background: `linear-gradient(180deg, #FAF8F4 0%, ${mix(hue.base, 8)} 55%, ${mix(hue.base, 18)} 100%)`,
      }}
    >
      <nav
        className="chat-nav"
        style={{
          background: mix(hue.base, 10, "#FBFAF7"),
          borderColor: mix(hue.base, 26),
        }}
      >
        <button className="back" onClick={onBack} aria-label="Back to circles">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="chat-title">
          <span className="t-topic">{circle.topic}</span>
          <span className="t-count">
            <i className="dot" style={{ background: mix(hue.base, 80) }} />
            {circle.userCount} here
          </span>
        </div>
        <span className="nav-dot" style={{ background: mix(hue.base, 60) }} />
      </nav>

      <div className="feed" ref={feedRef}>
        <p className="feed-intro">
          You joined as <b>{displayName}</b>. You're anonymous here.
        </p>
        {messages.map((m) => (
          <Message key={m.id} msg={m} hue={hue} layout={connectionLayout} />
        ))}
        {typing && <Typing side={typing.side} hue={hue} />}
        <div className="feed-pad" />
      </div>

      <footer className="composer">
        <div className="pill" style={{ borderColor: mix(hue.base, 34) }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Message the circle..."
            disabled={!!typing}
          />
          <button
            className="send"
            onClick={send}
            disabled={!!typing || !draft.trim()}
            style={{ background: mix(hue.base, 64), color: "#2D2A24" }}
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M5 12h13M12 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default CircleChat;
