// data.jsx — Circle mock data, palettes, type pairings, scripted conversation.

// ── Type pairings (tweakable) ────────────────────────────────────────────────
export const TYPE_PAIRINGS = {
  literary: { serif: "'Outfit', sans-serif", body: "'Outfit', sans-serif" },
  modern: { serif: "'Outfit', sans-serif", body: "'Outfit', sans-serif" },
  classic: { serif: "'Outfit', sans-serif", body: "'Outfit', sans-serif" },
};

// ── Pastel palettes (tweakable). 6 hues each; circle i → palette[i]. ─────────
// Each hue: { base, tint } — tint is the lighter stop for the gradient bubble.
export const PALETTES = {
  garden: [
    { base: "#4B82DC", tint: "#8CAEEA", name: "ocean blue" },
    { base: "#5AB8E3", tint: "#9BD5EE", name: "light blue" },
    { base: "#50C396", tint: "#95DEC1", name: "emerald" },
    { base: "#AB8BF0", tint: "#C6B2F5", name: "amethyst" },
    { base: "#2D5A9E", tint: "#5C84C4", name: "navy" },
    { base: "#73D2C1", tint: "#AEE5DB", name: "teal" },
  ],
  dawn: [
    { base: "#3C6CB8", tint: "#7A9CD4", name: "blue" },
    { base: "#5B75E6", tint: "#94A7F0", name: "indigo" },
    { base: "#42A684", tint: "#83C9B0", name: "mint" },
    { base: "#9A75D6", tint: "#BFABEA", name: "purple" },
    { base: "#4DBECA", tint: "#93D8E0", name: "cyan" },
    { base: "#1A4073", tint: "#4A6E9E", name: "deep blue" },
  ],
  seaglass: [
    { base: "#4CA0D6", tint: "#8FC2E6", name: "cerulean" },
    { base: "#6A8CFF", tint: "#A6BCFF", name: "periwinkle" },
    { base: "#5DC992", tint: "#9EE0BE", name: "jade" },
    { base: "#B582E5", tint: "#D2B2F0", name: "lavender" },
    { base: "#2B68B0", tint: "#6896CC", name: "cobalt" },
    { base: "#59B9B3", tint: "#96D4D0", name: "aqua" },
  ],
};

// ── Anonymous names (nature-poetic) ──────────────────────────────────────────
export const SELF = "Wandering Pine";

// ── Circles (rooms). colorIndex maps into the active palette. ────────────────
export const CIRCLES = [
  {
    id: "big-life",
    topic: "Big Life Changes",
    blurb: "thresholds, leaps, in-between",
    userCount: 7,
    colorIndex: 2,
    size: 168,
  },
  {
    id: "morning",
    topic: "Morning Calm",
    blurb: "slow starts, first light",
    userCount: 12,
    colorIndex: 0,
    size: 150,
  },
  {
    id: "burnout",
    topic: "Navigating Burnout",
    blurb: "running on empty",
    userCount: 9,
    colorIndex: 3,
    size: 158,
  },
  {
    id: "lonely",
    topic: "Quietly Lonely",
    blurb: "full rooms, far away",
    userCount: 5,
    colorIndex: 4,
    size: 132,
  },
  {
    id: "joys",
    topic: "Small Joys",
    blurb: "the little good things",
    userCount: 14,
    colorIndex: 1,
    size: 144,
  },
  {
    id: "starting",
    topic: "Starting Over",
    blurb: "page one, again",
    userCount: 4,
    colorIndex: 5,
    size: 122,
  },
];

// ── Scripted conversation for "Big Life Changes" ─────────────────────────────
// kind: 'guide' | 'other' | 'self' | 'connection'
// A 'connection' is a Guide message that nests two quotes + a synthesizing line.
export const SCRIPT = [
  {
    id: "m1",
    kind: "guide",
    text: "Welcome in. No rush here — this is a space to think out loud. What's shifting for you right now?",
  },
  {
    id: "m2",
    kind: "other",
    sender: "Quiet Harbor",
    text: "I left a job I'd had for nine years last month. Everyone keeps congratulating me but mostly I just feel unmoored.",
  },
  {
    id: "m3",
    kind: "other",
    sender: "Still Meadow",
    text: "Congrats though, genuinely. Nine years is a long time to find the nerve to leave.",
  },
  {
    id: "m4",
    kind: "other",
    sender: "Open Field",
    text: "I moved across the country in March. New city, nobody knows me. Some days it's freedom, some days I can't breathe.",
  },
  {
    id: "m5",
    kind: "connection",
    label: "The Guide noticed something",
    quotes: [
      { sender: "Quiet Harbor", text: "I just feel unmoored." },
      {
        sender: "Open Field",
        text: "Nobody knows me… some days I can't breathe.",
      },
    ],
    text: "It sounds like both Quiet Harbor and Open Field are standing in that strange open space right after a big leap — untethered, not quite landed yet. For those of you a little further along: what helped the ground feel solid again?",
  },
  {
    id: "m6",
    kind: "self",
    sender: SELF,
    text: "Honestly? Small routines. I bought the same coffee every morning until the new place started to feel like mine.",
  },
  {
    id: "m7",
    kind: "other",
    sender: "Open Field",
    text: "That actually helps to hear. I keep waiting to feel settled before I build any routine. Maybe it's the other way around.",
  },
  {
    id: "m8",
    kind: "guide",
    text: "Beautifully put, Open Field. Maybe the routine is what builds the ground — not the reward for having found it.",
  },
];

// Canned gentle Guide replies for if the user types after the script ends.
export const GUIDE_REPLIES = [
  "Thank you for adding that — it lands. Does anyone else recognise this?",
  "That's a generous thing to share. I'll sit with it for a second.",
  "Mm. There's something honest in that. What does it ask of you?",
];
