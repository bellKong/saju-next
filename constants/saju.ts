export const RELATIONSHIPS = ["본인", "친구", "가족", "연인", "부모", "자녀"];

export const OHANG_COLORS: Record<string, { bg: string; text: string }> = {
  木: { bg: "bg-green-700", text: "text-green-300" },
  火: { bg: "bg-red-800", text: "text-red-300" },
  土: { bg: "bg-yellow-700", text: "text-yellow-200" },
  金: { bg: "bg-gray-500", text: "text-gray-200" },
  水: { bg: "bg-blue-800", text: "text-blue-300" },
};

export const OHANG_LABELS: Record<string, string> = {
  木: "목",
  火: "화",
  土: "토",
  金: "금",
  水: "수",
};

export const OHANG_ORDER = ["木", "火", "土", "金", "水"] as const;

export const PILLAR_LABELS = ["시주", "일주", "월주", "연주"];
