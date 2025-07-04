import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/AuthPage.css"
import "../App.css"
import { FaUser, FaLock } from "react-icons/fa"

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
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>MINDWANDER</h1>
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FaLock className="icon" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          <a href="#">Password dimenticata?</a>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>
            Non hai un account? <a href="/register">Registrati</a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
