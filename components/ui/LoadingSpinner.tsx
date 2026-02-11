interface LoadingSpinnerProps {
  color?: string;
  emoji?: string;
  message: string;
  subMessage?: string;
}

export default function LoadingSpinner({
  color = "indigo",
  emoji = "🔮",
  message,
  subMessage = "잠시만 기다려주세요...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-20 h-20 mb-6">
        <div className={`absolute inset-0 rounded-full border-4 border-${color}-100`} />
        <div className={`absolute inset-0 rounded-full border-4 border-${color}-500 border-t-transparent animate-spin`} />
        <div className="absolute inset-0 flex items-center justify-center text-2xl animate-float">
          {emoji}
        </div>
      </div>
      <p className="text-lg font-semibold text-gray-900 mb-1">{message}</p>
      <p className="text-sm text-gray-400">{subMessage}</p>
    </div>
  );
}
