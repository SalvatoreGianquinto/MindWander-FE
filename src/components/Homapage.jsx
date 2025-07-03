import { Button } from "react-bootstrap"
import "../styles/Homepage.css"
import NavigationBar from "./NavigatioBar"
import StruttureList from "./StruttureList"

function Homepage() {
  return (
    <>
      <NavigationBar />
      <header className="hero-section">
        <div className="container">
          <h1 className="display-3 fw-bold">Scopri il tuo rifugio ideale</h1>
          <p className="lead">
            Viaggi, relax e benessere mentale con MindWander
          </p>
          <Button variant="primary" size="lg">
            Inizia a Esplorare
          </Button>
        </div>
      </header>

      <main>
        <StruttureList />
      </main>

      <footer className="text-center py-4 bg-light mt-5">
        <small>
          &copy; {new Date().getFullYear()} MindWander - Tutti i diritti
          riservati
        </small>
      </footer>
    </>
  )
}

export default Homepage
