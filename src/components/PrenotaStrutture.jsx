import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/PrenotaPage.css"
import { Button } from "react-bootstrap"

const PrenotaPage = () => {
  const { strutturaId } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    dataInizio: "",
    dataFine: "",
    numeroOspiti: 1,
    note: "",
  })

  const [stanze, setStanze] = useState([])
  const [stanzaSelezionata, setStanzaSelezionata] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchStanze = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(
          `http://localhost:8080/strutture/${strutturaId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setStanze(response.data.stanze || [])
      } catch (err) {
        console.error("Errore nel caricamento delle stanze", err)
        setError("Errore nel caricamento delle stanze.")
      }
    }

    fetchStanze()
  }, [strutturaId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const token = localStorage.getItem("token")

    if (!stanzaSelezionata) {
      setError("Seleziona una stanza prima di procedere.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/prenotazioni",
        {
          strutturaId,
          stanzaId: stanzaSelezionata,
          dataInizio: form.dataInizio,
          dataFine: form.dataFine,
          numeroOspiti: Number(form.numeroOspiti),
          note: form.note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setSuccess(true)
      setForm({ dataInizio: "", dataFine: "", numeroOspiti: 1, note: "" })
      setStanzaSelezionata("")
      setTimeout(() => {
        navigate("/dashboard", { state: { nuovaPrenotazione: response.data } })
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Errore durante la prenotazione")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prenotazione-wrapper">
      <div className="prenotazione-card">
        <Button
          variant="secondary"
          className="mb-3"
          onClick={() => navigate(-1)}
        >
          Indietro
        </Button>
        <h2>Effettua una prenotazione</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Prenotazione effettuata con successo!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="dataInizio" className="form-label text-black">
              Data Inizio
            </label>
            <input
              type="date"
              id="dataInizio"
              name="dataInizio"
              className="form-control"
              value={form.dataInizio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="dataFine" className="form-label text-black">
              Data Fine
            </label>
            <input
              type="date"
              id="dataFine"
              name="dataFine"
              className="form-control"
              value={form.dataFine}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="numeroOspiti" className="form-label text-black">
              Numero Ospiti
            </label>
            <input
              type="number"
              id="numeroOspiti"
              name="numeroOspiti"
              className="form-control"
              value={form.numeroOspiti}
              min={1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="stanza" className="form-label text-black">
              Seleziona la stanza
            </label>
            <select
              id="stanza"
              className="form-control"
              value={stanzaSelezionata}
              onChange={(e) => setStanzaSelezionata(e.target.value)}
              required
            >
              <option value="">-- Seleziona una stanza --</option>
              {stanze.map((stanza) => (
                <option key={stanza.id} value={stanza.id}>
                  {stanza.nome || `Stanza #${stanza.id}`} – €{stanza.prezzo}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="note" className="form-label text-black">
              Note
            </label>
            <textarea
              id="note"
              name="note"
              className="form-control"
              value={form.note}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Prenotando..." : "Prenota"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PrenotaPage
