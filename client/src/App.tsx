import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './routes/HomePage'
import UsersPage from './routes/UsersPage'
import UserDetailPage from './routes/UserDetailPage'
import CreateUserPage from './routes/CreateUserPage'
import EditUserPage from './routes/EditUserPage'
import NotFoundPage from './routes/NotFoundPage'

import SleepRecordsPage from './routes/SleepRecordsPage'
import CreateSleepRecordPage from './routes/CreateSleepRecordPage'
import EditSleepRecordPage from './routes/EditSleepRecordPage'
import StatisticsPage from './routes/StatisticsPage'
import LoginPage from './routes/LoginPage'
import LogoutPage from './routes/LogoutPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="sleep-records" element={<SleepRecordsPage />} />
        <Route path="sleep-records/new" element={<CreateSleepRecordPage />} />
        <Route path="sleep-records/:id/edit" element={<EditSleepRecordPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="logout" element={<LogoutPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path="new" element={<CreateUserPage />} />
          <Route path=":id" element={<UserDetailPage />} />
          <Route path=":id/edit" element={<EditUserPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
