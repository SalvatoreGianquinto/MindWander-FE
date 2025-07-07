import { useEffect, useState } from "react"
import axios from "axios"
import { Card, Button } from "react-bootstrap"
import "../styles/StruttureList.css"

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
      <div className="d-flex flex-column gap-4">
        {strutture.map((struttura) => (
          <Card
            className="struttura-card-horizontal shadow-sm"
            key={struttura.id}
          >
            <div className="row g-0">
              <div className="col-md-4">
                <Card.Img
                  src={
                    struttura.immaginiUrl?.[0] ||
                    "https://via.placeholder.com/400x250"
                  }
                  alt={struttura.nome}
                  className="img-fluid h-100 struttura-img-horizontal"
                />
              </div>
              <div className="col-md-8">
                <Card.Body>
                  <Card.Title className="text-dark mb-2">
                    {struttura.nome}
                  </Card.Title>
                  <Card.Text className="text-dark">
                    <strong>Città:</strong> {struttura.citta} <br />
                    <strong>Prezzo per notte:</strong> €{struttura.prezzo}{" "}
                    <br />
                    <strong>Categoria:</strong> {struttura.categoria} <br />
                    <span className="badge bg-info text-dark mt-2">
                      {struttura.moodAssociato}
                    </span>
                  </Card.Text>
                  <Button variant="primary" className="mt-2">
                    Prenota
                  </Button>
                </Card.Body>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default StruttureList
