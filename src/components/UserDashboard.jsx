import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, ListGroup, Spinner, Alert } from "react-bootstrap"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import "../styles/UserDashboard.css"

const UserDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const nuovaPrenotazione = location.state?.nuovaPrenotazione

  const [userInfo, setUserInfo] = useState(null)
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    username: "",
    password: "",
  })
  const [isEditing, setIsEditing] = useState(false)

  const [prenotazioni, setPrenotazioni] = useState([])
  const [recensioni, setRecensioni] = useState([])
  const [itinerari, setItinerari] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

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
        setFormData({
          nome: userRes.data.nome || "",
          cognome: userRes.data.cognome || "",
          email: userRes.data.email || "",
          username: userRes.data.username || "",
          password: "",
        })

        const prenotazioniRes = await axios.get(
          "http://localhost:8080/prenotazioni/miei",
          config
        )
        setPrenotazioni(
          Array.isArray(prenotazioniRes.data) ? prenotazioniRes.data : []
        )

        console.log("Prenotazioni utente:", prenotazioniRes.data)

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

  const handleCancellaPrenotazione = async (id) => {
    if (!window.confirm("Sei sicuro di voler cancellare questa prenotazione?"))
      return

    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      await axios.delete(`http://localhost:8080/prenotazioni/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setPrenotazioni((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      alert(error.response?.data?.message || "Errore durante la cancellazione")
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    if (!token) return navigate("/login")

    setSaving(true)
    try {
      await axios.put(`http://localhost:8080/users/${userInfo.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("Profilo aggiornato con successo!")

      setUserInfo((prev) => ({
        ...prev,
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        username: formData.username,
      }))
      setIsEditing(false)
    } catch (err) {
      alert(
        err.response?.data?.message || "Errore durante aggiornamento profilo"
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-wrapper">
        {userInfo && (
          <div className="user-info mb-5 p-3 rounded shadow-sm bg-light">
            <h2 className="mb-3">Profilo Utente</h2>
            {!isEditing ? (
              <>
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
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={() => setIsEditing(true)}
                >
                  Modifica profilo
                </Button>
              </>
            ) : (
              <form onSubmit={handleProfileUpdate} className="mt-3">
                <div className="mb-2">
                  <label>Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Cognome</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.cognome}
                    onChange={(e) =>
                      setFormData({ ...formData, cognome: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Nuova password (opzionale)</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div className="d-flex gap-2 mt-3">
                  <Button type="submit" variant="success" disabled={saving}>
                    {saving ? "Salvataggio..." : "Salva modifiche"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Annulla
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        <h2>Le tue prenotazioni</h2>
        {prenotazioni.length === 0 ? (
          <p>Nessuna prenotazione trovata</p>
        ) : (
          <ListGroup>
            {prenotazioni.map((p) => {
              console.log(p)

              const inizio = new Date(p.dataInizio)
              const fine = new Date(p.dataFine)
              const diffMs = Math.abs(fine - inizio)
              const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

              const prezzoTotale = p.prezzoTotale || 0

              return (
                <ListGroup.Item
                  key={p.id}
                  className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
                >
                  <div>
                    <strong>Struttura:</strong>{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {p.nomeStruttura || "N/D"}
                    </span>
                    <br />
                    <strong>Stanza:</strong>{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {p.nomeStanza || "N/D"}
                    </span>
                    <br />
                    <strong>Data inizio:</strong>{" "}
                    {inizio.toLocaleDateString("it-IT")}
                    <br />
                    <strong>Data fine:</strong>{" "}
                    {fine.toLocaleDateString("it-IT")}
                    <br />
                    <strong>Giorni:</strong> {diffDays}
                    <br />
                    <strong>Prezzo totale:</strong> €{prezzoTotale}
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancellaPrenotazione(p.id)}
                  >
                    Cancella
                  </Button>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        )}

        <h2 className="mt-5">Le tue recensioni</h2>
        {recensioni.length === 0 ? (
          <p>Nessuna recensione trovata</p>
        ) : (
          <ListGroup>
            {recensioni.map((r) => (
              <ListGroup.Item key={r.id}>
                <strong>Struttura:</strong> {r.struttura?.nome || "N/D"}
                <br />
                <strong>Voto:</strong> {r.voto} / 5
                <br />
                <strong>Commento:</strong> {r.commento}
                <br />
                <small>
                  Data: {new Date(r.dataRecensione).toLocaleDateString("it-IT")}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <h2 className="mt-5">I tuoi itinerari</h2>
        {itinerari.length === 0 ? (
          <p>Nessun itinerario trovato</p>
        ) : (
          <ListGroup>
            {itinerari.map((i) => (
              <ListGroup.Item key={i.id}>
                <strong>Nome:</strong> {i.nome}
                <br />
                <strong>Descrizione:</strong> {i.descrizione}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
