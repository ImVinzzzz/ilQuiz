# IL QUIZ 🎉
**Un gioco quiz ispirato a L'Eredità**

---

## 🎮 Regole del Gioco — Come Giocare

Benvenuto a **Il Quiz**! Se vuoi cimentarti in questa sfida e mettere alla prova la tua cultura generale, ecco tutto quello che devi sapere sulle diverse manche che dovrai affrontare per raggiungere la vittoria finale.

Il gioco si sviluppa in **6 manche consecutive**, ciascuna con regole e dinamiche uniche. Il tuo obiettivo è accumulare il maggior numero possibile di punti prima di affrontare la leggendaria **Ghigliottina**.

### 1. Correva l'Anno 📅
In questa prima manche ti verranno presentate delle domande di cultura generale e storica. Per ogni domanda avrai a disposizione **quattro anni fissi** come opzioni di risposta. Il tuo compito è individuare l'anno esatto in cui è avvenuto l'evento descritto. Ogni risposta corretta aggiunge **5.000 punti** al tuo bottino.

### 2. La Scossa! ⚡
Sul tabellone compariranno **11 personaggi**. Tra questi, solo uno è l'**intruso** (ad esempio, l'unico a non aver mai vinto un Premio Nobel per la Letteratura). Il tuo obiettivo è selezionare uno alla volta tutti i personaggi "corretti" (quelli che hanno vinto il Nobel), evitando assolutamente l'intruso. Se selezioni l'intruso prenderai la "scossa" (risposta errata). Ogni risposta corretta vale **2.000 punti**.

### 3. Quante ne Sai? 🧠
Questa manche si divide in **due round**. In ciascun round ti verranno proposte diverse materie con un valore di punteggio crescente (da 1.000 a 5.000 punti). Scegli la materia che preferisci o in cui ti senti più preparato e rispondi alla domanda a scelta multipla per incassare il relativo montepremi.

### 4. Domande a Raffica ⏱️
Una corsa contro il tempo! Hai **180 secondi** per rispondere a un massimo di **50 domande rapide**. Per ogni domanda avrai solo **due opzioni** di risposta. Ogni risposta corretta ti assegna **2.000 punti**. Rispondi il più velocemente possibile per massimizzare il punteggio prima che il tempo scada!

### 5. Vero o Falso? ❓
Ancora una manche a tempo: hai **90 secondi** per valutare **25 affermazioni** e decidere se sono vere o false. Ogni risposta corretta aumenta il tuo punteggio di **2.000 punti**.

### 6. La Ghigliottina (Manche Finale) 🗡️
È il momento della verità. Entri in finale con tutto il bottino accumulato nelle manche precedenti.
1. Ti verranno presentate **5 coppie di parole**. Per ognuna, dovrai scegliere quella corretta.
2. Attenzione: se scegli la parola sbagliata, il tuo montepremi accumulato **viene dimezzato**!
3. Al termine della scelta avrai a disposizione **5 parole indizio** e un timer di **60 secondi**.
4. Usa il minuto a disposizione per trovare l'unica parola misteriosa che si collega logicamente a tutte e 5 le parole indizio e digitala nella casella di risposta.

Riuscirai a mantenere intatto il tuo bottino e a indovinare la parola finale? Buona fortuna!

---


## 📁 Struttura del Progetto

```
il-quiz/
│
├── index.html              ← Struttura HTML (SPA, tutti gli schermi)
├── style.css               ← Stili, palette, animazioni
├── script.js               ← Logica di gioco completa
├── data/                   ← Dati JSON separati per manche
│   ├── manche1.json        ← Domande Correva l'Anno
│   ├── manche2.json        ← Personaggi Scossa!
│   ├── manche3.json        ← Due round di materie Quante ne Sai?
│   ├── manche4.json        ← 50 domande Domande a Raffica
│   ├── manche5.json        ← 25 domande Vero o Falso?
│   └── finale.json         ← Dati della Ghigliottina
│
├── assets/
│   ├── sounds/
│   │   ├── ok.mp3          ← Suono risposta corretta
│   │   ├── ko.mp3          ← Suono risposta errata
│   │   ├── scossa.mp3      ← Suono per la "scossa" (M2)
│   │   ├── cut.mp3         ← Suono per risposta errata / ghigliottina (M4)
│   │   ├── gong.mp3        ← Gong fine timer (M4)
│   │   └── winner.mp3      ← Fanfara vittoria finale
│   │
│   └── images/
│       ├── marquez.jpg       ← Foto Gabriel García Márquez (M2)
│       ├── morrison.jpg      ← Foto Toni Morrison (M2)
│       ├── eco.jpg           ← Foto Umberto Eco (M2) ← IL PERSONAGGIO DA NON DIRE
│       ├── neruda.jpg        ← Foto Pablo Neruda (M2)
│       ├── lessing.jpg       ← Foto Doris Lessing (M2)
│       ├── pamuk.jpg         ← Foto Orhan Pamuk (M2)
│       ├── jelinek.jpg       ← Foto Elfriede Jelinek (M2)
│       ├── muller.jpg        ← Foto Herta Müller (M2)
│       ├── soyinka.jpg       ← Foto Wole Soyinka (M2)
│       ├── storia.jpg        ← Immagine materia Storia (M3 round 1)
│       ├── scienza.jpg       ← Immagine materia Scienza (M3 round 1)
│       ├── arte.jpg          ← Immagine materia Arte (M3 round 1)
│       ├── letteratura.jpg   ← Immagine materia Letteratura (M3 round 1)
│       ├── musica.jpg        ← Immagine materia Musica (M3)
│       ├── geografia.jpg     ← Immagine materia Geografia (M3)
│       ├── criminologia.jpg  ← Immagine materia Criminologia (M3 round 2)
│       ├── mitologia.jpg     ← Immagine materia Mitologia (M3 round 2)
│       ├── cucina.jpg        ← Immagine materia Cucina (M3 round 2)
│       ├── animali.jpg       ← Immagine materia Animali (M3 round 2)
│       ├── cinema.jpg        ← Immagine materia Cinema (M3 round 2)
│       └── italiano.jpg      ← Immagine materia Italiano (M3 round 2)
│
└── README.md
```

<!-- ---

## 🚀 Come eseguire il gioco

Il gioco **non può essere aperto direttamente** come file HTML doppio-clic (il browser blocca il `fetch` dei file JSON in `data/` da file locali).

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
``` -->

---

## 🎮 Flusso di Gioco

| # | Schermata | Descrizione | Punti MAX |
|---|-----------|-------------|-----------|
| 0 | Home      | Logo gigante — clicca ovunque | |
| 1 | M1 — Correva l'Anno | 10 domande, 4 anni fissi, +5.000 pt/risposta giusta | 50.000 |
| 2 | M2 — Scossa! | 11 personaggi, 1 impostore Nobel, +2.000 pt/risposta giusta | 20.000 |
| 3 | M3 — Quante ne Sai? | 2 round da 6 materie, valori da 1.000 a 5.000 pt | 30.000 |
| 4 | M4 — Domande a Raffica | 50 domande, 180 secondi, 2 opzioni, +2.000 pt/risposta giusta | 100.000 |
| 5 | M5 — Vero o Falso? | 25 domande, 90 secondi, 2 opzioni, +2.000 pt/risposta giusta | 50.000 |
| 6 | Manche Finale — Ghigliottina | 5 coppie di parole + 1 min timer + soluzione | 250.000 |
| 7 | Finale Vittoria / Sconfitta | Punteggio finale | |

---

## ✏️ Personalizzazione

### Cambiare le domande (M1)
Nel file `data/manche1.json`, array `domande`, ogni oggetto ha:
- `testo` — testo della domanda
- `risposta_corretta_tra_anni` — quale dei 4 anni (1946/1966/1986/2006) è la risposta

### Cambiare la Scossa (M2)
Nel file `data/manche2.json`, array `personaggi`:
- Il personaggio con `"ha_vinto_nobel": false` è quello da non dire
- Attualmente è **Umberto Eco** (unico senza Nobel reale)

### Cambiare le materie (M3)
Nel file `data/manche3.json`, array `rounds`:
- Ogni round contiene un `titolo` e un array `materie`
- Ogni materia ha `nome`, `icona`, `punti`, `immagine`, `domanda` e quattro `risposte`
- Attualmente ci sono 2 round da 6 materie ciascuno

### Cambiare le domande a raffica (M4)
Nel file `data/manche4.json`:
- `durata_secondi` — tempo disponibile, attualmente 180 secondi
- `punti_per_risposta` — punti assegnati a ogni risposta corretta
- `domande` — elenco delle 50 domande, ciascuna con due risposte

### Cambiare le domande vero o falso (M5)
Nel file `data/manche5.json`:
- `durata_secondi` — tempo disponibile, attualmente 90 secondi
- `punti_per_risposta` — punti assegnati a ogni risposta corretta
- `domande` — elenco delle 25 domande, ciascuna con le due risposte

### Cambiare la parola della Ghigliottina (finale)
Nel file `data/finale.json`:
- `soluzione` — la parola target
- `coppie` — le 5 coppie; `corretta` è la parola-indizio che porta alla soluzione

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
