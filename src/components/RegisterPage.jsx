import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/AuthPage.css"
import "../App.css"
import { FaUser, FaEnvelope, FaLock, FaIdBadge } from "react-icons/fa"
import api from "../api"

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    username: "",
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post("/auth/register", formData)
      alert("Registrazione completata!")
      navigate("/login")
    } catch (err) {
      alert(
        "Errore: " + (err.response?.data?.message || "Registrazione fallita")
      )
    }
  }

  return (
    <div className="bg-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1 className="text-center mb-4">MINDWANDER</h1>

          <div className="input-box">
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <FaIdBadge className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              name="cognome"
              placeholder="Cognome"
              value={formData.cognome}
              onChange={handleChange}
              required
            />
            <FaIdBadge className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FaLock className="icon" />
          </div>

          <button type="submit">Registrati</button>

          <div className="register-link">
            <p>
              Hai già un account? <a href="/login">Accedi</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
