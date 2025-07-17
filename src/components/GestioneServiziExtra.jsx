import { useEffect, useState } from "react"
import axios from "axios"
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap"

const GestioneServiziExtra = () => {
  const [servizi, setServizi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("create")
  const [currentServizio, setCurrentServizio] = useState({ id: null, nome: "" })

  const token = localStorage.getItem("token")
  const config = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    fetchServizi()
  }, [])

  const fetchServizi = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:8080/servizi-extra", config)
      setServizi(res.data)
    } catch {
      setError("Errore nel caricamento dei servizi extra")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo servizio extra?"))
      return
    try {
      await axios.delete(`http://localhost:8080/servizi-extra/${id}`, config)
      setServizi((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      alert(err.response?.data?.message || "Errore durante la cancellazione")
    }
  }

  const openCreateModal = () => {
    setModalMode("create")
    setCurrentServizio({ id: null, nome: "" })
    setShowModal(true)
  }

  const openEditModal = (servizio) => {
    setModalMode("edit")
    setCurrentServizio({ id: servizio.id, nome: servizio.nome })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!currentServizio.nome.trim()) {
      alert("Il nome del servizio è obbligatorio")
      return
    }
    try {
      if (modalMode === "create") {
        const res = await axios.post(
          "http://localhost:8080/servizi-extra",
          { servizio: currentServizio.nome },
          config
        )
        setServizi((prev) => [...prev, res.data])
      } else {
        const res = await axios.put(
          `http://localhost:8080/servizi-extra/${currentServizio.id}`,
          { servizio: currentServizio.nome },
          config
        )
        setServizi((prev) =>
          prev.map((s) => (s.id === currentServizio.id ? res.data : s))
        )
      }
      setShowModal(false)
    } catch (err) {
      alert(err.response?.data?.message || "Errore durante il salvataggio")
    }
  }

  if (loading) return <Spinner animation="border" />

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Servizi Extra</h2>
        <Button variant="success" onClick={openCreateModal}>
          + Nuovo Servizio Extra
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {servizi.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center">
                Nessun servizio extra trovato
              </td>
            </tr>
          )}
          {servizi.map((s) => (
            <tr key={s.id}>
              <td>{s.nome}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openEditModal(s)}
                >
                  Modifica
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(s.id)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "create"
              ? "Nuovo Servizio Extra"
              : "Modifica Servizio Extra"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nome Servizio</Form.Label>
            <Form.Control
              type="text"
              value={currentServizio.nome}
              onChange={(e) =>
                setCurrentServizio((prev) => ({
                  ...prev,
                  nome: e.target.value,
                }))
              }
              placeholder="Inserisci il nome del servizio"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default GestioneServiziExtra
