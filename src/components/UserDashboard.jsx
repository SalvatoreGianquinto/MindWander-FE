import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import "../styles/UserDashboard.css"

const UserDashboard = () => {
  const location = useLocation()
  const nuovaPrenotazione = location.state?.nuovaPrenotazione

  const [prenotazioni, setPrenotazioni] = useState([])
  const [recensioni, setRecensioni] = useState([])
  const [itinerari, setItinerari] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("token")
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        }

        const prenotazioniRes = await axios.get(
          "http://localhost:8080/prenotazioni/miei",
          config
        )
        setPrenotazioni(
          Array.isArray(prenotazioniRes.data) ? prenotazioniRes.data : []
        )

        console.log("prenotazioniRes.data:", prenotazioniRes.data)

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
        setError(err.response?.data?.message || "Errore nel caricamento dati")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (nuovaPrenotazione) {
      setPrenotazioni((prev) => [nuovaPrenotazione, ...prev])
      console.log(nuovaPrenotazione)
    }
  }, [nuovaPrenotazione])

  if (loading) return <div>Caricamento...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-wrapper">
        <h2>Le tue prenotazioni</h2>
        {prenotazioni.length === 0 ? (
          <p>Nessuna prenotazione trovata</p>
        ) : (
          <ul>
            {prenotazioni.map((p) => (
              <li key={p.id}>
                {p.struttura.nome} dal{" "}
                {new Date(p.dataInizio).toLocaleDateString()} al{" "}
                {new Date(p.dataFine).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}

        <h2>Le tue recensioni</h2>
        {recensioni.length === 0 ? (
          <p>Nessuna recensione trovata</p>
        ) : (
          <ul>
            {recensioni.map((r) => (
              <li key={r.id}>{r.testo}</li>
            ))}
          </ul>
        )}

        <h2>I tuoi itinerari</h2>
        {itinerari.length === 0 ? (
          <p>Nessun itinerario trovato</p>
        ) : (
          <ul>
            {itinerari.map((i) => (
              <li key={i.id}>{i.titoloIti}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
