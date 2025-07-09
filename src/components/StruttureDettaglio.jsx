import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, ListGroup, Spinner } from "react-bootstrap"
import "../styles/StruttureDettaglio.css"

function StrutturaDettaglio() {
  const { id } = useParams()
  const [struttura, setStruttura] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recensioni, setRecensioni] = useState([])
  const [mediaVoto, setMediaVoto] = useState(0)

  useEffect(() => {
    const fetchStruttura = async () => {
      try {
        const token = localStorage.getItem("token")

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

        console.log("Recensioni complete:", recensioniRes.data)
        console.log(
          "ID recensioni:",
          recensioniRes.data.map((r) => r.id)
        )

        setStruttura(strutturaRes.data)
        setRecensioni(recensioniRes.data)
        setMediaVoto(mediaRes.data || 0)
      } catch (err) {
        console.error(
          "Errore nel caricamento della struttura o recensioni:",
          err
        )
      } finally {
        setLoading(false)
      }
    }

    fetchStruttura()
  }, [id])

  if (loading) return <Spinner animation="border" className="mt-5" />

  if (!struttura)
    return <p className="text-center mt-5">Struttura non trovata</p>

  return (
    <div className="container my-5">
      <h2 className="text-center mb-2">{struttura.nome}</h2>

      <Card className="shadow-lg border-0 mb-4">
        <Card.Img
          variant="top"
          src={
            struttura.immaginiUrl?.[0] || "https://via.placeholder.com/800x400"
          }
          alt={struttura.nome}
          className="img-fluid"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />

        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-info text-dark">
              {struttura.moodAssociato}
            </span>
            <span className="badge bg-success fs-5 px-3 py-2">
              {mediaVoto.toFixed(1)}
            </span>
          </div>

          <div className="mb-3 text-center">
            <span className="badge bg-secondary">{struttura.categoria}</span>
          </div>

          <div className="mb-3">
            <div>
              <strong>Città:</strong> {struttura.citta}
            </div>
            <div>
              <strong>Prezzo per notte:</strong>{" "}
              <span className="text-success fw-bold">€{struttura.prezzo}</span>
            </div>
            <div>
              <strong>Descrizione:</strong>{" "}
              {struttura.descrizione ? struttura.descrizione : "N/A"}
            </div>
          </div>

          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary">Prenota ora</Button>
          </div>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Recensioni</h3>

      {recensioni.length === 0 ? (
        <p>Nessuna recensione presente per questa struttura.</p>
      ) : (
        <ListGroup>
          {recensioni.map((rec) => (
            <ListGroup.Item key={rec.id}>
              <strong>{rec.autore}</strong>{" "}
              <span className="badge bg-success ms-2">{rec.voto}</span>
              <p className="mb-1">{rec.commento}</p>
              <small className="text-muted">
                {new Date(rec.data).toLocaleDateString()}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}

export default StrutturaDettaglio
