"use client";

import { useRouter } from "next/navigation";
import { createShareLink } from "@/services/readings.api";
import { SUCCESS_SHARE_CREATED } from "@/constants/messages";

interface ReadingResultCardProps {
  title: string;
  summary: string | null;
  content: string | null | undefined;
  gradient: string;
  readingId: string;
  onReset: () => void;
  resetLabel?: string;
}

export default function ReadingResultCard({
  title,
  summary,
  content,
  gradient,
  readingId,
  onReset,
  resetLabel = "다시 보기",
}: ReadingResultCardProps) {
  const router = useRouter();

  const handleShare = async () => {
    await createShareLink(readingId);
    alert(SUCCESS_SHARE_CREATED);
  };

  return (
    <div className="px-6 py-6">
      <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 mb-4`}>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
        {summary && <p className="text-sm text-gray-500">{summary}</p>}
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 p-6">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
          {content}
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => {
            onReset();
            router.refresh();
          }}
          className="flex-1 py-3.5 rounded-2xl bg-gray-100 font-semibold text-gray-700 hover:bg-gray-200 transition-colors active:scale-98"
        >
          {resetLabel}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3.5 rounded-2xl bg-gray-900 font-semibold text-white hover:bg-gray-800 transition-colors active:scale-98"
        >
          공유하기
        </button>
      </div>
    </div>
  );
}
