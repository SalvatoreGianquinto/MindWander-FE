import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Spinner } from "react-bootstrap"

const ModerazioneRecensioni = () => {
  const [recensioni, setRecensioni] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchRecensioni()
  }, [])

  const fetchRecensioni = async () => {
    try {
      const response = await axios.get("http://localhost:8080/recensioni/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecensioni(response.data)
    } catch (error) {
      console.error("Errore nel recupero delle recensioni", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteRecensione = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa recensione?"))
      return
    try {
      await axios.delete(`http://localhost:8080/recensioni/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecensioni((prev) => prev.filter((r) => r.id !== id))
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

  return (
    <div>
      <h2 className="mb-3">Moderazione Recensioni</h2>
      <table className="tabella-backoffice">
        <thead>
          <tr>
            <th>Utente</th>
            <th>Voto</th>
            <th>Commento</th>
            <th>Data</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {recensioni.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Nessuna recensione disponibile
              </td>
            </tr>
          ) : (
            recensioni.map((r) => (
              <tr key={r.id}>
                <td data-label="Utente">{r.autore}</td>
                <td data-label="Voto">{r.voto}</td>
                <td data-label="Commento">{r.commento}</td>
                <td data-label="Data">
                  {new Date(r.data).toLocaleDateString()}
                </td>
                <td data-label="Azioni">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteRecensione(r.id)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
export default ModerazioneRecensioni
