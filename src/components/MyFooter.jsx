import { Col, Container, Row } from "react-bootstrap"
import { FaFacebookSquare } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { FiInstagram } from "react-icons/fi"
import "../styles/MyFooter.css"
import { Link } from "react-router-dom"

const MyFooter = () => {
  return (
    <footer className="bg-transparent text-dark w-100 footer-glass">
      <Container fluid className="rounded-0">
        <Row>
          <Col xs={4} className="text-start">
            <h6>Supporto</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  className="footer-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Gestisci i tuoi viaggi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="footer-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Contatta l'assistenza Clienti
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="footer-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Info sulla sicurezza
                </a>
              </li>
            </ul>
          </Col>
          <Col xs={4} className="text-center">
            <h6>Esplora</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/strutture" className="footer-link">
                  Le nostre strutture
                </Link>
              </li>
              <li>
                <Link to="/itineraries" className="footer-link">
                  Genera itinerario
                </Link>
              </li>
              <li>
                <Link to="/itineraries/create" className="footer-link">
                  Crea itinerario
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">
                  Dashboard
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={4} className="text-end">
            <h6>Termini e impostazioni</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  className="footer-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy e Cookie
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="footer-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Termini e condizioni
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="footer-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Risoluzione Controversie
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="text-center mt-3">
          <p>&copy; 2025 Mindwander. Tutti i diritti riservati</p>
          <div>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="m-3 fs-1 text-dark"
            >
              <FaFacebookSquare />
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="m-3 fs-1 text-dark"
            >
              <FiInstagram />
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="m-3 fs-1 text-dark"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default MyFooter
