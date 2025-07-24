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
import "../styles/Itinerari.css"

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
  const [deleting, setDeleting] = useState(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      fetchUserItineraries()
    }
  }, [token])

  const fetchUserItineraries = async () => {
    try {
      const response = await axios.get("http://localhost:8080/itineraries", {
        headers: { Authorization: `Bearer ${token}` },
      })

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
      const res = await axios.post(
        "http://localhost:8080/itineraries/generate",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
        automatic: true,
        editable: false,
        steps: generatedItinerary.steps.map((step) => ({
          luogo: step.luogo,
          descrActivity: step.descrActivity,
          giornoPrevisto: step.giornoPrevisto,
        })),
      }

      await axios.post(
        "http://localhost:8080/itineraries/create",
        savePayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setSuccessMsg("Itinerario salvato con successo!")
      fetchUserItineraries()
    } catch (err) {
      console.error("Errore nel salvataggio dell'itinerario:", err)
      setErrorMsg("Errore nel salvataggio dell'itinerario.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo itinerario?"))
      return
    setDeleting(id)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      await axios.delete(`http://localhost:8080/itineraries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSuccessMsg("Itinerario eliminato con successo.")
      fetchUserItineraries()
    } catch (err) {
      console.error("Errore nell'eliminazione dell'itinerario:", err)
      setErrorMsg("Errore nell'eliminazione dell'itinerario.")
    } finally {
      setDeleting(null)
    }
  }

  const itinerariAutomatici = userItineraries.filter((iti) => iti.automatic)
  return (
    <div className="wrapper-cont">
      <Container fluid>
        <Row className="justify-content-center">
          <Col
            md={3}
            className="d-none d-md-flex flex-column justify-content-center align-items-start px-4"
          >
            <div className="quote-box mb-5">
              <blockquote className="blockquote">
                <p>
                  "Non smettere mai di esplorare: ogni viaggio ti rivela
                  qualcosa di nuovo."
                </p>
                <footer className="blockquote-footer mt-2">Anonimo</footer>
              </blockquote>
            </div>
            <div className="quote-box">
              <blockquote className="blockquote">
                <p>
                  "Chi torna da un viaggio non è mai la stessa persona che è
                  partita."
                </p>
                <footer className="blockquote-footer mt-2">
                  Proverbio cinese
                </footer>
              </blockquote>
            </div>
          </Col>

          <Col md={6} className="px-4">
            <h1 className="display-5 text-center mb-4 text-black">
              Genera il tuo itinerario ideale
            </h1>
            <p className="lead text-center text-black mb-5">
              Un clic, una città, un'esperienza da ricordare.
            </p>

            <Form onSubmit={handleGenerate}>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Città</Form.Label>
                    <Form.Control
                      className="form"
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
                    <Form.Label>Giorni</Form.Label>
                    <Form.Control
                      className="form"
                      type="number"
                      name="days"
                      min={1}
                      value={formData.days}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Mood</Form.Label>
                    <Form.Control
                      className="form"
                      type="text"
                      name="mood"
                      placeholder="Relax, avventura..."
                      value={formData.mood}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                type="submit"
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Genera Itinerario"
                )}
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
              <Card className="mt-4 custom-card">
                <Card.Body className="custom-card-body">
                  <Card.Title className="card-title-automatic">
                    {generatedItinerary.titoloIti}
                  </Card.Title>
                  <Card.Text>{generatedItinerary.descrizioneIti}</Card.Text>
                  <ul className="text-black">
                    {generatedItinerary.steps.map((step, idx) => (
                      <li key={idx}>
                        <strong>Giorno {step.giornoPrevisto}:</strong>{" "}
                        {step.luogo} - {step.descrActivity}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="btn-secondary mt-3"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Salva Itinerario"
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    className="mt-3 ms-2"
                    onClick={() => setGeneratedItinerary(null)}
                  >
                    Annulla
                  </Button>
                </Card.Body>
              </Card>
            )}

            <h3 className="mt-5 titolo-h3">Itinerari automatici salvati</h3>
            {itinerariAutomatici.length === 0 ? (
              <p className="paragrafo">Nessun itinerario automatico trovato.</p>
            ) : (
              itinerariAutomatici.map((iti) => (
                <Card key={iti.id} className="mb-3 custom-card">
                  <Card.Body className="custom-card-body">
                    <Card.Title>{iti.titoloIti}</Card.Title>
                    <Card.Text>{iti.descrizioneIti}</Card.Text>
                    <strong className="text-dark">Steps:</strong>
                    <ul className="text-dark">
                      {iti.steps.map((step, i) => (
                        <li key={i}>
                          Giorno {step.giornoPrevisto}: {step.luogo} -{" "}
                          {step.descrActivity}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(iti.id)}
                      disabled={deleting === iti.id}
                    >
                      {deleting === iti.id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Elimina"
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>

          <Col
            md={3}
            className="d-none d-md-flex flex-column justify-content-center align-items-start px-4"
          >
            <div className="quote-box mb-5">
              <blockquote className="blockquote">
                <p>
                  "Il viaggio è l’unica cosa che compri che ti rende più ricco."
                </p>
                <footer className="blockquote-footer mt-2">Anonimo</footer>
              </blockquote>
            </div>
            <div className="quote-box">
              <blockquote className="blockquote">
                <p>
                  "Viaggiare significa scoprire che tutti hanno torto riguardo
                  agli altri paesi."
                </p>
                <footer className="blockquote-footer mt-2">
                  Aldous Huxley
                </footer>
              </blockquote>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AutomaticItinerarioPage
