import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Form, Button, Spinner, Row, Col } from "react-bootstrap"
import "../styles/BackOffice.css"
import NavigationBar from "./NavigatioBar"

const UPLOAD_PRESET = "uploadpreset"
const CLOUD_NAME = "ddfzjwhuq"

function NuovaStruttura() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: "",
    descrizione: "",
    citta: "",
    indirizzo: "",
    prezzo: "",
    disponibile: true,
    moodAssociato: "",
    categoriaAlloggio: "",
    serviziExtraIds: [],
  })
  const [selectedImages, setSelectedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [serviziExtraList, setServiziExtraList] = useState([])
  const token = localStorage.getItem("token")
  console.log("TOKEN:", token)

  useEffect(() => {
    const fetchServiziExtra = async () => {
      try {
        const res = await axios.get("http://localhost:8080/servizi-extra", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setServiziExtraList(res.data)
      } catch (error) {
        console.error("Errore nel fetch servizi extra", error)
      }
    }

    fetchServiziExtra()
  }, [token])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleServiziExtraChange = (e) => {
    const value = Number(e.target.value)
    const checked = e.target.checked
    setFormData((prev) => {
      let newServizi = [...prev.serviziExtraIds]
      if (checked) {
        if (!newServizi.includes(value)) newServizi.push(value)
      } else {
        newServizi = newServizi.filter((id) => id !== value)
      }
      return { ...prev, serviziExtraIds: newServizi }
    })
  }

  const handleFileChange = (e) => {
    setSelectedImages(Array.from(e.target.files))
  }

  const uploadImages = async () => {
    const urls = []
    for (const file of selectedImages) {
      const formDataImg = new FormData()
      formDataImg.append("file", file)
      formDataImg.append("upload_preset", UPLOAD_PRESET)

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        formDataImg
      )
      urls.push(res.data.secure_url)
    }
    return urls
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      const immaginiUrl = await uploadImages()

      const strutturaDto = {
        ...formData,
        prezzo: parseFloat(formData.prezzo),
        immaginiUrl,
        serviziExtraIds: formData.serviziExtraIds,
      }

      await axios.post("http://localhost:8080/strutture", strutturaDto, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert("Struttura creata con successo!")
      navigate("/backoffice")
    } catch (error) {
      alert("Errore nella creazione della struttura")
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="common-page-wrapper">
        <div className="common-wrapper">
          <h2 className="mb-4">Crea Nuova Struttura</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descrizione"
                value={formData.descrizione}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Città</Form.Label>
                  <Form.Control
                    type="text"
                    name="citta"
                    value={formData.citta}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Indirizzo</Form.Label>
                  <Form.Control
                    type="text"
                    name="indirizzo"
                    value={formData.indirizzo}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Prezzo</Form.Label>
                  <Form.Control
                    type="number"
                    name="prezzo"
                    value={formData.prezzo}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Disponibile</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="disponibile"
                    checked={formData.disponibile}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mood Associato</Form.Label>
              <Form.Control
                type="text"
                name="moodAssociato"
                value={formData.moodAssociato}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoria Alloggio</Form.Label>
              <Form.Control
                type="text"
                name="categoriaAlloggio"
                value={formData.categoriaAlloggio}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Servizi Extra</Form.Label>
              <div>
                {serviziExtraList.map((servizio) => (
                  <Form.Check
                    key={servizio.id}
                    type="checkbox"
                    label={servizio.nome}
                    value={servizio.id.toString()}
                    checked={formData.serviziExtraIds.includes(servizio.id)}
                    onChange={handleServiziExtraChange}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Immagini</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Spinner animation="border" size="sm" /> Caricamento...
                </>
              ) : (
                "Crea Struttura"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default NuovaStruttura
