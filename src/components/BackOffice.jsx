import { useEffect, useState } from "react"
import { Table, Button, Spinner, Nav, Tab } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import UserManagement from "./UserManagment"
import ModerazioneRecensioni from "./ModerazioneRecensioni"
import GestioneItinerari from "./GestioneItinerari"
import GestioneServiziExtra from "./GestioneServiziExtra"
import "../styles/BackOffice.css"
import api from "../api"

const BackOffice = () => {
  const [strutture, setStrutture] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    fetchStrutture()
  }, [])

  const fetchStrutture = async () => {
    try {
      const response = await api.get("/strutture", {})
      setStrutture(response.data)
    } catch (error) {
      console.error("Errore nel recupero delle strutture", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteStruttura = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa struttura?"))
      return
    try {
      await api.delete(`/strutture/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStrutture((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Errore durante l'eliminazione", error)
    }
  }

  const goToNewStruttura = () => {
    navigate("/backoffice/nuova-struttura")
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="common-page-wrapper">
      <div className="common-wrapper">
        <h2>Backoffice</h2>
        <Tab.Container defaultActiveKey="strutture">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="strutture" className="nav-link-back">
                Gestione Strutture
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="utenti" className="nav-link-back">
                Gestione Utenti
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="recensioni" className="nav-link-back">
                Moderazione Recensioni
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="itinerari" className="nav-link-back">
                Gestione Itinerari
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="serviziExtra" className="nav-link-back">
                Gestione Servizi Extra
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="strutture">
              <Button
                variant="success"
                className="mb-3"
                onClick={goToNewStruttura}
              >
                + Aggiungi Nuova Struttura
              </Button>
              <Table bordered hover responsive className="tabella-backoffice">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Città</th>
                    <th>Prezzo</th>
                    <th>Mood</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {strutture.map((s) => (
                    <tr key={s.id}>
                      <td data-label="Nome">{s.nome}</td>
                      <td data-label="Città">{s.citta}</td>
                      <td data-label="Prezzo">{s.prezzo}€</td>
                      <td data-label="Mood">{s.moodAssociato}</td>
                      <td data-label="Azioni">
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() =>
                            navigate(`/backoffice/modifica/${s.id}`)
                          }
                        >
                          Modifica
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteStruttura(s.id)}
                        >
                          Elimina
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab.Pane>

            <Tab.Pane eventKey="utenti">
              <UserManagement />
            </Tab.Pane>

            <Tab.Pane eventKey="recensioni">
              <ModerazioneRecensioni />
            </Tab.Pane>

            <Tab.Pane eventKey="itinerari">
              <GestioneItinerari />
            </Tab.Pane>

            <Tab.Pane eventKey="serviziExtra">
              <GestioneServiziExtra />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  )
}

export default BackOffice
