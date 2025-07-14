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
import NuovaRecensionePage from "./components/NuovaRecensionePage"
import PrenotaPage from "./components/PrenotaStrutture"
import UserDashboard from "./components/UserDashboard"
import BackOffice from "./components/BackOffice"
import NuovaStruttura from "./components/NuovaStruttura"
import EditStruttura from "./components/EditStruttura"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/strutture" element={<StruttureList />} />
      <Route path="/strutture/:id" element={<StrutturaDettaglio />} />
      <Route path="/prenota/:strutturaId" element={<PrenotaPage />} />
      <Route path="/recensioni/nuova/:id" element={<NuovaRecensionePage />} />
      <Route path="/itineraries" element={<AutomaticItinerarioPage />} />
      <Route path="/itineraries/create" element={<CreaItinerarioPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/backoffice" element={<BackOffice />} />
      <Route path="/backoffice/nuova-struttura" element={<NuovaStruttura />} />
      <Route path="/backoffice/modifica/:id" element={<EditStruttura />} />
    </Routes>
  )
}

export default App
