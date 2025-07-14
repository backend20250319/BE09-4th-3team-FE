export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-gray-600 font-medium text-lg">프로젝트 정보를 불러오는 중...</div>
    </div>
  );
}
