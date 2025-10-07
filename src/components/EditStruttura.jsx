import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Form, Button, Image, CloseButton, Spinner } from "react-bootstrap"
import api from "../api"

const UPLOAD_PRESET = "uploadpreset"
const CLOUD_NAME = "ddfzjwhuq"

function EditStruttura() {
  const { id } = useParams()
  const navigate = useNavigate()

  const fileInputRef = useRef(null)

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

  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [uploadedNewImages, setUploadedNewImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [serviziExtraList, setServiziExtraList] = useState([])

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStruttura = await api.get(`/strutture/${id}`, {})
        const data = resStruttura.data
        setFormData({
          nome: data.nome || "",
          descrizione: data.descrizione || "",
          citta: data.citta || "",
          indirizzo: data.indirizzo || "",
          prezzo: data.prezzo || "",
          disponibile: data.disponibile ?? true,
          moodAssociato: data.moodAssociato || "",
          categoriaAlloggio: data.categoriaAlloggio || "",
          serviziExtraIds: data.serviziExtraIds || [],
        })
        setExistingImages(data.immaginiUrl || [])

        const resServiziExtra = await api.get("/servizi-extra")
        setServiziExtraList(resServiziExtra.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, token])

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
    setNewImages(Array.from(e.target.files))
  }

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url))
  }

  const uploadImage = async (file) => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", UPLOAD_PRESET)

    const res = await api.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      data
    )
    return res.data.secure_url
  }

  const handleUploadImages = async () => {
    setUploading(true)
    const urls = []
    for (const file of newImages) {
      const url = await uploadImage(file)
      urls.push(url)
    }
    setUploading(false)
    setUploadedNewImages(urls)
    return urls
  }

  const handleCustomFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let newUploadedUrls = uploadedNewImages
    if (newImages.length && uploadedNewImages.length !== newImages.length) {
      newUploadedUrls = await handleUploadImages()
    }
    const immaginiFinali = [...existingImages, ...newUploadedUrls]

    const strutturaDto = {
      ...formData,
      prezzo: parseFloat(formData.prezzo),
      immaginiUrl: immaginiFinali,
      serviziExtraIds: formData.serviziExtraIds,
    }

    try {
      await api.put(`/strutture/${id}`, strutturaDto, {})
      alert("Struttura aggiornata con successo!")
      navigate("/backoffice")
    } catch (error) {
      alert("Errore durante l'aggiornamento struttura")
      console.error(error)
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
    <div className="common-page-wrapper">
      <div className="common-wrapper">
        <Button
          variant="secondary"
          className="mb-3"
          onClick={() => navigate(-1)}
        >
          Indietro
        </Button>
        <h2>Modifica Struttura</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="descrizione">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descrizione"
              value={formData.descrizione}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="citta">
            <Form.Label>Città</Form.Label>
            <Form.Control
              type="text"
              name="citta"
              value={formData.citta}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="indirizzo">
            <Form.Label>Indirizzo</Form.Label>
            <Form.Control
              type="text"
              name="indirizzo"
              value={formData.indirizzo}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="prezzo">
            <Form.Label>Prezzo</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="prezzo"
              value={formData.prezzo}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="disponibile">
            <Form.Check
              type="checkbox"
              label="Disponibile"
              name="disponibile"
              checked={formData.disponibile}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="moodAssociato">
            <Form.Label>Mood Associato</Form.Label>
            <Form.Control
              type="text"
              name="moodAssociato"
              value={formData.moodAssociato}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="categoriaAlloggio">
            <Form.Label>Categoria Alloggio</Form.Label>
            <Form.Control
              type="text"
              name="categoriaAlloggio"
              value={formData.categoriaAlloggio}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="serviziExtra">
            <Form.Label>Servizi Extra</Form.Label>
            <div>
              {serviziExtraList.length === 0 && (
                <p>Nessun servizio extra disponibile</p>
              )}
              {serviziExtraList.map((servizio) => (
                <Form.Check
                  key={servizio.id}
                  type="checkbox"
                  label={servizio.nome}
                  value={servizio.id}
                  checked={formData.serviziExtraIds.includes(servizio.id)}
                  onChange={handleServiziExtraChange}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Immagini Esistenti</Form.Label>
            <div className="d-flex flex-wrap gap-3 mb-3">
              {existingImages.length === 0 && <p>Nessuna immagine</p>}
              {existingImages.map((url) => (
                <div key={url} style={{ position: "relative" }}>
                  <Image
                    src={url}
                    thumbnail
                    style={{
                      width: "120px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                  <CloseButton
                    onClick={() => removeExistingImage(url)}
                    className="close-button"
                  />
                </div>
              ))}
            </div>
          </Form.Group>

          <Form.Group controlId="newImages" className="mb-4">
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
              {newImages.length > 0
                ? newImages.map((file, idx) => <div key={idx}>{file.name}</div>)
                : "Nessuna immagine selezionata"}
            </div>
            {uploading && (
              <div className="mt-2">
                <Spinner animation="border" size="sm" /> Uploading...
              </div>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" disabled={uploading}>
            Aggiorna Struttura
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default EditStruttura
