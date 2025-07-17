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
import "../styles/Itinerari.css"

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
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const token = localStorage.getItem("token")

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

    const payload = {
      titoloIti,
      descrizioneIti,
      steps,
      automatic: false,
    }

    try {
      if (editMode) {
        await axios.put(`/itineraries/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSuccessMsg("Itinerario modificato con successo!")
      } else {
        await axios.post("/itineraries/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSuccessMsg("Itinerario creato con successo!")
      }

      setTitoloIti("")
      setDescrizioneIti("")
      setSteps([{ luogo: "", descrActivity: "", giornoPrevisto: 1 }])
      setEditMode(false)
      setEditId(null)
      fetchItinerari()
    } catch (err) {
      console.error(err)
      setErrorMsg("Errore durante il salvataggio dell'itinerario.")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (iti) => {
    setEditMode(true)
    setEditId(iti.id)
    setTitoloIti(iti.titoloIti)
    setDescrizioneIti(iti.descrizioneIti)
    setSteps(
      iti.steps.map((s) => ({
        luogo: s.luogo,
        descrActivity: s.descrActivity,
        giornoPrevisto: s.giornoPrevisto,
      }))
    )
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await axios.delete(`/itineraries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchItinerari()
    } catch (err) {
      console.error("Errore durante l'eliminazione dell'itinerario", err)
    } finally {
      setDeleting(null)
    }
  }

  const itinerariManuali = itinerari.filter((iti) => iti.automatic === false)

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
                <p>"Non si fa un viaggio. Il viaggio ci fa e ci disfa."</p>
                <footer className="blockquote-footer mt-2">
                  David Le Breton
                </footer>
              </blockquote>
            </div>
            <div className="quote-box">
              <blockquote className="blockquote">
                <p>
                  "Il mondo è un libro e chi non viaggia ne conosce solo una
                  pagina."
                </p>
                <footer className="blockquote-footer mt-2">
                  Sant'Agostino
                </footer>
              </blockquote>
            </div>
          </Col>

          <Col md={6} className="px-4">
            <h1 className="display-5 text-center mb-4 text-black">
              Crea il tuo viaggio indimenticabile
            </h1>
            <p className="lead text-center text-muted mb-5">
              Ogni passo è un ricordo. Dai vita al tuo itinerario, un’emozione
              alla volta.
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 text-black">
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  className="form"
                  type="text"
                  value={titoloIti}
                  onChange={(e) => setTitoloIti(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 text-black">
                <Form.Label>Descrizione</Form.Label>
                <Form.Control
                  className="form"
                  as="textarea"
                  rows={3}
                  value={descrizioneIti}
                  onChange={(e) => setDescrizioneIti(e.target.value)}
                />
              </Form.Group>

              <h4>Step dell'itinerario</h4>
              {steps.map((step, index) => (
                <Card key={index} className="mb-3 custom-card">
                  <Card.Body className="custom-card-body">
                    <Row>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Luogo</Form.Label>
                          <Form.Control
                            className="form"
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
                            className="form"
                            type="text"
                            value={step.descrActivity}
                            onChange={(e) =>
                              handleStepChange(
                                index,
                                "descrActivity",
                                e.target.value
                              )
                            }
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Giorno</Form.Label>
                          <Form.Control
                            className="form"
                            type="number"
                            value={step.giornoPrevisto}
                            onChange={(e) =>
                              handleStepChange(
                                index,
                                "giornoPrevisto",
                                e.target.value
                              )
                            }
                            min={1}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={1} className="d-flex align-items-end mt-2">
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

              <Button
                variant="secondary"
                onClick={handleAddStep}
                className="mb-3"
              >
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
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => startEdit(iti)}
                    >
                      Modifica
                    </Button>
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
                  "Viaggiare ti lascia senza parole, poi ti trasforma in un
                  narratore."
                </p>
                <footer className="blockquote-footer mt-2">Ibn Battuta</footer>
              </blockquote>
            </div>
            <div className="quote-box">
              <blockquote className="blockquote">
                <p>
                  "Il viaggio è l’unica cosa che compri che ti rende più ricco."
                </p>
                <footer className="blockquote-footer mt-2">Anonimo</footer>
              </blockquote>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CreaItinerarioPage
