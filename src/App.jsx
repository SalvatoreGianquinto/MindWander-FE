import { Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import "./styles/custom.scss"
import RegisterPage from "./components/RegisterPage"
import LoginPage from "./components/LoginPage"
import HomePage from "./components/Homapage"
import ItinerariPage from "./components/ItineraryPage"
import CreaItinerarioPage from "./components/CreaItinerarioPage"
import StruttureList from "./components/StruttureList"

function App() {
  const isAuthenticated = !!localStorage.getItem("token")
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/strutture" element={<StruttureList />} />
      <Route path="/itineraries" element={<ItinerariPage />} />
      <Route path="/itineraries-crea" element={<CreaItinerarioPage />} />
    </Routes>
  )
}

export default App
