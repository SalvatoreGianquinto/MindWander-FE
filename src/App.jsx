import { Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import "./styles/custom.scss"
import RegisterPage from "./components/RegisterPage"
import LoginPage from "./components/LoginPage"
import HomePage from "./components/Homapage"
import StruttureList from "./components/StruttureList"
import CreaItinerarioPage from "./components/CreaItinerarioPage"
import AutomaticItinerarioPage from "./components/AutomaticItinerarioPage"
import StrutturaDettaglio from "./components/StruttureDettaglio"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/strutture" element={<StruttureList />} />
      <Route path="/strutture/:id" element={<StrutturaDettaglio />} />
      <Route path="/itineraries" element={<AutomaticItinerarioPage />} />
      <Route path="/itineraries/create" element={<CreaItinerarioPage />} />
    </Routes>
  )
}

export default App
