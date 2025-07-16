import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ListGroup } from "react-bootstrap"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import "../styles/UserDashboard.css"

const UserDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const nuovaPrenotazione = location.state?.nuovaPrenotazione

  const [userInfo, setUserInfo] = useState(null)
  const [prenotazioni, setPrenotazioni] = useState([])
  const [recensioni, setRecensioni] = useState([])
  const [itinerari, setItinerari] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      setLoading(true)
      setError(null)
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        }

        const decoded = jwtDecode(token)
        const userId = decoded.id || decoded.userId || decoded.sub

        const userRes = await axios.get(
          `http://localhost:8080/users/${userId}`,
          config
        )
        setUserInfo(userRes.data)

        const prenotazioniRes = await axios.get(
          "http://localhost:8080/prenotazioni/miei",
          config
        )
        setPrenotazioni(
          Array.isArray(prenotazioniRes.data) ? prenotazioniRes.data : []
        )

        const recensioniRes = await axios.get(
          "http://localhost:8080/recensioni/mie",
          config
        )
        setRecensioni(
          Array.isArray(recensioniRes.data) ? recensioniRes.data : []
        )

        const itinerariRes = await axios.get(
          "http://localhost:8080/itineraries",
          config
        )
        setItinerari(Array.isArray(itinerariRes.data) ? itinerariRes.data : [])
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        } else {
          setError(err.response?.data?.message || "Errore nel caricamento dati")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  useEffect(() => {
    if (nuovaPrenotazione) {
      setPrenotazioni((prev) => [nuovaPrenotazione, ...prev])
    }
  }, [nuovaPrenotazione])

  if (loading) return <div>Caricamento...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-wrapper">
        {userInfo && (
          <div className="user-info mb-5 p-3 rounded shadow-sm bg-light">
            <h2 className="mb-3">Profilo Utente</h2>
            <ListGroup>
              <ListGroup.Item>
                <strong>Username:</strong> {userInfo.username}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Nome:</strong> {userInfo.nome}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Cognome:</strong> {userInfo.cognome}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Email:</strong> {userInfo.email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Ruoli:</strong>{" "}
                {Array.isArray(userInfo.ruoli)
                  ? userInfo.ruoli.join(", ")
                  : userInfo.ruoli}
              </ListGroup.Item>
            </ListGroup>
          </div>
        )}

        <h2>Le tue prenotazioni</h2>
        {prenotazioni.length === 0 ? (
          <p>Nessuna prenotazione trovata</p>
        ) : (
          <ListGroup>
            {prenotazioni.map((p) => (
              <ListGroup.Item key={p.id}>
                {p.struttura.nome} dal{" "}
                {new Date(p.dataInizio).toLocaleDateString()} al{" "}
                {new Date(p.dataFine).toLocaleDateString()} -{" "}
                <strong>
                  Prezzo totale: €{" "}
                  {p.prezzoTotale !== undefined && p.prezzoTotale !== null
                    ? p.prezzoTotale.toFixed(2)
                    : "N/A"}
                </strong>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <h2 className="mt-4">Le tue recensioni</h2>
        {recensioni.length === 0 ? (
          <p>Nessuna recensione trovata</p>
        ) : (
          <ListGroup>
            {recensioni.map((r) => (
              <ListGroup.Item key={r.id}>
                <strong>{r.autore}</strong>: {r.commento} — voto: {r.voto}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <h2 className="mt-4">I tuoi itinerari</h2>
        {itinerari.length === 0 ? (
          <p>Nessun itinerario trovato</p>
        ) : (
          <ListGroup>
            {itinerari.map((i) => (
              <ListGroup.Item
                key={i.id}
                action
                onClick={() => navigate(`/itineraries`)}
                style={{ cursor: "pointer" }}
              >
                {i.titoloIti}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
