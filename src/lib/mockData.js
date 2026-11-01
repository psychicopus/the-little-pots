/**
 * Seed initial stranger pots to give a welcoming postal experience
 * right away when starting offline or before database population.
 */
export const INITIAL_COMMUNITY_POTS = [
  {
    id: "pot-seed-001",
    senderId: "user_hazel",
    senderName: "GentleSparrow",
    recipientId: "current_user",
    title: "Quiet evening on the porch",
    content: "I made hot cinnamon tea tonight. The street lamps just flickered on outside my window. Sometimes the world feels overwhelmingly fast, but right now the steam rising from this cup is the only thing that matters. If you are having a heavy day, please remember to breathe. You're doing better than you give yourself credit for.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    stamp: "🌿 Cedar Leaf",
    replies: [
      {
        id: "rep-001-1",
        authorId: "current_user",
        authorName: "You",
        content: "Thank you for this. Needed that cinnamon tea reminder today.",
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      }
    ]
  },
  {
    id: "pot-seed-002",
    senderId: "user_marcus",
    senderName: "OldShoemaker",
    recipientId: "current_user",
    title: "Second guessing a big leap",
    content: "I handed in my notice at my nine-to-five job after eight years. My hands were shaking all afternoon. Half of me feels terrifyingly irresponsible, but the other half feels alive for the first time in years. Has anyone else ever jumped into the unknown without a safety net? How did you survive the panic of the first few weeks?",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    stamp: "⚓ Safe Harbour",
    replies: []
  },
  {
    id: "pot-seed-003",
    senderId: "user_elena",
    senderName: "FernCollector",
    recipientId: "user_random",
    title: "A letter to anyone who feels invisible",
    content: "Walked past a hundred people in the subway today. Everyone had headphones on, eyes glued to glowing rectangles. Just wanted to throw a pebble into the void: you exist, your small unseen struggles matter, and somewhere an old analog soul is cheering for you.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    stamp: "📬 5-Cent Violet",
    replies: []
  }
];

export const VINTAGE_STAMPS = [
  "🌿 Cedar Leaf",
  "⚓ Safe Harbour",
  "📬 Air Mail 1954",
  "📜 Ancient Quill",
  "☕ Steaming Ceramic",
  "🌙 Crescent Moon",
  "🦉 Midnight Owl",
  "🕯️ Tallow Candle"
];

export const RANDOM_USERNAMES = [
  "CinnamonSparrow",
  "QuietStargazer",
  "OldOakShoemaker",
  "FernCollector",
  "CopperKettle",
  "MistyPond",
  "WanderingPoet",
  "MidnightBookworm",
  "LostPostman",
  "PaperCraneFlyer"
];
