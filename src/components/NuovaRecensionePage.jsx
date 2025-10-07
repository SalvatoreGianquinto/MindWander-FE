import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Form, Button, Alert, Spinner } from "react-bootstrap"
import "../styles/NuovaRecensionePage.css"
import api from "../api"

function NuovaRecensionePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [voto, setVoto] = useState(5)
  const [commento, setCommento] = useState("")
  const [loading, setLoading] = useState(false)
  const [errore, setErrore] = useState("")
  const [successo, setSuccesso] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    if (!token) {
      setErrore("Sessione scaduta. Effettua nuovamente il login.")
      return
    }

    setLoading(true)
    setErrore("")
    try {
      await api.post("/recensioni", {
        strutturaId: id,
        voto,
        commento,
      })
      setSuccesso(true)
      setTimeout(() => navigate(`/strutture/${id}`), 1500)
    } catch (err) {
      setErrore(
        err.response?.data?.message ||
          "Errore durante l'invio della recensione."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="nuova-recensione-wrapper">
      <div className="nuova-recensione-container">
        <Button
          variant="secondary"
          className="mb-3"
          onClick={() => navigate(-1)}
        >
          Indietro
        </Button>
        <h2>Lascia una recensione</h2>

        {errore && <Alert variant="danger">{errore}</Alert>}
        {successo && (
          <Alert variant="success">Recensione inviata con successo!</Alert>
        )}

        <Form onSubmit={handleSubmit} className="nuova-recensione-form">
          <Form.Group className="mb-3">
            <Form.Label>Voto</Form.Label>
            <Form.Select
              value={voto}
              onChange={(e) => setVoto(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4 commento">
            <Form.Label>Commento</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={commento}
              onChange={(e) => setCommento(e.target.value)}
              required
              placeholder="Scrivi qui la tua esperienza..."
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Invio in corso...
                </>
              ) : (
                "Invia recensione"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default NuovaRecensionePage
