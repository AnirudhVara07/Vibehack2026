// data.jsx — Circle mock data, palettes, type pairings, scripted conversation.
// Exposes everything on window for the other babel scripts to consume.

// ── Type pairings (tweakable) ────────────────────────────────────────────────
const TYPE_PAIRINGS = {
  literary: {
    serif: "'Newsreader', Georgia, serif",
    body: "'Hanken Grotesk', system-ui, sans-serif",
  },
  modern: {
    serif: "'Spectral', Georgia, serif",
    body: "'Work Sans', system-ui, sans-serif",
  },
  classic: {
    serif: "'Libre Baskerville', Georgia, serif",
    body: "'Mulish', system-ui, sans-serif",
  },
};

// ── Pastel palettes (tweakable). 6 hues each; circle i → palette[i]. ─────────
// Each hue: { base, tint } — tint is the lighter stop for the gradient bubble.
const PALETTES = {
  garden: [
    { base: "#BFE3CD", tint: "#E7F4ED", name: "mint" },
    { base: "#F4CDB4", tint: "#FCE9DD", name: "peach" },
    { base: "#DAD0F0", tint: "#F0EBFA", name: "lavender" },
    { base: "#F2E2A8", tint: "#FBF4D6", name: "buttercup" },
    { base: "#BCDCE6", tint: "#E5F2F6", name: "sky" },
    { base: "#F1CBD3", tint: "#FBE6EB", name: "blush" },
  ],
  dawn: [
    { base: "#F5C9B8", tint: "#FCE7DE", name: "apricot" },
    { base: "#F2C0C2", tint: "#FBE0E1", name: "rose" },
    { base: "#F4D8AE", tint: "#FBEDD4", name: "sand" },
    { base: "#E9BFB0", tint: "#F8E2DA", name: "clay" },
    { base: "#F3CDA0", tint: "#FBE9CE", name: "honey" },
    { base: "#EAC4C9", tint: "#F8E3E6", name: "petal" },
  ],
  seaglass: [
    { base: "#B7DDD2", tint: "#E2F2EC", name: "seafoam" },
    { base: "#BCD3E6", tint: "#E3EDF5", name: "tide" },
    { base: "#C7DBC0", tint: "#E8F1E4", name: "sage" },
    { base: "#C6CFE8", tint: "#E6EAF6", name: "periwinkle" },
    { base: "#AFD8DB", tint: "#DEF0F1", name: "lagoon" },
    { base: "#CFE0C8", tint: "#ECF3E8", name: "moss" },
  ],
};

// ── Anonymous names (nature-poetic) ──────────────────────────────────────────
const SELF = "Wandering Pine";

// ── Circles (rooms). colorIndex maps into the active palette. ────────────────
const CIRCLES = [
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
const SCRIPT = [
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
const GUIDE_REPLIES = [
  "Thank you for adding that — it lands. Does anyone else recognise this?",
  "That's a generous thing to share. I'll sit with it for a second.",
  "Mm. There's something honest in that. What does it ask of you?",
];

Object.assign(window, {
  TYPE_PAIRINGS,
  PALETTES,
  SELF,
  CIRCLES,
  SCRIPT,
  GUIDE_REPLIES,
});
