import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Welcome from './pages/Welcome'
import HealthProfile from './pages/HealthProfile'
import Monitor from './pages/Monitor'
import Result from './pages/Result'
import History from './pages/History'
import Emergency from './pages/Emergency'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/health-profile" element={<HealthProfile />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route path="/emergency" element={<Emergency />} />
      </Routes>
    </BrowserRouter>
  )
}
