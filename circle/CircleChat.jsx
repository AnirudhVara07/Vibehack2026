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
function CircleChat({ circle, hue, connectionLayout, intensity, onBack }) {
  const script = window.SCRIPT;
  const [revealed, setRevealed] = React.useState(0);
  const [typing, setTyping] = React.useState(null); // {side} | null
  const [extra, setExtra] = React.useState([]);
  const [done, setDone] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const feedRef = React.useRef(null);
  const timers = React.useRef([]);
  const replyIdx = React.useRef(0);

  const speed = SPEED[intensity] ?? 1;
  const sideOf = (m) => (m.kind === "self" ? "right" : "left");

  // auto-scroll feed to bottom on any change
  React.useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [revealed, typing, extra]);

  // scripted playout — runs once
  React.useEffect(() => {
    let i = 0;
    const push = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    const step = () => {
      if (i >= script.length) {
        setTyping(null);
        setDone(true);
        return;
      }
      const m = script[i];
      setTyping({ side: sideOf(m) });
      const think = Math.min(400 + m.text?.length * 9, 1500) * speed + 350;
      push(() => {
        setTyping(null);
        setRevealed(i + 1);
        i += 1;
        push(step, 520 * speed);
      }, think);
    };
    push(step, 650);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setExtra((p) => [
      ...p,
      { id: "u" + Date.now(), kind: "self", sender: window.SELF, text },
    ]);
    setTyping({ side: "left" });
    const reply =
      window.GUIDE_REPLIES[replyIdx.current % window.GUIDE_REPLIES.length];
    replyIdx.current += 1;
    const id = setTimeout(() => {
      setTyping(null);
      setExtra((p) => [
        ...p,
        { id: "g" + Date.now(), kind: "guide", text: reply },
      ]);
    }, 1500);
    timers.current.push(id);
  };

  const shown = script.slice(0, revealed);

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
          You joined as <b>{window.SELF}</b>. You're anonymous here.
        </p>
        {shown.map((m) => (
          <Message key={m.id} msg={m} hue={hue} layout={connectionLayout} />
        ))}
        {extra.map((m) => (
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
            placeholder={done ? "Share something…" : "The Guide is speaking…"}
            disabled={!done}
          />
          <button
            className="send"
            onClick={send}
            disabled={!done || !draft.trim()}
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

Object.assign(window, { CircleChat });
