import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* デフォルトはログイン画面へリダイレクト */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 物件一覧は認証済みユーザーのみアクセス可 */}
        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <Properties />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
