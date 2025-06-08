import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const HomePage = () => {
  const { userEmail } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-2">수면 관리 앱</h1>
      <p className="text-base text-gray-700 mb-6 text-center max-w-md">
        나만의 수면을 간편하게 기록하고, 지난 내역을 확인해보세요. AI 인사이트로 꿀잠 꿀팁도 받아볼
        수 있어요.
      </p>

      <div className="flex flex-col space-y-3 w-full max-w-xs">
        {userEmail ? (
          <>
            <Link
              to="/sleep-records"
              className="w-full text-center py-3 bg-blue-500 text-white rounded-lg shadow"
            >
              기록 확인하기
            </Link>
            <Link
              to="/sleep-records/new"
              className="w-full text-center py-3 bg-green-500 text-white rounded-lg shadow"
            >
              새 기록 추가하기
            </Link>
            <Link
              to="/statistics"
              className="w-full text-center py-3 bg-indigo-500 text-white rounded-lg shadow"
            >
              통계 인사이트 보기
            </Link>
          </>
        ) : (
          <Link
            to="/login"
            className="w-full text-center py-4 bg-blue-500 text-white rounded-lg shadow-md"
          >
            로그인하고 시작하기
          </Link>
        )}
      </div>

      <footer className="mt-8 text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} 수면 관리 앱
      </footer>
    </div>
  )
}

export default HomePage
