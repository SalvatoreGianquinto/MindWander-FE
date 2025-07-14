import { useEffect, useState } from "react"
import axios from "axios"
import { Table, Button, Container, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import "../styles/BackOffice.css"

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
      const response = await axios.get("http://localhost:8080/strutture", {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("Strutture response:", response.data)

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
      await axios.delete(`http://localhost:8080/strutture/${id}`, {
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
        <h2>Gestione Strutture</h2>
        <Button variant="success" className="mb-3" onClick={goToNewStruttura}>
          + Aggiungi Nuova Struttura
        </Button>
        <Table striped bordered hover responsive>
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
                <td>{s.nome}</td>
                <td>{s.citta}</td>
                <td>{s.prezzo}€</td>
                <td>{s.moodAssociato}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/backoffice/modifica/${s.id}`)}
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
      </div>
    </div>
  )
}

export default BackOffice
