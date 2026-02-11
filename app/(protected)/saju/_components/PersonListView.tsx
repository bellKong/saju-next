import type { Person } from "@/types";

interface PersonListViewProps {
  persons: Person[];
  creditBalance: number;
  deletingId: string | null;
  onAddClick: () => void;
  onPersonClick: (person: Person) => void;
  onDeletePerson: (e: React.MouseEvent, id: string) => void;
}

export default function PersonListView({
  persons,
  creditBalance,
  deletingId,
  onAddClick,
  onPersonClick,
  onDeletePerson,
}: PersonListViewProps) {
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
          onClick={onAddClick}
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
                      onClick={() => onPersonClick(person)}
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
                        onClick={(e) => onDeletePerson(e, person.id)}
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
        onClick={onAddClick}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-500 transition-colors active:scale-95 z-40"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
