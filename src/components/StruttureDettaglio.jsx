import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  Badge,
  Button,
  Card,
  ListGroup,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap"
import "../styles/StruttureDettaglio.css"

function StrutturaDettaglio() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [struttura, setStruttura] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recensioni, setRecensioni] = useState([])
  const [mediaVoto, setMediaVoto] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalImg, setModalImg] = useState("")

  const openModal = (imgUrl) => {
    setModalImg(imgUrl)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalImg("")
  }

  useEffect(() => {
    const fetchStruttura = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const [strutturaRes, recensioniRes, mediaRes] = await Promise.all([
          axios.get(`http://localhost:8080/strutture/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8080/recensioni/struttura/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8080/recensioni/struttura/${id}/media`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        setStruttura(strutturaRes.data)
        setRecensioni(recensioniRes.data)
        setMediaVoto(mediaRes.data || 0)
      } catch (err) {
        console.error("Errore nel caricamento:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStruttura()
  }, [id])

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )

  if (!struttura) {
    return (
      <div className="container my-5">
        <Alert variant="danger" className="text-center">
          <h4>Struttura non trovata</h4>
          <p>Potrebbe essere scaduta la sessione o l'ID non è valido.</p>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Torna al Login
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="dettaglio-wrapper">
      <div className="container my-5">
        {/* Titolo e voto */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{struttura.nome}</h2>
          <span className="badge bg-success fs-5 px-3 py-2">
            {mediaVoto.toFixed(1)}
          </span>
        </div>

        <div className="gallery mb-4">
          {struttura.immaginiUrl?.length > 0 ? (
            <>
              <div className="gallery-top">
                <img
                  src={struttura.immaginiUrl[0]}
                  alt="main"
                  className="gallery-main-img"
                  onClick={() => openModal(struttura.immaginiUrl[0])}
                  style={{ cursor: "pointer" }}
                />
                <div className="gallery-side-images">
                  {struttura.immaginiUrl.slice(1, 3).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`side-${i}`}
                      className="gallery-side-img"
                      onClick={() => openModal(url)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </div>
              </div>
              {struttura.immaginiUrl.length > 3 && (
                <div className="gallery-bottom">
                  {struttura.immaginiUrl.slice(3).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`bottom-${i}`}
                      className="gallery-bottom-img"
                      onClick={() => openModal(url)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <img
              src="https://via.placeholder.com/800x400"
              alt="placeholder"
              className="gallery-main-img"
            />
          )}
        </div>

        <Card className="shadow-lg border-0 mb-4">
          <Card.Body className="p-4">
            <div className="mb-3 text-center">
              <span className="badge bg-secondary">{struttura.categoria}</span>
              <span className="badge bg-info ms-2">
                {struttura.moodAssociato}
              </span>
            </div>
            <div className="mb-3">
              <div>
                <strong>Città:</strong> {struttura.citta}
              </div>
              <div>
                <strong>Prezzo per notte:</strong>{" "}
                <span className="text-success fw-bold">
                  €{struttura.prezzo}
                </span>
              </div>
              <div>
                <strong>Descrizione:</strong> {struttura.descrizione || "N/A"}
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Button variant="primary">Prenota ora</Button>
            </div>
          </Card.Body>
        </Card>

        <h3 className="mb-3 titoli">Servizi extra</h3>
        <div className="servizi-extra-container mb-4">
          {struttura.serviziExtra?.length > 0 ? (
            struttura.serviziExtra.map((servizio, idx) => (
              <div key={idx} className="servizio-box">
                {servizio}
              </div>
            ))
          ) : (
            <p>Nessun servizio extra disponibile.</p>
          )}
        </div>

        {/* Recensioni */}
        <h3 className="mb-3 d-flex justify-content-between align-items-center titoli">
          <span>Recensioni</span>
          <Button
            variant="primary"
            onClick={() => navigate(`/recensioni/nuova/${id}`)}
          >
            Lascia una recensione
          </Button>
        </h3>

        {recensioni.length === 0 ? (
          <p>Nessuna recensione presente per questa struttura.</p>
        ) : (
          <ListGroup>
            {recensioni.map((rec) => (
              <ListGroup.Item key={rec.id}>
                <strong>{rec.autore}</strong>{" "}
                <span className="badge bg-success ms-2">{rec.voto}</span>
                <p className="mb-1">{rec.commento}</p>
                <small className="text-black">
                  {new Date(rec.data).toLocaleDateString()}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Body className="p-0">
          <img src={modalImg} alt="Ingrandita" style={{ width: "100%" }} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default StrutturaDettaglio
