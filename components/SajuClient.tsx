"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LatestReading {
  id: string;
  result: { content: string } | null;
  summary: string | null;
  input: Record<string, string>;
  createdAt: string;
}

interface Person {
  id: string;
  name: string;
  relationship: string;
  birthDate: string;
  birthTime: string | null;
  calendarType: string;
  gender: string;
  manseryeok: SajuResult | null;
  latestReading: LatestReading | null;
}

interface Pillar {
  gan: string;
  ji: string;
  ganKr: string;
  jiKr: string;
  ohangGan: string;
  ohangJi: string;
}

interface SajuResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  timePillar: Pillar | null;
  ohang: Record<string, number>;
  solarDate: string;
  lunarDate: string;
  sajuYear: number;
}

interface Props {
  creditBalance: number;
  initialPersons: Person[];
}

const relationships = ["본인", "친구", "가족", "연인", "부모", "자녀"];

// 오행별 색상 매핑
const OHANG_COLORS: Record<string, { bg: string; text: string }> = {
  木: { bg: "bg-green-700", text: "text-green-300" },
  火: { bg: "bg-red-800", text: "text-red-300" },
  土: { bg: "bg-yellow-700", text: "text-yellow-200" },
  金: { bg: "bg-gray-500", text: "text-gray-200" },
  水: { bg: "bg-blue-800", text: "text-blue-300" },
};

function PillarCell({ label, char, kr, ohang }: { label: string; char: string; kr: string; ohang: string }) {
  const color = OHANG_COLORS[ohang] || { bg: "bg-gray-600", text: "text-gray-200" };
  return (
    <div className={`flex flex-col items-center justify-center py-4 ${color.bg} rounded-xl`}>
      <span className={`text-3xl font-bold ${color.text}`}>{char}</span>
      <span className={`text-sm mt-1 ${color.text} opacity-80`}>{kr}</span>
    </div>
  );
}

type View = "list" | "form" | "loading" | "preview" | "detail";

export default function SajuClient({ creditBalance, initialPersons }: Props) {
  const router = useRouter();
  const [persons, setPersons] = useState<Person[]>(initialPersons);
  const [view, setView] = useState<View>("list");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [currentReading, setCurrentReading] = useState<LatestReading | null>(null);
  const [sajuPreview, setSajuPreview] = useState<SajuResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingPerson, setSavingPerson] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("본인");
  const [birthDate, setBirthDate] = useState("");
  const [knowBirthTime, setKnowBirthTime] = useState(true);
  const [knowExactTime, setKnowExactTime] = useState(true);
  const [birthTime, setBirthTime] = useState("");
  const [calendarType, setCalendarType] = useState("양력");
  const [gender, setGender] = useState("여자");

  const resetForm = () => {
    setName("");
    setRelationship("본인");
    setBirthDate("");
    setKnowBirthTime(true);
    setKnowExactTime(true);
    setBirthTime("");
    setCalendarType("양력");
    setGender("여자");
  };

  const handleSavePerson = async () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요");
      return;
    }
    if (!birthDate) {
      alert("생년월일을 입력해주세요");
      return;
    }
    if (knowBirthTime && !birthTime) {
      alert("태어난 시간을 입력해주세요");
      return;
    }

    setSavingPerson(true);

    try {
      const res = await fetch("/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          relationship,
          birthDate,
          birthTime: knowBirthTime ? birthTime : null,
          calendarType,
          gender: gender === "여자" ? "female" : "male",
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newPerson: Person = {
          id: data.person.id,
          name: data.person.name,
          relationship: data.person.relationship,
          birthDate: data.person.birthDate,
          birthTime: data.person.birthTime,
          calendarType: data.person.calendarType,
          gender: data.person.gender,
          manseryeok: null,
          latestReading: null,
        };
        setPersons((prev) => [newPerson, ...prev]);
        setView("list");
        resetForm();
      } else {
        alert(data.error || "오류가 발생했습니다");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다");
    } finally {
      setSavingPerson(false);
    }
  };

  const handlePersonClick = async (person: Person) => {
    // If already has a reading, show detail directly
    if (person.latestReading) {
      setSelectedPerson(person);
      setCurrentReading(person.latestReading);
      setView("detail");
      return;
    }

    // If cached manseryeok exists, show preview immediately
    if (person.manseryeok) {
      setSelectedPerson(person);
      setSajuPreview(person.manseryeok);
      setView("preview");
      return;
    }

    // Fetch 만세력 from API
    setSelectedPerson(person);
    setPreviewLoading(true);
    setSajuPreview(null);
    setView("preview");

    try {
      const res = await fetch("/api/saju/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: person.id,
          birthDate: person.birthDate,
          birthTime: person.birthTime || "모름",
          calendarType: person.calendarType,
          gender: person.gender,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSajuPreview(data.sajuResult);
        // Update local cache so next click is instant
        setPersons((prev) =>
          prev.map((p) =>
            p.id === person.id ? { ...p, manseryeok: data.sajuResult } : p
          )
        );
      } else {
        alert(data.error || "만세력 계산에 실패했습니다");
        setView("list");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다");
      setView("list");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGenerateReading = async () => {
    if (!selectedPerson) return;

    if (creditBalance <= 0) {
      alert("크레딧이 부족합니다. 충전 후 이용해주세요.");
      return;
    }

    setView("loading");

    try {
      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SAJU",
          personId: selectedPerson.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const reading: LatestReading = {
          id: data.reading.id,
          result: data.reading.result,
          summary: data.reading.summary,
          input: data.reading.input,
          createdAt: data.reading.createdAt,
        };
        setCurrentReading(reading);
        setPersons((prev) =>
          prev.map((p) =>
            p.id === selectedPerson.id ? { ...p, latestReading: reading } : p
          )
        );
        setView("detail");
        router.refresh();
      } else {
        alert(data.error || "오류가 발생했습니다");
        setView("preview");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다");
      setView("preview");
    }
  };

  const handleDeletePerson = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("이 사람을 삭제하시겠습니까?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/persons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPersons((prev) => prev.filter((p) => p.id !== id));
        if (selectedPerson?.id === id) {
          setSelectedPerson(null);
          setView("list");
        }
        router.refresh();
      } else {
        alert("삭제에 실패했습니다");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다");
    } finally {
      setDeletingId(null);
    }
  };

  // Preview view — 만세력 미리보기
  if (view === "preview" && selectedPerson) {
    const displayGender = selectedPerson.gender === "female" ? "여성" : "남성";
    const isYajasi = selectedPerson.birthTime
      ? parseInt(selectedPerson.birthTime.split(":")[0]) >= 23
      : false;

    return (
      <div className="pb-24">
        <div className="px-6 pt-6 pb-2">
          <button
            onClick={() => {
              setView("list");
              setSelectedPerson(null);
              setSajuPreview(null);
            }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            목록으로
          </button>
        </div>

        {previewLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl animate-float">
                🔮
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">만세력을 계산하고 있어요</p>
            <p className="text-sm text-gray-400">잠시만 기다려주세요...</p>
          </div>
        ) : sajuPreview ? (
          <div className="px-6">
            {/* 만세력 미리보기 헤더 */}
            <div className="text-center mb-5">
              <span className="text-lg font-bold text-gray-900">💎 만세력 미리보기 💎</span>
            </div>

            {/* 인적 정보 */}
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 mb-5">
              {[
                ["이름", selectedPerson.name],
                ["관계", selectedPerson.relationship],
                ["성별", displayGender],
                ["생년월일", selectedPerson.birthDate],
                ["달력", selectedPerson.calendarType],
                ["출생 시각", selectedPerson.birthTime || "-"],
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
              {/* 헤더 라벨 */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                {["시주", "일주", "월주", "연주"].map((label) => (
                  <div key={label} className="text-center text-sm font-semibold text-gray-700">
                    {label}
                  </div>
                ))}
              </div>

              {/* 천간 (위 행) */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                {sajuPreview.timePillar ? (
                  <PillarCell
                    label="시간"
                    char={sajuPreview.timePillar.gan}
                    kr={sajuPreview.timePillar.ganKr}
                    ohang={sajuPreview.timePillar.ohangGan}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 bg-gray-200 rounded-xl">
                    <span className="text-3xl font-bold text-gray-400">?</span>
                    <span className="text-sm mt-1 text-gray-400">미상</span>
                  </div>
                )}
                <PillarCell label="일간" char={sajuPreview.dayPillar.gan} kr={sajuPreview.dayPillar.ganKr} ohang={sajuPreview.dayPillar.ohangGan} />
                <PillarCell label="월간" char={sajuPreview.monthPillar.gan} kr={sajuPreview.monthPillar.ganKr} ohang={sajuPreview.monthPillar.ohangGan} />
                <PillarCell label="연간" char={sajuPreview.yearPillar.gan} kr={sajuPreview.yearPillar.ganKr} ohang={sajuPreview.yearPillar.ohangGan} />
              </div>

              {/* 지지 (아래 행) */}
              <div className="grid grid-cols-4 gap-2">
                {sajuPreview.timePillar ? (
                  <PillarCell
                    label="시지"
                    char={sajuPreview.timePillar.ji}
                    kr={sajuPreview.timePillar.jiKr}
                    ohang={sajuPreview.timePillar.ohangJi}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 bg-gray-200 rounded-xl">
                    <span className="text-3xl font-bold text-gray-400">?</span>
                    <span className="text-sm mt-1 text-gray-400">미상</span>
                  </div>
                )}
                <PillarCell label="일지" char={sajuPreview.dayPillar.ji} kr={sajuPreview.dayPillar.jiKr} ohang={sajuPreview.dayPillar.ohangJi} />
                <PillarCell label="월지" char={sajuPreview.monthPillar.ji} kr={sajuPreview.monthPillar.jiKr} ohang={sajuPreview.monthPillar.ohangJi} />
                <PillarCell label="연지" char={sajuPreview.yearPillar.ji} kr={sajuPreview.yearPillar.jiKr} ohang={sajuPreview.yearPillar.ohangJi} />
              </div>
            </div>

            {/* 오행 분포 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">오행 분포</h3>
              <div className="grid grid-cols-5 gap-2">
                {(["木", "火", "土", "金", "水"] as const).map((oh) => {
                  const count = sajuPreview.ohang[oh] || 0;
                  const color = OHANG_COLORS[oh];
                  const labels: Record<string, string> = { 木: "목", 火: "화", 土: "토", 金: "금", 水: "수" };
                  return (
                    <div key={oh} className="flex flex-col items-center">
                      <div className={`w-full py-2 rounded-lg ${color.bg} flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${color.text}`}>{count}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{oh}({labels[oh]})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 사주풀이 버튼 */}
            <button
              onClick={handleGenerateReading}
              disabled={creditBalance <= 0}
              className="w-full py-4 rounded-2xl bg-indigo-600 font-bold text-white text-base hover:bg-indigo-500 transition-colors active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {creditBalance <= 0
                ? "크레딧 부족"
                : `사주풀이 하기 (1크레딧 차감)`}
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

  // Detail view
  if (view === "detail" && selectedPerson && currentReading) {
    return (
      <div className="pb-24">
        <div className="px-6 pt-6 pb-2">
          <button
            onClick={() => {
              setView("list");
              setSelectedPerson(null);
              setCurrentReading(null);
              setSajuPreview(null);
            }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            목록으로
          </button>
        </div>

        <div className="px-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {selectedPerson.name}
            </h2>
            <p className="text-sm text-gray-500">{currentReading.summary}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
                {selectedPerson.relationship}
              </span>
              <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
                {selectedPerson.gender === "female" ? "여자" : "남자"}
              </span>
              <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
                {selectedPerson.birthDate}
              </span>
              <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
                {selectedPerson.calendarType}
              </span>
              {selectedPerson.birthTime && (
                <span className="px-2 py-0.5 bg-white rounded-md text-xs text-gray-600">
                  {selectedPerson.birthTime}
                </span>
              )}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
              {currentReading.result?.content}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setView("list");
                setSelectedPerson(null);
                setCurrentReading(null);
                setSajuPreview(null);
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gray-100 font-semibold text-gray-700 hover:bg-gray-200 transition-colors active:scale-98"
            >
              목록으로
            </button>
            <button
              onClick={async () => {
                await fetch(`/api/readings/${currentReading.id}/share`, { method: "POST" });
                alert("공유 링크가 생성되었습니다!");
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gray-900 font-semibold text-white hover:bg-gray-800 transition-colors active:scale-98"
            >
              공유하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading view
  if (view === "loading") {
    return (
      <div className="pb-24">
        <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 px-6 py-5 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">사주 분석</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl animate-float">
              🔮
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-1">
            {selectedPerson?.name}님의 사주를 분석하고 있어요
          </p>
          <p className="text-sm text-gray-400">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  // Form view
  if (view === "form") {
    return (
      <div className="pb-24">
        <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 px-6 py-5 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">사람 추가</h1>
          <button
            onClick={() => { setView("list"); resetForm(); }}
            className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {/* 이름 */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-900">이름</label>
              <span className="text-xs text-red-400">필수</span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* 관계 */}
          <div className="px-6 py-5">
            <label className="block text-sm font-bold text-gray-900 mb-2">관계</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none appearance-none"
            >
              {relationships.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* 생년월일 */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-900">생년월일</label>
              <span className="text-xs text-red-400">필수</span>
            </div>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* 태어난 시간 */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-gray-900">태어난 시간을 아시나요?</label>
            </div>
            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={knowBirthTime}
                  onChange={() => setKnowBirthTime(true)}
                  className="w-5 h-5 text-indigo-600 accent-indigo-600"
                />
                <span className="text-sm font-medium text-gray-700">예</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!knowBirthTime}
                  onChange={() => setKnowBirthTime(false)}
                  className="w-5 h-5 text-indigo-600 accent-indigo-600"
                />
                <span className="text-sm font-medium text-gray-700">아니오</span>
              </label>
            </div>

            {knowBirthTime && (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-bold text-gray-900 mb-3">정확한 시간을 아시나요?</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={knowExactTime}
                        onChange={() => setKnowExactTime(true)}
                        className="w-5 h-5 text-indigo-600 accent-indigo-600"
                      />
                      <span className="text-sm font-medium text-gray-700">예</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!knowExactTime}
                        onChange={() => setKnowExactTime(false)}
                        className="w-5 h-5 text-indigo-600 accent-indigo-600"
                      />
                      <span className="text-sm font-medium text-gray-700">아니오</span>
                    </label>
                  </div>
                </div>

                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none mt-3"
                />
              </>
            )}
          </div>

          {/* 달력 종류 + 성별 */}
          <div className="px-6 py-5 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">달력 종류</label>
              <div className="flex gap-6">
                {["양력", "음력"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={calendarType === type}
                      onChange={() => setCalendarType(type)}
                      className="w-5 h-5 text-indigo-600 accent-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">성별</label>
              <div className="flex gap-6">
                {["여자", "남자"].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="w-5 h-5 text-indigo-600 accent-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-6 py-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setView("list"); resetForm(); }}
                className="flex-1 py-4 rounded-2xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors active:scale-98"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSavePerson}
                disabled={savingPerson}
                className="flex-1 py-4 rounded-2xl bg-indigo-600 font-semibold text-white hover:bg-indigo-500 transition-colors active:scale-98 disabled:opacity-50"
              >
                {savingPerson ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view (default)
  return (
    <div className="pb-24 relative min-h-[calc(100vh-3.5rem)]">
      {/* Hero Banner */}
      <div className="px-6 pt-6 pb-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600 p-7">
          <div className="absolute top-2 right-4 text-6xl opacity-20">🔮</div>
          <div className="relative z-10">
            <span className="inline-block px-2.5 py-1 bg-white/20 rounded-lg text-xs font-semibold text-white/90 mb-3">
              사주
            </span>
            <h1 className="text-2xl font-bold text-white mb-1">나의 사주팔자는?</h1>
            <p className="text-indigo-100 text-sm">AI가 사주를 분석해드려요</p>
          </div>
        </div>
      </div>

      {/* Credit info */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-indigo-50">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{creditBalance}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">보유 크레딧</p>
            <p className="text-xs text-gray-500">{creditBalance}회 이용 가능</p>
          </div>
        </div>
      </div>

      {/* + 새로운 사람 추가하기 */}
      <div className="px-6 pb-3">
        <button
          onClick={() => setView("form")}
          className="w-full py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-base hover:bg-indigo-100 transition-colors active:scale-98 flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          새로운 사람 추가하기
        </button>
      </div>

      {/* Persons list */}
      <div className="px-6">
        {persons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">🔮</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              아직 추가된 사람이 없어요
            </h3>
            <p className="text-sm text-gray-400">
              위 버튼을 눌러 사람을 추가해보세요
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {persons.map((person) => {
              const hasReading = !!person.latestReading;
              const displayGender = person.gender === "female" ? "여자" : "남자";

              return (
                <div key={person.id} className="py-4">
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => handlePersonClick(person)}
                      className="flex-1 text-left"
                    >
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {person.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                          {person.relationship}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                          {displayGender}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                          {person.birthDate}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                          {person.calendarType}
                        </span>
                        {person.birthTime && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                            {person.birthTime}
                          </span>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center gap-3 shrink-0 ml-3 pt-1">
                      {hasReading ? (
                        <span className="text-xs font-semibold text-green-600">결과 보기</span>
                      ) : (
                        <span className="text-xs font-semibold text-indigo-500">만세력 보기</span>
                      )}
                      <button
                        onClick={(e) => handleDeletePerson(e, person.id)}
                        disabled={deletingId === person.id}
                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setView("form")}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-500 transition-colors active:scale-95 z-40"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
