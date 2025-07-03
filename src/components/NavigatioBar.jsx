import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Navbar, Nav, Button } from "react-bootstrap"
import logo from "../assets/logo.jpg"
import "../styles/NavigationBar.css"

function NavigationBar() {
  const [userRole, setUserRole] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const roles = decoded.roles || decoded.role || decoded.authorities || []
        const role = Array.isArray(roles) ? roles[0] : roles
        setUserRole(role)
      } catch (error) {
        console.error("Token non valido", error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUserRole(null)
    navigate("/login")
  }

  return (
    <Navbar bg="light" expand="lg" className="navbar-full-width p-3">
      <div className="container-fluid px-4">
        {" "}
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="MindWander" height="40" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/itinerari">
              Itinerari
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/strutture">
              Strutture
            </Nav.Link>
            {userRole === "ADMIN" && (
              <Nav.Link as={Link} to="/backoffice">
                Backoffice
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {userRole ? (
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}

export default NavigationBar
