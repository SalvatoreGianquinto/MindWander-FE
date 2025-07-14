import { useEffect, useState } from "react"
import axios from "axios"
import { Table, Button, Spinner } from "react-bootstrap"

const GestioneItinerari = () => {
  const [itinerari, setItinerari] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchItinerari()
  }, [])

  const fetchItinerari = async () => {
    try {
      const response = await axios.get("http://localhost:8080/itineraries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setItinerari(response.data)
    } catch (error) {
      console.error("Errore nel recupero degli itinerari", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteItinerario = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo itinerario?"))
      return

    try {
      await axios.delete(`http://localhost:8080/itineraries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setItinerari((prev) => prev.filter((i) => i.id !== id))
    } catch (error) {
      console.error("Errore durante l'eliminazione", error)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  if (itinerari.length === 0) {
    return <p className="mt-3">Nessun itinerario salvato.</p>
  }

  return (
    <div>
      <h2 className="mb-3">Gestione Itinerari</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Descrizione</th>
            <th>Automatico</th>
            <th>Modificabile</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {itinerari.map((it) => (
            <tr key={it.id}>
              <td>{it.titoloIti}</td>
              <td>{it.descrizioneIti}</td>
              <td>{it.automatic ? "Sì" : "No"}</td>
              <td>{it.editable ? "Sì" : "No"}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteItinerario(it.id)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default GestioneItinerari
