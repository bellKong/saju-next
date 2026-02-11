import { OHANG_COLORS } from "@/constants/saju";

interface PillarCellProps {
  char: string;
  kr: string;
  ohang: string;
}

export default function PillarCell({ char, kr, ohang }: PillarCellProps) {
  const color = OHANG_COLORS[ohang] || { bg: "bg-gray-600", text: "text-gray-200" };
  return (
    <div className={`flex flex-col items-center justify-center py-4 ${color.bg} rounded-xl`}>
      <span className={`text-3xl font-bold ${color.text}`}>{char}</span>
      <span className={`text-sm mt-1 ${color.text} opacity-80`}>{kr}</span>
    </div>
  );
}
