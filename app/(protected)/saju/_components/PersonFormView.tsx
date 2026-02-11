import { RELATIONSHIPS } from "@/constants/saju";
import { VALIDATION_NAME_REQUIRED, VALIDATION_BIRTHDATE_REQUIRED, VALIDATION_BIRTHTIME_REQUIRED } from "@/constants/messages";
import { usePersonForm } from "@/hooks/usePersonForm";

interface PersonFormViewProps {
  savingPerson: boolean;
  onSave: (data: {
    name: string;
    relationship: string;
    birthDate: string;
    birthTime: string | null;
    calendarType: string;
    gender: string;
  }) => Promise<boolean>;
  onCancel: () => void;
}

export default function PersonFormView({ savingPerson, onSave, onCancel }: PersonFormViewProps) {
  const form = usePersonForm();

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert(VALIDATION_NAME_REQUIRED);
      return;
    }
    if (!form.birthDate) {
      alert(VALIDATION_BIRTHDATE_REQUIRED);
      return;
    }
    if (form.knowBirthTime && !form.birthTime) {
      alert(VALIDATION_BIRTHTIME_REQUIRED);
      return;
    }

    const success = await onSave({
      name: form.name.trim(),
      relationship: form.relationship,
      birthDate: form.birthDate,
      birthTime: form.knowBirthTime ? form.birthTime : null,
      calendarType: form.calendarType,
      gender: form.gender === "여자" ? "female" : "male",
    });

    if (success) {
      form.resetForm();
    }
  };

  const handleCancel = () => {
    form.resetForm();
    onCancel();
  };

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 px-6 py-5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">사람 추가</h1>
        <button
          onClick={handleCancel}
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
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
            placeholder="이름을 입력해주세요"
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none"
          />
        </div>

        {/* 관계 */}
        <div className="px-6 py-5">
          <label className="block text-sm font-bold text-gray-900 mb-2">관계</label>
          <select
            value={form.relationship}
            onChange={(e) => form.setRelationship(e.target.value)}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none appearance-none"
          >
            {RELATIONSHIPS.map((r) => (
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
            value={form.birthDate}
            onChange={(e) => form.setBirthDate(e.target.value)}
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
                checked={form.knowBirthTime}
                onChange={() => form.setKnowBirthTime(true)}
                className="w-5 h-5 text-indigo-600 accent-indigo-600"
              />
              <span className="text-sm font-medium text-gray-700">예</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!form.knowBirthTime}
                onChange={() => form.setKnowBirthTime(false)}
                className="w-5 h-5 text-indigo-600 accent-indigo-600"
              />
              <span className="text-sm font-medium text-gray-700">아니오</span>
            </label>
          </div>

          {form.knowBirthTime && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-bold text-gray-900 mb-3">정확한 시간을 아시나요?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={form.knowExactTime}
                      onChange={() => form.setKnowExactTime(true)}
                      className="w-5 h-5 text-indigo-600 accent-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">예</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!form.knowExactTime}
                      onChange={() => form.setKnowExactTime(false)}
                      className="w-5 h-5 text-indigo-600 accent-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">아니오</span>
                  </label>
                </div>
              </div>

              <input
                type="time"
                value={form.birthTime}
                onChange={(e) => form.setBirthTime(e.target.value)}
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
                    checked={form.calendarType === type}
                    onChange={() => form.setCalendarType(type)}
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
                    checked={form.gender === g}
                    onChange={() => form.setGender(g)}
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
              onClick={handleCancel}
              className="flex-1 py-4 rounded-2xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors active:scale-98"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
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
