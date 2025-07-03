import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import logo from "../assets/logo.jpg"
import "../styles/LoginPage.css"

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
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
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        formData
      )
      const token = response.data
      localStorage.setItem("token", token)
      alert("Login riuscito!")
      navigate("/")
    } catch (err) {
      alert("Errore: " + (err.response?.data?.message || "Login fallito"))
    }
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 container-login">
      <Link to="/">
        <img src={logo} alt="MindWander Logo" className="logo mb-4 w-100" />
      </Link>
      <div className="card p-4 shadow">
        <h2 className="mb-4 text-center text-primary">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-primary">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
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
            Accedi
          </button>
          <p className="mt-3 text-center text-primary">
            Non sei registrato?{" "}
            <Link to="/register" className="text-primary">
              Vai alla registrazione
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
