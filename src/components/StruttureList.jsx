import React, { useEffect, useState } from "react"
import axios from "axios"
import FiltriStrutture from "../components/FiltriStrutture"
import { Card, Button, Row, Col } from "react-bootstrap"
import "../styles/StruttureList.css"
import { Link } from "react-router-dom"

const StruttureList = () => {
  const [strutture, setStrutture] = useState([])

  const fetchStrutture = async (filtri = {}) => {
    try {
      const token = localStorage.getItem("token")

      const params = {}
      if (filtri.citta) params.citta = filtri.citta
      if (filtri.mood) params.mood = filtri.mood
      if (filtri.minPrezzo) params.minPrezzo = filtri.minPrezzo
      if (filtri.maxPrezzo) params.maxPrezzo = filtri.maxPrezzo

      const res = await axios.get("http://localhost:8080/strutture/filtrate", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const struttureConMedia = await Promise.all(
        res.data.map(async (s) => {
          try {
            const mediaRes = await axios.get(
              `http://localhost:8080/recensioni/struttura/${s.id}/media`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            return { ...s, mediaVoto: mediaRes.data }
          } catch {
            return { ...s, mediaVoto: 0 }
          }
        })
      )

      setStrutture(struttureConMedia)
    } catch (error) {
      console.error("Errore nel recupero strutture:", error)
    }
  }

  useEffect(() => {
    fetchStrutture()
  }, [])

  return (
    <div className="strutture-wrapper">
      <Row className="gx-4">
        <Col md={3}>
          <FiltriStrutture onFiltra={fetchStrutture} />
        </Col>
        <Col md={9}>
          <Row>
            {strutture.map((s) => (
              <Col xs={12} key={s.id} className="mb-4">
                <Card className="custom-horizontal-card d-flex flex-column flex-md-row align-items-stretch shadow-sm">
                  <div className="card-img-wrapper">
                    <Card.Img
                      src={s.immaginiUrl[0]}
                      className="card-img-horizontal"
                    />
                  </div>
                  <Card.Body style={{ position: "relative" }}>
                    <span className="badge bg-success media-voto-badge">
                      {s.mediaVoto.toFixed(1)}
                    </span>

                    <Card.Title>{s.nome}</Card.Title>
                    <Card.Text>{s.descrizione}</Card.Text>
                    <Card.Text>
                      <strong>Città:</strong> {s.citta}
                    </Card.Text>
                    <Card.Text>
                      <strong>Prezzo:</strong> € {s.prezzo}
                    </Card.Text>
                    <Card.Text>
                      <strong>Mood:</strong>{" "}
                      <span className="badge bg-warning text-dark">
                        {s.moodAssociato}
                      </span>
                    </Card.Text>
                    <Link to={`/strutture/${s.id}`}>
                      <Button variant="primary">Dettaglio struttura</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default StruttureList
