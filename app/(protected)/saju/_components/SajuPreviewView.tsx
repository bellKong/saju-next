import { useRouter } from "next/navigation";
import { OHANG_COLORS, OHANG_LABELS, OHANG_ORDER, PILLAR_LABELS } from "@/constants/saju";
import { LOADING_MANSERYEOK, LOADING_PLEASE_WAIT } from "@/constants/messages";
import { LoadingSpinner, BackButton } from "@/components/ui";
import PillarCell from "./PillarCell";
import type { Person, SajuResult } from "@/types";

interface SajuPreviewViewProps {
  person: Person;
  sajuPreview: SajuResult | null;
  previewLoading: boolean;
  creditBalance: number;
  onBack: () => void;
  onGenerateReading: () => void;
}

export default function SajuPreviewView({
  person,
  sajuPreview,
  previewLoading,
  creditBalance,
  onBack,
  onGenerateReading,
}: SajuPreviewViewProps) {
  const router = useRouter();
  const displayGender = person.gender === "female" ? "여성" : "남성";
  const isYajasi = person.birthTime
    ? parseInt(person.birthTime.split(":")[0]) >= 23
    : false;

  return (
    <div className="pb-24">
      <div className="px-6 pt-6 pb-2">
        <BackButton onClick={onBack} />
      </div>

      {previewLoading ? (
        <LoadingSpinner
          color="indigo"
          emoji="🔮"
          message={LOADING_MANSERYEOK}
          subMessage={LOADING_PLEASE_WAIT}
        />
      ) : sajuPreview ? (
        <div className="px-6">
          {/* 만세력 미리보기 헤더 */}
          <div className="text-center mb-5">
            <span className="text-lg font-bold text-gray-900">💎 만세력 미리보기 💎</span>
          </div>

          {/* 인적 정보 */}
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 mb-5">
            {[
              ["이름", person.name],
              ["관계", person.relationship],
              ["성별", displayGender],
              ["생년월일", person.birthDate],
              ["달력", person.calendarType],
              ["출생 시각", person.birthTime || "-"],
              ["야자시", isYajasi ? "해당" : "-"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          {/* 사주 팔자 4주 표시 */}
          <div className="mb-5">
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PILLAR_LABELS.map((label) => (
                <div key={label} className="text-center text-sm font-semibold text-gray-700">
                  {label}
                </div>
              ))}
            </div>

            {/* 천간 */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {sajuPreview.timePillar ? (
                <PillarCell char={sajuPreview.timePillar.gan} kr={sajuPreview.timePillar.ganKr} ohang={sajuPreview.timePillar.ohangGan} />
              ) : (
                <div className="flex flex-col items-center justify-center py-4 bg-gray-200 rounded-xl">
                  <span className="text-3xl font-bold text-gray-400">?</span>
                  <span className="text-sm mt-1 text-gray-400">미상</span>
                </div>
              )}
              <PillarCell char={sajuPreview.dayPillar.gan} kr={sajuPreview.dayPillar.ganKr} ohang={sajuPreview.dayPillar.ohangGan} />
              <PillarCell char={sajuPreview.monthPillar.gan} kr={sajuPreview.monthPillar.ganKr} ohang={sajuPreview.monthPillar.ohangGan} />
              <PillarCell char={sajuPreview.yearPillar.gan} kr={sajuPreview.yearPillar.ganKr} ohang={sajuPreview.yearPillar.ohangGan} />
            </div>

            {/* 지지 */}
            <div className="grid grid-cols-4 gap-2">
              {sajuPreview.timePillar ? (
                <PillarCell char={sajuPreview.timePillar.ji} kr={sajuPreview.timePillar.jiKr} ohang={sajuPreview.timePillar.ohangJi} />
              ) : (
                <div className="flex flex-col items-center justify-center py-4 bg-gray-200 rounded-xl">
                  <span className="text-3xl font-bold text-gray-400">?</span>
                  <span className="text-sm mt-1 text-gray-400">미상</span>
                </div>
              )}
              <PillarCell char={sajuPreview.dayPillar.ji} kr={sajuPreview.dayPillar.jiKr} ohang={sajuPreview.dayPillar.ohangJi} />
              <PillarCell char={sajuPreview.monthPillar.ji} kr={sajuPreview.monthPillar.jiKr} ohang={sajuPreview.monthPillar.ohangJi} />
              <PillarCell char={sajuPreview.yearPillar.ji} kr={sajuPreview.yearPillar.jiKr} ohang={sajuPreview.yearPillar.ohangJi} />
            </div>
          </div>

          {/* 오행 분포 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">오행 분포</h3>
            <div className="grid grid-cols-5 gap-2">
              {OHANG_ORDER.map((oh) => {
                const count = sajuPreview.ohang[oh] || 0;
                const color = OHANG_COLORS[oh];
                return (
                  <div key={oh} className="flex flex-col items-center">
                    <div className={`w-full py-2 rounded-lg ${color.bg} flex items-center justify-center`}>
                      <span className={`text-lg font-bold ${color.text}`}>{count}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{oh}({OHANG_LABELS[oh]})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 사주풀이 버튼 */}
          <button
            onClick={onGenerateReading}
            disabled={creditBalance <= 0}
            className="w-full py-4 rounded-2xl bg-indigo-600 font-bold text-white text-base hover:bg-indigo-500 transition-colors active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {creditBalance <= 0 ? "크레딧 부족" : "사주풀이 하기 (1크레딧 차감)"}
          </button>

          {creditBalance <= 0 && (
            <button
              onClick={() => router.push("/billing")}
              className="w-full py-3.5 rounded-2xl bg-gray-900 font-semibold text-white hover:bg-gray-800 transition-colors active:scale-98"
            >
              크레딧 충전하기
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
