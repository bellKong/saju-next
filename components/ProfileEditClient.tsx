"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/services/profile.api";
import { VALIDATION_NAME_REQUIRED, ERROR_NETWORK, ERROR_GENERIC } from "@/constants/messages";

interface Props {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    birthDate: string | null;
    gender: string | null;
  };
}

export default function ProfileEditClient({ user }: Props) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [birthDate, setBirthDate] = useState(user.birthDate || "");
  const [gender, setGender] = useState(user.gender || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert(VALIDATION_NAME_REQUIRED);
      return;
    }

    setSaving(true);
    try {
      const data = await updateProfile({
        name: name.trim(),
        birthDate: birthDate || null,
        gender: gender || null,
      });

      if (data.success) {
        router.push("/mypage");
        router.refresh();
      } else {
        alert(data.error || ERROR_GENERIC);
      }
    } catch {
      alert(ERROR_NETWORK);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900">프로필 수정</h1>
      </div>

      {/* Profile image */}
      <div className="flex justify-center py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
            {user.image ? (
              <img src={user.image} alt="프로필" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-white font-bold">
                {(user.name || "U").charAt(0)}
              </span>
            )}
          </div>
        </div>
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

        {/* 이메일 (읽기 전용) */}
        {user.email && (
          <div className="px-6 py-5">
            <label className="block text-sm font-bold text-gray-900 mb-2">이메일</label>
            <div className="w-full px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium">
              {user.email}
            </div>
          </div>
        )}

        {/* 생년월일 */}
        <div className="px-6 py-5">
          <label className="block text-sm font-bold text-gray-900 mb-2">생년월일</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none"
          />
        </div>

        {/* 성별 */}
        <div className="px-6 py-5">
          <label className="block text-sm font-bold text-gray-900 mb-3">성별</label>
          <div className="flex gap-3">
            {[
              { value: "male", label: "남성" },
              { value: "female", label: "여성" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setGender(option.value)}
                className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  gender === option.value
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="px-6 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-indigo-600 font-semibold text-white hover:bg-indigo-500 transition-colors active:scale-98 disabled:opacity-50"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}
