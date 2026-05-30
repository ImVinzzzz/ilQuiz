# IL QUIZ 🎉
**Un gioco quiz ispirato a L'Eredità — regalo di compleanno**

---

## 📁 Struttura del Progetto

```
il-quiz/
│
├── index.html              ← Struttura HTML (SPA, tutti gli schermi)
├── style.css               ← Stili, palette, animazioni
├── script.js               ← Logica di gioco completa
├── dati.json               ← Tutti i dati (domande, personaggi, materie)
│
├── assets/
│   ├── sounds/
│   │   ├── ok.mp3          ← Suono risposta corretta
│   │   ├── ko.mp3          ← Suono risposta errata
│   │   ├── scossa.mp3      ← Suono per la "scossa" (M2)
│   │   ├── gong.mp3        ← Gong fine timer (M4)
│   │   └── winner.mp3      ← Fanfara vittoria finale
│   │
│   └── images/
│       ├── marquez.jpg     ← Foto Gabriel García Márquez (M2)
│       ├── morrison.jpg    ← Foto Toni Morrison (M2)
│       ├── eco.jpg         ← Foto Umberto Eco (M2) ← IL PERSONAGGIO DA NON DIRE
│       ├── neruda.jpg      ← Foto Pablo Neruda (M2)
│       ├── lessing.jpg     ← Foto Doris Lessing (M2)
│       ├── pamuk.jpg       ← Foto Orhan Pamuk (M2)
│       ├── jelinek.jpg     ← Foto Elfriede Jelinek (M2)
│       ├── muller.jpg      ← Foto Herta Müller (M2)
│       ├── soyinka.jpg     ← Foto Wole Soyinka (M2)
│       ├── storia.jpg      ← Immagine materia Storia (M3)
│       ├── scienza.jpg     ← Immagine materia Scienza (M3)
│       ├── arte.jpg        ← Immagine materia Arte (M3)
│       ├── letteratura.jpg ← Immagine materia Letteratura (M3)
│       ├── musica.jpg      ← Immagine materia Musica (M3)
│       └── geografia.jpg   ← Immagine materia Geografia (M3)
└── README.md
```

---

## 🚀 Come eseguire il gioco

Il gioco **non può essere aperto direttamente** come file HTML doppio-clic (il browser blocca il `fetch` di `dati.json` da file locali).

### Opzione A — Live Server (VS Code)
1. Apri la cartella `il-quiz/` in VS Code
2. Installa l'estensione **Live Server**
3. Tasto destro su `index.html` → *Open with Live Server*

### Opzione B — Python (qualsiasi sistema)
```bash
cd il-quiz
python -m http.server 8000
# poi apri http://localhost:8000
```

### Opzione C — Node.js
```bash
cd il-quiz
npx serve .
```

---

## 🎮 Flusso di Gioco

| # | Schermata | Descrizione |
|---|-----------|-------------|
| 0 | Home      | Logo gigante — clicca ovunque |
| 1 | M1 — Correva l'Anno | 10 domande, 4 anni fissi, +5.000 pt/risposta giusta |
| 2 | M2 — Scossa! | 9 personaggi, 1 impostore Nobel, +2.000 pt/eliminazione |
| 3 | M3 — Quante ne Sai? | 6 materie, valori da 2.000 a 5.000 pt |
| 4 | M4 — Ghigliottina | 5 coppie di parole + 2 min timer + soluzione |
| 5 | Finale Vittoria / Sconfitta | Punteggio finale |

---

## ✏️ Personalizzazione

### Cambiare le domande (M1)
Nel file `dati.json`, sezione `manche1.domande`, ogni oggetto ha:
- `testo` — testo della domanda
- `risposta_corretta_tra_anni` — quale dei 4 anni (1946/1966/1986/2006) è la risposta

### Cambiare la Scossa (M2)
Nella sezione `manche2.personaggi`:
- Il personaggio con `"ha_vinto_nobel": false` è quello da non dire
- Attualmente è **Umberto Eco** (unico senza Nobel reale)

### Cambiare la parola della Ghigliottina (M4)
- `manche4.soluzione` — la parola target
- `manche4.coppie` — le 5 coppie; `corretta` è la parola-indizio che porta alla soluzione

### Aggiungere la domanda personale (M1, ultima domanda)
Nell'ultima domanda di `manche1.domande`, sostituisci il testo segnaposto con una domanda sull'amica festeggiata e imposta `risposta_corretta_tra_anni` sull'anno di nascita corretto.

---

## 🎨 Palette Colori

| Variabile CSS      | Valore    | Uso |
|--------------------|-----------|-----|
| `--blu-notte`      | `#0a0f2e` | Sfondo principale |
| `--oro`            | `#f5c518` | Accenti, titoli, punteggio |
| `--verde`          | `#27ae60` | Risposta corretta |
| `--rosso`          | `#c0392b` | Risposta errata / scossa |

---

## 📝 Note tecniche

- **Zero dipendenze** — JavaScript vanilla puro, nessun framework
- **SPA** — tutte le schermate sono `<section>` nascoste/mostrate con `opacity` + `pointer-events`
- **CSS Custom Properties** — palette e transizioni centralizzate
- **FontAwesome 6.5.1** via CDN
- **Google Fonts** — Bebas Neue (titoli) + Nunito (corpo)
- I suoni vengono riprodotti con `audio.play()` (silenzioso se i file mancano)
