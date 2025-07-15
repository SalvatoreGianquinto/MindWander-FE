import React, { useState } from "react"
import { Form, Row, Col, Button } from "react-bootstrap"
import "../styles/FiltriStrutture.css"

const FiltriStrutture = ({ onFiltra }) => {
  const [showFilters, setShowFilters] = useState(false)

  const [citta, setCitta] = useState("")
  const [mood, setMood] = useState("")
  const [minPrezzo, setMinPrezzo] = useState("")
  const [maxPrezzo, setMaxPrezzo] = useState("")
  const [votoMedioMin, setVotoMedioMin] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onFiltra({ citta, mood, minPrezzo, maxPrezzo, votoMedioMin })
  }

  return (
    <div className="filtri-wrapper">
      <div
        className="toggle-filtri-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Nascondi Filtri ▲" : "Filtri ▼"}
      </div>

      {showFilters && (
        <Form
          onSubmit={handleSubmit}
          className="filtri-form p-3 shadow-sm rounded"
        >
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Città"
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
              className="form"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="form"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              placeholder="Prezzo Min"
              value={minPrezzo}
              onChange={(e) => setMinPrezzo(e.target.value)}
              className="form"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              placeholder="Prezzo Max"
              value={maxPrezzo}
              onChange={(e) => setMaxPrezzo(e.target.value)}
              className="form"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              step="0.1"
              placeholder="Voto Medio Min"
              value={votoMedioMin}
              onChange={(e) => setVotoMedioMin(e.target.value)}
              className="form"
              min="0"
              max="10"
            />
          </Form.Group>
          <Button type="submit" className="btn-filtra w-100">
            Filtra
          </Button>
        </Form>
      )}
    </div>
  )
}

export default FiltriStrutture
