// App.jsx — container: state, the bubble→fullscreen expand transition, Tweaks.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  typeface: "literary",
  palette: "garden",
  layout: "scatter",
  connection: "side",
  intensity: "gentle",
}; /*EDITMODE-END*/

function coverScale(rect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const corners = [
    [0, 0],
    [window.innerWidth, 0],
    [0, window.innerHeight],
    [window.innerWidth, window.innerHeight],
  ];
  let R = 0;
  for (const [x, y] of corners) R = Math.max(R, Math.hypot(x - cx, y - cy));
  return (R * 1.15) / (rect.width / 2);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = window.PALETTES[t.palette] || window.PALETTES.garden;
  const type =
    window.TYPE_PAIRINGS[t.typeface] || window.TYPE_PAIRINGS.literary;

  const [mode, setMode] = React.useState("home"); // home | expanding | chat | collapsing
  const [active, setActive] = React.useState(null); // { circle, hue }
  const [rect, setRect] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const [grown, setGrown] = React.useState(false);
  const [overlayOn, setOverlayOn] = React.useState(false);
  const [chatLeaving, setChatLeaving] = React.useState(false);
  const timers = React.useRef([]);
  const after = (ms, fn) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const openCircle = (circle, r) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const hue = palette[circle.colorIndex % palette.length];
    setActive({ circle, hue });
    setRect(r);
    setScale(coverScale(r));
    setGrown(false);
    setOverlayOn(true);
    setMode("expanding");
    requestAnimationFrame(() => requestAnimationFrame(() => setGrown(true)));
    after(470, () => setMode("chat"));
    after(770, () => setOverlayOn(false));
  };

  const back = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setOverlayOn(true);
    setGrown(true);
    setChatLeaving(true);
    setMode("collapsing");
    requestAnimationFrame(() => requestAnimationFrame(() => setGrown(false)));
    after(480, () => {
      setMode("home");
      setOverlayOn(false);
      setChatLeaving(false);
      setActive(null);
    });
  };

  const hue = active?.hue;
  const showCanvas =
    mode === "home" || mode === "expanding" || mode === "collapsing";
  const showChat = mode === "chat" || mode === "collapsing";

  return (
    <div className="app" style={{ "--serif": type.serif, "--body": type.body }}>
      {showCanvas && (
        <div
          className={
            "layer canvas-layer" + (mode === "expanding" ? " dimmed" : "")
          }
        >
          <BubbleCanvas
            circles={window.CIRCLES}
            palette={palette}
            layout={t.layout}
            intensity={t.intensity}
            onOpen={openCircle}
          />
        </div>
      )}

      {showChat && active && (
        <div
          className={
            "layer chat-layer" +
            (mode === "chat" ? " enter" : "") +
            (chatLeaving ? " leaving" : "")
          }
        >
          <CircleChat
            circle={active.circle}
            hue={hue}
            connectionLayout={t.connection}
            intensity={t.intensity}
            onBack={back}
          />
        </div>
      )}

      {overlayOn && rect && hue && (
        <div
          className="expander"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            background: `radial-gradient(circle at 34% 28%, ${hue.tint}, ${hue.base} 78%)`,
            transform: `scale(${grown ? scale : 1})`,
            opacity: mode === "chat" ? 0 : 1,
          }}
        />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Atmosphere" />
        <PaletteTweak
          value={t.palette}
          onChange={(v) => setTweak("palette", v)}
        />
        <TweakRadio
          label="Canvas"
          value={t.layout}
          options={[
            { value: "scatter", label: "Scatter" },
            { value: "constellation", label: "Cluster" },
            { value: "columns", label: "Columns" },
          ]}
          onChange={(v) => setTweak("layout", v)}
        />
        <TweakRadio
          label="Motion"
          value={t.intensity}
          options={[
            { value: "still", label: "Still" },
            { value: "gentle", label: "Gentle" },
            { value: "lively", label: "Lively" },
          ]}
          onChange={(v) => setTweak("intensity", v)}
        />

        <TweakSection label="Voice & type" />
        <TweakRadio
          label="Typeface"
          value={t.typeface}
          options={[
            { value: "literary", label: "Literary" },
            { value: "modern", label: "Modern" },
            { value: "classic", label: "Classic" },
          ]}
          onChange={(v) => setTweak("typeface", v)}
        />
        <TweakRadio
          label="Connection"
          value={t.connection}
          options={[
            { value: "side", label: "Side by side" },
            { value: "stacked", label: "Stacked" },
          ]}
          onChange={(v) => setTweak("connection", v)}
        />
      </TweaksPanel>
    </div>
  );
}

// Palette tweak rendered as swatch rows, mapped back to a palette key.
function PaletteTweak({ value, onChange }) {
  const keys = ["garden", "dawn", "seaglass"];
  const opts = keys.map((k) => window.PALETTES[k].map((h) => h.base));
  const cur = window.PALETTES[value].map((h) => h.base);
  const onPick = (arr) => {
    const k = keys.find(
      (key) =>
        window.PALETTES[key][0].base.toLowerCase() === arr[0].toLowerCase(),
    );
    if (k) onChange(k);
  };
  return (
    <TweakColor label="Palette" value={cur} options={opts} onChange={onPick} />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
