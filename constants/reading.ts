export const READING_TYPE_CONFIG = {
  SAJU: { label: "사주팔자", icon: "🔮", color: "bg-indigo-100 text-indigo-700", gradient: "from-indigo-500 to-purple-600" },
  COMPAT: { label: "궁합", icon: "💕", color: "bg-pink-100 text-pink-700", gradient: "from-pink-400 to-rose-500" },
  FORTUNE: { label: "운세", icon: "⭐", color: "bg-amber-100 text-amber-700", gradient: "from-amber-400 to-orange-500" },
} as const;

export type ReadingType = keyof typeof READING_TYPE_CONFIG;
