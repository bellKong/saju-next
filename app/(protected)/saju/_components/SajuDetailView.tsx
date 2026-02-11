import { BackButton } from "@/components/ui";
import { createShareLink } from "@/services/readings.api";
import { SUCCESS_SHARE_CREATED } from "@/constants/messages";
import type { Person, LatestReading } from "@/types";

interface SajuDetailViewProps {
  person: Person;
  reading: LatestReading;
  onBack: () => void;
}

export default function SajuDetailView({ person, reading, onBack }: SajuDetailViewProps) {
  const handleShare = async () => {
    await createShareLink(reading.id);
    alert(SUCCESS_SHARE_CREATED);
  };

  return (
    <div className="pb-24">
      <div className="px-6 pt-6 pb-2">
        <BackButton onClick={onBack} />
      </div>

      <div className="px-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{person.name}</h2>
          <p className="text-sm text-gray-500">{reading.summary}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
              {person.relationship}
            </span>
            <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
              {person.gender === "female" ? "여자" : "남자"}
            </span>
            <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
              {person.birthDate}
            </span>
            <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
              {person.calendarType}
            </span>
            {person.birthTime && (
              <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
                {person.birthTime}
              </span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
            {reading.result?.content}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onBack}
            className="flex-1 py-3.5 rounded-2xl bg-gray-100 font-semibold text-gray-700 hover:bg-gray-200 transition-colors active:scale-98"
          >
            목록으로
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-3.5 rounded-2xl bg-gray-900 font-semibold text-white hover:bg-gray-800 transition-colors active:scale-98"
          >
            공유하기
          </button>
        </div>
      </div>
    </div>
  );
}
