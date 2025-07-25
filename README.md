_MindWander_ è una piattaforma web che unisce viaggio e benessere mentale. Gli utenti possono esplorare strutture ricettive in base al proprio stato d’animo, generare o creare itinerari personalizzati, lasciare recensioni, aggiungere strutture ai preferiti e gestire le proprie esperienze tramite una dashboard personale.

> Progetto full stack realizzato come prova finale per il corso _Epicode – Luglio 2025_.

Link al repository Backend: https://github.com/SalvatoreGianquinto/MindWander.git

Setup e avvio Backend

1. Clonazione del repository backend

Apri il terminale e clona il repository backend in una cartella a tua scelta:

git clone https://github.com/SalvatoreGianquinto/MindWander.git

ed entra nella cartella appena clonata con:

cd MindWander

2. Configurazione file d'ambiente
   Il file application.properties si trova in src/main/resources/ ed è già presente nel progetto e qui:
   <img width="677" height="495" alt="image" src="https://github.com/user-attachments/assets/48ccfae0-cfcb-4d1c-9b1a-d14bd8dcf716" />

# JWT

jwt.duration=1800000
jwt.secret=bchdmjamcjekdnakfubqkdhckiwadffggggg1a2b3c4d5e6f7g8h9

Crea un file chiamato env.properties fuori dalla cartella resources, nella root del progetto backend (stessa cartella dove si trova pom.xml), con il seguente contenuto aggiornato con le tue credenziali:

postgresql.password=LaTuaPassword

# Cloudinary

cloud_name=name_cloud
api_key=LaTuaApiKey
api_secret=LaTuaApiSecret

Setup e avvio FrontEnd

1. Clona la repository
2. istalla le dipendenze con:
   npm install
3. avvia l'app:
   npm run dev

Configurazione Database PostgreSQL

MindWander utilizza PostgreSQL come database relazionale per memorizzare dati relativi a utenti, strutture, itinerari, recensioni e altro.

1. Installazione di PostgreSQL
2. creazione database
3. Connessione dal backend
   Assicurati che il backend punti correttamente al database nelle proprietà di connessione
4. Avvio automatico dello schema
   Grazie a Hibernate, le tabelle vengono create o aggiornate automaticamente all’avvio del backend

Tecnologie utilizzate
Frontend:

React

React Bootstrap

Axios

SCSS

jwt-decode

Cloudinary (upload immagini)

Backend:
Spring Boot

Spring Security (JWT)

PostgreSQL

JPA / Hibernate

Maven

Funzionalità principali

👤 Utente
Registrazione e login tramite JWT per autenticazione sicura.
Dashboard personale per visualizzare e gestire dati utente e prenotazioni.
Creazione e gestione di itinerari personalizzati.
Scrittura e visualizzazione di recensioni sulle strutture visitate.

🏨 Strutture
Visualizzazione di una lista di strutture ricettive con filtri per città, stato d’animo (mood), prezzo e voto medio.
Pagina dettagliata per ogni struttura, comprensiva di immagini, recensioni e servizi extra offerti.
Possibilità di prenotare le stanze in struttura direttamente dalla piattaforma.

✈ Itinerari
Generazione automatica di itinerari personalizzati in base allo stato d’animo dell’utente.
Creazione manuale di itinerari con tappe, date e dettagli specifici.
Salvataggio, modifica e gestione degli itinerari creati.

🛠 Backoffice (admin)
Gestione completa delle strutture e dei servizi extra (creazione, modifica, cancellazione).
Amministrazione utenti, ruoli, recensioni e itinerari per mantenere la qualità e la sicurezza della piattaforma.
