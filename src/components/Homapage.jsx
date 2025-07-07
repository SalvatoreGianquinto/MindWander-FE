import "../styles/Homepage.css"
import NavigationBar from "./NavigatioBar"
import { GiWorld } from "react-icons/gi"
import { FaHotel } from "react-icons/fa6"
import { FaSpa } from "react-icons/fa"

function Homepage() {
  return (
    <>
      <div className="bg-page">
        <NavigationBar />
        <div className="hero-section">
          <h1 className="hero-title">MindWander</h1>
          <span className="hero-subtitle">
            Viaggia con la mente, scopri con il cuore.
          </span>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <h3>
              {" "}
              <GiWorld /> Esplora Itinerari
            </h3>
            <p>
              Scopri itinerari personalizzati per il tuo benessere mentale,
              pensati per ogni tipo di viaggiatore.
            </p>
          </div>
          <div className="feature-card">
            <h3>
              <FaHotel /> Strutture Selezionate
            </h3>
            <p>
              Scegli tra alloggi unici e rigeneranti, accuratamente selezionati
              per offrire relax e serenità.
            </p>
          </div>
          <div className="feature-card">
            <h3>
              <FaSpa /> Benessere al Centro
            </h3>
            <p>
              Il nostro obiettivo è connettere il viaggio al benessere, per
              aiutarti a ritrovare equilibrio e ispirazione.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Homepage
