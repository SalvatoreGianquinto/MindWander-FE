import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Button, Spinner, Row, Col } from "react-bootstrap"
import "../styles/BackOffice.css"
import NavigationBar from "./NavigatioBar"
import api from "../api"

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
  const [stanze, setStanze] = useState([])
  const [stanzaForm, setStanzaForm] = useState({
    nome: "",
    descrizione: "",
    postiLetto: 1,
    prezzo: "",
  })
  const [selectedImages, setSelectedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [serviziExtraList, setServiziExtraList] = useState([])
  const token = localStorage.getItem("token")

  const compilaConDatiDemo = () => {
    setFormData({
      nome: "Hotel Sole Azzurro",
      descrizione: "Un hotel accogliente vicino al mare con tutti i comfort.",
      citta: "Trapani",
      indirizzo: "Via della Spiaggia 123",
      prezzo: "140",
      disponibile: true,
      moodAssociato: "Relax",
      categoriaAlloggio: "HOTEL",
      serviziExtraIds: serviziExtraList.slice(0, 2).map((s) => s.id),
    })

    setStanze([
      {
        nome: "Stanza Matrimoniale",
        descrizione: "Ampia e luminosa con balcone vista mare",
        postiLetto: 2,
        prezzo: 140,
      },
    ])
  }

  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchServiziExtra = async () => {
      try {
        const res = await api.get("/servizi-extra", {})
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

  const handleCustomFileClick = () => {
    fileInputRef.current.click()
  }

  const handleStanzaChange = (e) => {
    const { name, value } = e.target
    setStanzaForm((prev) => ({ ...prev, [name]: value }))
  }

  const aggiungiStanza = () => {
    if (!stanzaForm.nome.trim()) return alert("Inserisci nome stanza")
    if (!stanzaForm.prezzo || isNaN(stanzaForm.prezzo))
      return alert("Inserisci un prezzo valido per la stanza")
    if (
      !stanzaForm.postiLetto ||
      isNaN(stanzaForm.postiLetto) ||
      stanzaForm.postiLetto < 1
    )
      return alert("Inserisci un numero valido di posti letto")

    setStanze((prev) => [
      ...prev,
      {
        ...stanzaForm,
        postiLetto: Number(stanzaForm.postiLetto),
        prezzo: parseFloat(stanzaForm.prezzo),
      },
    ])
    setStanzaForm({ nome: "", descrizione: "", postiLetto: 1, prezzo: "" })
  }

  const uploadImages = async () => {
    const urls = []
    for (const file of selectedImages) {
      const formDataImg = new FormData()
      formDataImg.append("file", file)
      formDataImg.append("upload_preset", UPLOAD_PRESET)
      const res = await api.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        formDataImg
      )
      urls.push(res.data.secure_url)
    }
    return urls
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (stanze.length === 0) {
      alert("Aggiungi almeno una stanza alla struttura")
      return
    }
    setUploading(true)
    try {
      const immaginiUrl = await uploadImages()
      const strutturaDto = {
        ...formData,
        prezzo: parseFloat(formData.prezzo),
        immaginiUrl,
        serviziExtraIds: formData.serviziExtraIds,
        stanze,
      }
      await api.post("/strutture", strutturaDto, {})
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
          <Button
            variant="secondary"
            className="mb-3"
            onClick={() => navigate(-1)}
          >
            Indietro
          </Button>
          <h2 className="mb-4">Crea Nuova Struttura</h2>

          <Button
            variant="warning"
            className="mb-3 me-2"
            onClick={compilaConDatiDemo}
          >
            Compila con dati demo
          </Button>
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
                    min={0}
                    step="0.01"
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
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Button variant="secondary" onClick={handleCustomFileClick}>
                Scegli Immagini
              </Button>
              <div className="mt-2">
                {selectedImages.length > 0
                  ? selectedImages.map((file, idx) => (
                      <div key={idx}>{file.name}</div>
                    ))
                  : "Nessuna immagine selezionata"}
              </div>
            </Form.Group>

            <h4>Stanze</h4>
            <ul>
              {stanze.map((stanza, idx) => (
                <li key={idx}>
                  {stanza.nome} - {stanza.postiLetto} posti - €
                  {stanza.prezzo.toFixed(2)}
                </li>
              ))}
            </ul>

            <Form.Group className="mb-3">
              <Form.Label>Nome Stanza</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={stanzaForm.nome}
                onChange={handleStanzaChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Posti Letto</Form.Label>
              <Form.Control
                type="number"
                name="postiLetto"
                min={1}
                value={stanzaForm.postiLetto}
                onChange={handleStanzaChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prezzo Stanza</Form.Label>
              <Form.Control
                type="number"
                name="prezzo"
                min={0}
                step="0.01"
                value={stanzaForm.prezzo}
                onChange={handleStanzaChange}
              />
            </Form.Group>
            <Button
              variant="secondary"
              onClick={aggiungiStanza}
              className="mb-4"
            >
              Aggiungi Stanza
            </Button>
            <div>
              <Button variant="primary" type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Caricamento...
                  </>
                ) : (
                  "Crea Struttura"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default NuovaStruttura
