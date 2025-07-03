import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/RegisterPage.css"
import logo from "../assets/logo.jpg"

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
      await axios.post("http://localhost:8080/auth/register", formData)
      alert("Registrazione completata!")
      navigate("/login")
    } catch (err) {
      alert(
        "Errore: " + (err.response?.data?.message || "Registrazione fallita")
      )
    }
  }

  return (
    <div className="container-fluid py-5 d-flex flex-column justify-content-center align-items-center custom-container">
      <img src={logo} alt="MindWander Logo" className="logo mb-4 w-100" />
      <div className="card p-5 shadow w-100">
        <h2 className="mb-4 text-center text-primary">Registrati</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-primary">Nome</label>
            <input
              className="form-control"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-primary">Cognome</label>
            <input
              className="form-control"
              name="cognome"
              value={formData.cognome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-primary">Username</label>
            <input
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-primary">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-primary">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Registrati
          </button>
          <p className="mt-3 text-center text-primary">
            Sei già registrato?{" "}
            <Link to="/login" className="text-primary">
              Vai al Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
