import { Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import "./styles/custom.scss"
import RegisterPage from "./components/RegisterPage"
import LoginPage from "./components/LoginPage"

function App() {
  const isAuthenticated = !!localStorage.getItem("token")
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
