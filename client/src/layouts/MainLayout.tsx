import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const MainLayout: React.FC = () => {
  const { userEmail, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            수면 관리 앱
          </Link>
          <nav className="flex space-x-4 items-center">
            {userEmail ? (
              <>
                <span className="px-3 py-1 bg-blue-500 rounded text-sm">{userEmail}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1 bg-white text-blue-600 rounded text-sm hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 bg-white text-blue-600 rounded text-sm hover:bg-gray-100"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t text-center py-4 text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} 수면 관리 앱
      </footer>
    </div>
  )
}

export default MainLayout
