// BubbleCanvas.jsx — home screen: floating, non-colliding pastel bubbles.
// Props: circles, palette, layout, intensity, onOpen(circle, rect)

// Hand-authored compositions (center % within the canvas region) per layout.
const LAYOUTS = {
  scatter: {
    "big-life": [30, 23],
    morning: [71, 16],
    burnout: [26, 55],
    lonely: [73, 47],
    joys: [45, 81],
    starting: [76, 79],
  },
  constellation: {
    "big-life": [33, 15],
    morning: [68, 31],
    burnout: [29, 49],
    lonely: [65, 63],
    joys: [37, 80],
    starting: [72, 87],
  },
  columns: {
    "big-life": [31, 16],
    morning: [69, 25],
    burnout: [31, 47],
    lonely: [69, 55],
    joys: [31, 77],
    starting: [69, 85],
  },
};

// Amplitude (px) of ambient drift per intensity setting.
const AMP = { still: 5, gentle: 13, lively: 24 };

// Tiny deterministic hash so each bubble drifts on its own rhythm (unsynced).
function seed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function Bubble({ circle, hue, pos, amp, onOpen }) {
  const ref = React.useRef(null);
  const s = seed(circle.id);
  const s2 = seed(circle.id + "x");
  const angle = s * Math.PI * 2;
  const dx = Math.cos(angle) * amp;
  const dy = Math.sin(angle) * amp;
  const dur = 9 + s2 * 7; // 9–16s
  const delay = -(s * dur); // negative → desynchronised start phase

  const open = () => {
    const r = ref.current.getBoundingClientRect();
    onOpen(circle, r);
  };

  return (
    <button
      ref={ref}
      className="bubble"
      onClick={open}
      style={{
        left: pos[0] + "%",
        top: pos[1] + "%",
        width: circle.size,
        height: circle.size,
        "--dx": dx + "px",
        "--dy": dy + "px",
        "--dur": dur.toFixed(2) + "s",
        "--delay": delay.toFixed(2) + "s",
      }}
    >
      <span
        className="bubble-skin"
        style={{
          background: `radial-gradient(circle at 34% 28%, ${hue.tint}, ${hue.base} 78%)`,
        }}
      >
        <span className="bubble-topic">{circle.topic}</span>
        <span className="bubble-blurb">{circle.blurb}</span>
        <span className="bubble-count">
          <i className="dot" />
          {circle.userCount} here now
        </span>
      </span>
    </button>
  );
}

function BubbleCanvas({ circles, palette, layout, intensity, onOpen }) {
  const positions = LAYOUTS[layout] || LAYOUTS.scatter;
  const amp = AMP[intensity] ?? AMP.gentle;

  return (
    <div className="home">
      <header className="home-head">
        <div className="brand">
          <span className="brand-ring" />
          <h1>Circle</h1>
        </div>
        <p className="greeting">Welcome to the collective.</p>
      </header>

      <div className="canvas">
        {circles.map((c) => (
          <Bubble
            key={c.id}
            circle={c}
            hue={palette[c.colorIndex % palette.length]}
            pos={positions[c.id] || [50, 50]}
            amp={amp}
            onOpen={onOpen}
          />
        ))}
      </div>

      <p className="home-foot">Tap a circle to step inside.</p>
    </div>
  );
}

Object.assign(window, { BubbleCanvas });
