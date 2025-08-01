import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import "../styles/NavigationBar.css"
import { FaBars, FaTimes } from "react-icons/fa"

function NavigationBar() {
  const [userRole, setUserRole] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [itineraryDropdownOpen, setItineraryDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const checkToken = () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const roles = decoded.roles || decoded.role || decoded.authorities || []
        const role = Array.isArray(roles) ? roles[0] : roles
        setUserRole(role)
      } catch (error) {
        console.error("Token non valido", error)
        setUserRole(null)
      }
    } else {
      setUserRole(null)
    }
  }

  useEffect(() => {
    checkToken()

    const handleAuthChange = () => {
      checkToken()
    }

    window.addEventListener("authChanged", handleAuthChange)

    return () => {
      window.removeEventListener("authChanged", handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUserRole(null)
    setSidebarOpen(false)
    navigate("/")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const toggleItineraryDropdown = () => {
    setItineraryDropdownOpen((prev) => !prev)
  }

  const closeAllMenus = () => {
    setSidebarOpen(false)
    setItineraryDropdownOpen(false)
  }

  return (
    <>
      <header className="header">
        <Link to="/" className="titolo" onClick={closeSidebar}>
          MINDWANDER
        </Link>
        <div className="hamburger" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </div>
        <nav className={`navbar ${sidebarOpen ? "open" : ""}`}>
          <div className="nav-item-with-dropdown">
            <div className="nav-link" onClick={toggleItineraryDropdown}>
              Itinerari ▾
            </div>
            {itineraryDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/itineraries" onClick={closeAllMenus}>
                  Genera Itinerario
                </Link>
                <Link to="/itineraries/create" onClick={closeAllMenus}>
                  Crea Itinerario
                </Link>
              </div>
            )}
          </div>

          <Link to="/strutture" onClick={closeSidebar}>
            Strutture
          </Link>
          <Link to="/dashboard" onClick={closeSidebar}>
            Dashboard
          </Link>
          {userRole === "ADMIN" && (
            <Link to="/backoffice" onClick={closeSidebar}>
              BackOffice
            </Link>
          )}
          {userRole ? (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={closeSidebar}>
                Login
              </Link>
              <Link to="/register" onClick={closeSidebar}>
                Register
              </Link>
            </>
          )}
        </nav>
      </header>
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  )
}

export default NavigationBar
