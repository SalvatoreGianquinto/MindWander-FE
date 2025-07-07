import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap"
import { useEffect, useState } from "react"
import axios from "axios"
import "../styles/AutomaticItinerario.css"

const AutomaticItinerarioPage = () => {
  const [formData, setFormData] = useState({
    citta: "",
    days: 1,
    mood: "",
  })
  const [generatedItinerary, setGeneratedItinerary] = useState(null)
  const [userItineraries, setUserItineraries] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      fetchUserItineraries()
    }
  }, [token])

  const fetchUserItineraries = async () => {
    try {
      const response = await axios.get("/itineraries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Dati ricevuti:", response.data)

      if (Array.isArray(response.data)) {
        setUserItineraries(response.data)
      } else {
        console.warn("La risposta non è un array:", response.data)
        setUserItineraries([])
      }
    } catch (err) {
      console.error("Errore nel recupero itinerari:", err)
      setUserItineraries([])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")
    try {
      const res = await axios.post("/itineraries/generate", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setGeneratedItinerary(res.data)
    } catch (err) {
      console.error("Errore nella generazione dell'itinerario:", err)
      setErrorMsg("Errore nella generazione dell'itinerario.")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!generatedItinerary || saving) return

    setSaving(true)
    setErrorMsg("")
    setSuccessMsg("")
    setGeneratedItinerary(null)

    try {
      const savePayload = {
        titoloIti: generatedItinerary.titoloIti || "Itinerario automatico",
        descrizioneIti: generatedItinerary.descrizioneIti || "",
        steps: generatedItinerary.steps.map((step) => ({
          luogo: step.luogo,
          descrActivity: step.descrActivity,
          giornoPrevisto: step.giornoPrevisto,
        })),
      }

      await axios.post("/itineraries/create", savePayload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSuccessMsg("Itinerario salvato con successo!")
      fetchUserItineraries()
    } catch (err) {
      console.error("Errore nel salvataggio dell'itinerario:", err)
      setErrorMsg("Errore nel salvataggio dell'itinerario.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="my-4 automatic-itinerary-page">
      <h2 className="mb-3">Genera un Itinerario</h2>
      <Form onSubmit={handleGenerate}>
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Città</Form.Label>
              <Form.Control
                type="text"
                name="citta"
                value={formData.citta}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Numero di Giorni</Form.Label>
              <Form.Control
                type="number"
                name="days"
                min={1}
                value={formData.days}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Stile di Viaggio (Mood)</Form.Label>
              <Form.Control
                type="text"
                name="mood"
                placeholder="Es: natura, avventura, meditazione..."
                value={formData.mood}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" className="mt-3" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Genera"}
        </Button>
      </Form>

      {errorMsg && (
        <Alert variant="danger" className="mt-3">
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" className="mt-3">
          {successMsg}
        </Alert>
      )}

      {generatedItinerary && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>{generatedItinerary.titoloIti}</Card.Title>
            <Card.Text>{generatedItinerary.descrizioneIti}</Card.Text>
            <ul>
              {generatedItinerary.steps.map((step, index) => (
                <li key={index}>
                  <strong>Giorno {step.giornoPrevisto}:</strong> {step.luogo} -{" "}
                  {step.descrActivity}
                </li>
              ))}
            </ul>
            <Button
              variant="success"
              onClick={handleSave}
              disabled={saving}
              className="mt-2"
            >
              {saving ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Salva Itinerario"
              )}
            </Button>
          </Card.Body>
        </Card>
      )}

      <h3 className="mt-5">I tuoi itinerari salvati</h3>
      {userItineraries.length > 0 ? (
        userItineraries.map((iti) => (
          <Card className="my-3" key={iti.id}>
            <Card.Body>
              <Card.Title>{iti.titoloIti}</Card.Title>
              <Card.Text>{iti.descrizioneIti}</Card.Text>
              <ul>
                {iti.steps.map((step, i) => (
                  <li key={i}>
                    Giorno {step.giornoPrevisto}: {step.luogo} -{" "}
                    {step.descrActivity}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>Nessun itinerario salvato.</p>
      )}
    </Container>
  )
}

export default AutomaticItinerarioPage
