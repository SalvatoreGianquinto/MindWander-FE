import { useEffect, useState } from "react"
import axios from "axios"
import { Card, Button } from "react-bootstrap"

function StruttureList() {
  const [strutture, setStrutture] = useState([])

  useEffect(() => {
    const fetchStrutture = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:8080/strutture", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setStrutture(response.data)
      } catch (error) {
        console.error("Errore durante il recupero delle strutture:", error)
      }
    }

    fetchStrutture()
  }, [])

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Le nostre Strutture</h2>
      <div className="row">
        {strutture.map((struttura) => (
          <div className="col-md-4 mb-4" key={struttura.id}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={
                  struttura.immaginiUrl?.[0] ||
                  "https://via.placeholder.com/400x250"
                }
                className="card-img-top struttura-img"
                alt={struttura.nome}
              />
              <Card.Body>
                <Card.Title>{struttura.nome}</Card.Title>
                <Card.Text>
                  <strong>Città:</strong> {struttura.citta} <br />
                  <strong>Prezzo:</strong> €{struttura.prezzo} <br />
                  <strong>Categoria:</strong> {struttura.categoria} <br />
                  <strong>Mood:</strong> {struttura.moodAssociato}
                </Card.Text>
                <Button variant="primary">Scopri di più</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StruttureList
