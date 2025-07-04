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
import { useState, useEffect } from "react"
import axios from "axios"

const CreaItinerarioPage = () => {
  const [titoloIti, setTitoloIti] = useState("")
  const [descrizioneIti, setDescrizioneIti] = useState("")
  const [steps, setSteps] = useState([
    { luogo: "", descrActivity: "", giornoPrevisto: 1 },
  ])
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [itinerari, setItinerari] = useState([])

  const token = localStorage.getItem("token")

  // 🔁 Recupero itinerari dell'utente
  useEffect(() => {
    fetchItinerari()
  }, [])

  const fetchItinerari = async () => {
    try {
      const response = await axios.get("/itineraries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setItinerari(response.data)
    } catch (err) {
      console.error("Errore nel recupero degli itinerari", err)
    }
  }

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps]
    updatedSteps[index][field] =
      field === "giornoPrevisto" ? parseInt(value) : value
    setSteps(updatedSteps)
  }

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { luogo: "", descrActivity: "", giornoPrevisto: steps.length + 1 },
    ])
  }

  const handleRemoveStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index)
    setSteps(updatedSteps)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg("")
    setErrorMsg("")
    try {
      const payload = {
        titoloIti,
        descrizioneIti,
        steps,
      }

      await axios.post("/itineraries/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setSuccessMsg("Itinerario creato con successo!")
      setTitoloIti("")
      setDescrizioneIti("")
      setSteps([{ luogo: "", descrActivity: "", giornoPrevisto: 1 }])
      fetchItinerari() // 🔄 aggiorna la lista
    } catch (err) {
      console.error(err)
      setErrorMsg("Errore durante la creazione dell'itinerario.")
    } finally {
      setLoading(false)
    }
  }

  // ✂️ Filtra solo quelli manuali
  const itinerariManuali = itinerari.filter((iti) => iti.automatic === false)

  return (
    <Container className="my-4">
      <h2>Crea un nuovo itinerario manualmente</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            value={titoloIti}
            onChange={(e) => setTitoloIti(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descrizione</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descrizioneIti}
            onChange={(e) => setDescrizioneIti(e.target.value)}
          />
        </Form.Group>

        <h4>Step dell'itinerario</h4>
        {steps.map((step, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Luogo</Form.Label>
                    <Form.Control
                      type="text"
                      value={step.luogo}
                      onChange={(e) =>
                        handleStepChange(index, "luogo", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Attività</Form.Label>
                    <Form.Control
                      type="text"
                      value={step.descrActivity}
                      onChange={(e) =>
                        handleStepChange(index, "descrActivity", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Giorno</Form.Label>
                    <Form.Control
                      type="number"
                      value={step.giornoPrevisto}
                      onChange={(e) =>
                        handleStepChange(
                          index,
                          "giornoPrevisto",
                          e.target.value
                        )
                      }
                      required
                      min={1}
                    />
                  </Form.Group>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveStep(index)}
                    disabled={steps.length === 1}
                  >
                    X
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
        <Button variant="secondary" onClick={handleAddStep} className="mb-3">
          Aggiungi Step
        </Button>

        <div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Crea Itinerario"
            )}
          </Button>
        </div>
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

      <h3 className="mt-5">Itinerari creati manualmente</h3>
      {itinerariManuali.length === 0 ? (
        <p>Nessun itinerario manuale trovato.</p>
      ) : (
        itinerariManuali.map((iti) => (
          <Card key={iti.id} className="mb-3">
            <Card.Body>
              <Card.Title>{iti.titoloIti}</Card.Title>
              <Card.Text>{iti.descrizioneIti}</Card.Text>
              <strong>Steps:</strong>
              <ul>
                {iti.steps.map((step, idx) => (
                  <li key={idx}>
                    Giorno {step.giornoPrevisto}: {step.luogo} -{" "}
                    {step.descrActivity}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  )
}

export default CreaItinerarioPage
