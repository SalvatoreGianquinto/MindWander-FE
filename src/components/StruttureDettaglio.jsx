import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Spinner } from "react-bootstrap"
import "../styles/StruttureDettaglio.css"

function StrutturaDettaglio() {
  const { id } = useParams()
  const [struttura, setStruttura] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStruttura = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`http://localhost:8080/strutture/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setStruttura(res.data)
      } catch (err) {
        console.error("Errore nel caricamento della struttura:", err)
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
      <h2 className="text-center mb-4">{struttura.nome}</h2>

      <Card className="shadow-lg border-0">
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
          <div className="mb-3">
            <span className="badge bg-info text-dark me-2">
              {struttura.moodAssociato}
            </span>
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

          <div className="d-flex justify-content-end">
            <Button variant="primary">Prenota ora</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default StrutturaDettaglio
