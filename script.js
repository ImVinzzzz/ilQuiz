/* ====================================================
   IL QUIZ — script.js
   Logica completa del gioco
   ==================================================== */

/* -------------------------------------------------- */
/* STATO GLOBALE                                       */
/* -------------------------------------------------- */
let dati = null;          // dati JSON caricati
let punteggioTotale = 0;  // accumulato tra tutte le manche
let sessioneSelezionata = "";
let sessioniDisponibili = [];

/* -------------------------------------------------- */
/* UTILITÀ                                             */
/* -------------------------------------------------- */

/** Mostra una schermata (e nasconde tutte le altre) */
function mostraSchermata(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

/** Aggiorna tutti i display del punteggio visibili */
function aggiornaPunteggio(nuovoPunteggio, animato = false) {
  const vecchioPunteggio = punteggioTotale;
  punteggioTotale = nuovoPunteggio;
  ['m1-score-display','m2-score-display','m3-score-display','m4-score-display','m5-score-display','m6-score-display']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = punteggioTotale.toLocaleString('it-IT');
    });

  // Aggiorna anche il punteggio gigante della ghigliottina
  const m6BigScoreEl = document.getElementById('m6-big-score');
  const m6BigScoreContainer = document.querySelector('.m6-big-score-container');
  if (m6BigScoreEl) {
    if (animato && m6BigScoreContainer) {
      // Anima il contenitore (taglio rosso + shake)
      m6BigScoreContainer.classList.remove('halve-animation');
      void m6BigScoreContainer.offsetWidth; // trigger reflow
      m6BigScoreContainer.classList.add('halve-animation');

      // Anima i numeri (conto alla rovescia veloce)
      let currentVal = vecchioPunteggio;
      const targetVal = nuovoPunteggio;
      const duration = 600; // ms
      const startTime = performance.now();

      function updateScoreCounter(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const currentDisplayVal = Math.round(currentVal - (currentVal - targetVal) * easeProgress);
        m6BigScoreEl.textContent = currentDisplayVal.toLocaleString('it-IT');

        if (progress < 1) {
          requestAnimationFrame(updateScoreCounter);
        } else {
          m6BigScoreEl.textContent = targetVal.toLocaleString('it-IT');
        }
      }

      requestAnimationFrame(updateScoreCounter);
    } else {
      m6BigScoreEl.textContent = punteggioTotale.toLocaleString('it-IT');
    }
  }
}

/** Riproduci un suono (ignora errori se il file manca) */
function suona(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.currentTime = 0;
  el.play().catch(() => {});
}

/** Ferma un suono */
function fermaSuono(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.pause();
  el.currentTime = 0;
}

/** Aggiungi classe fade-in con ritardo opzionale */
function fadeIn(el, delay = 0) {
  if (!el) return;
  el.style.animationDelay = delay + 'ms';
  el.classList.add('fade-in-el');
}

/* -------------------------------------------------- */
/* CARICAMENTO DATI JSON                               */
/* -------------------------------------------------- */
async function caricaDati(sessioneId) {
  const percorsi = {
    manche1: "data/" + sessioneId + "/manche1.json",
    manche2: "data/" + sessioneId + "/manche2.json",
    manche3: "data/" + sessioneId + "/manche3.json",
    manche4: "data/" + sessioneId + "/manche4.json",
    manche5: "data/" + sessioneId + "/manche5.json",
    finale: "data/" + sessioneId + "/finale.json"
  };

  const entries = await Promise.all(
    Object.entries(percorsi).map(async ([chiave, percorso]) => {
      const res = await fetch(percorso);
      if (!res.ok) throw new Error("Impossibile caricare " + percorso);
      return [chiave, await res.json()];
    })
  );

  dati = Object.fromEntries(entries);
}

async function caricaElencoSessioni() {
  const res = await fetch("data/index.json");
  if (!res.ok) throw new Error("Impossibile caricare l'elenco delle sessioni");
  sessioniDisponibili = await res.json();

  const select = document.getElementById("select-sessione");
  if (select) {
    select.innerHTML = "";
    sessioniDisponibili.forEach(sessione => {
      const option = document.createElement("option");
      option.value = sessione.id;
      option.textContent = sessione.nome;
      select.appendChild(option);
    });
  }
}

/* ====================================================
   HOME PAGE
   ==================================================== */
function initHome() {
  const home = document.getElementById('screen-home');
  home.addEventListener('click', () => {
    mostraSchermata('screen-config');
  }, { once: true });
}

function initConfig() {
  const btnConferma = document.getElementById("btn-conferma-config");
  if (btnConferma) {
    btnConferma.addEventListener("click", async () => {
      const select = document.getElementById("select-sessione");
      if (select) {
        sessioneSelezionata = select.value;
        try {
          btnConferma.disabled = true;
          btnConferma.innerHTML = "<i class=\"fa-solid fa-spinner fa-spin\"></i> Caricamento...";
          await caricaDati(sessioneSelezionata);
          mostraIntroManche(1);
        } catch (err) {
          alert("Errore nel caricamento dei dati di gioco!");
          console.error(err);
          btnConferma.disabled = false;
          btnConferma.innerHTML = "<i class=\"fa-solid fa-play\"></i> Conferma e Inizia";
        }
      }
    });
  }
}

/* ====================================================
   SCHERMATA INTRODUTTIVA MANCHE
   ==================================================== */
const introMeta = {
  1: {
    num:   'MANCHE 1',
    title: 'Correva l\'Anno',
    desc:  'Quattro anni, dieci domande. <br> Scegli l\'anno giusto!',
    avvia: initM1
  },
  2: {
    num:   'MANCHE 2',
    title: 'Scossa!',
    desc:  'Hanno tutti vinto il Nobel… tranne uno. <br> Riesci a trovarlo senza dirlo?',
    avvia: initM2
  },
  3: {
    num:   'MANCHE 3',
    title: 'Quante ne Sai?',
    desc:  'Due round, dodici domande. <br> Accumula più punti possibile!',
    avvia: initM3
  },
  4: {
    num:   'MANCHE 4',
    title: 'Domande a Raffica',
    desc:  'Hai 180 secondi per rispondere <br> a 50 domande. <br> Ogni risposta corretta vale 2.000 punti!',
    avvia: initM4
  },
  5: {
    num:   'MANCHE 5',
    title: 'Vero o Falso?',
    desc:  '90 secondi per rispondere <br> a 25 domande Vero o Falso. <br> Ogni risposta corretta vale 2.000 punti!',
    avvia: initM5
  },
  6: {
    num:   'MANCHE FINALE',
    title: 'Ghigliottina',
    desc:  'Il momento della verità. <br> Scegli gli indizi giusti <br> e indovina la parola che li lega!',
    avvia: initM6
  }
};

function mostraIntroManche(n) {
  const meta = introMeta[n];
  document.getElementById('intro-manche-num').textContent = meta.num;
  document.getElementById('intro-title').textContent       = meta.title;
  document.getElementById('intro-desc').innerHTML          = meta.desc;

  // Rimpiazza il listener del bottone ad ogni chiamata
  const btn = document.getElementById('btn-avvia');
  const nuovo = btn.cloneNode(true);
  btn.parentNode.replaceChild(nuovo, btn);
  nuovo.addEventListener('click', () => meta.avvia());

  mostraSchermata('screen-intro');
}

/* ====================================================
   MANCHE 1 — CORREVA L'ANNO
   ==================================================== */
let m1State = {};

function initM1() {
  m1State = {
    domande:   dati.manche1.domande,
    indice:    0,
    risposto:  false
  };
  aggiornaPunteggio(punteggioTotale);
  mostraSchermata('screen-m1');
  const anni = dati.manche1.anni;
  const containerAnni = document.getElementById("m1-year-buttons");
  const nuovoContainer = containerAnni.cloneNode(false);
  containerAnni.parentNode.replaceChild(nuovoContainer, containerAnni);

  if (anni) {
    anni.forEach(anno => {
      const btn = document.createElement("button");
      btn.className = "btn-year";
      btn.dataset.year = anno;
      btn.textContent = anno;
      nuovoContainer.appendChild(btn);
    });
  }

  nuovoContainer.addEventListener("click", onClickAnno);

  abilitaBottoniAnno(true);
  document.getElementById("m1-btn-next").classList.add("hidden");
  document.getElementById("m1-next-bar").classList.add("hidden");
  rimuoviClassiAnno();
  mostraDomandaM1();

  // Bottone "Domanda successiva"
  document.getElementById('m1-btn-next').addEventListener('click', () => {
    m1State.indice++;
    if (m1State.indice < m1State.domande.length) {
      rimuoviClassiAnno();
      abilitaBottoniAnno(true);
      document.getElementById('m1-btn-next').classList.add('hidden');
      mostraDomandaM1();
    } else {
      // Fine M1 → bottone manche 2
      document.getElementById('m1-btn-next').classList.add('hidden');
      document.getElementById('m1-next-bar').classList.remove('hidden');
    }
  });

  // Bottone passa a M2
  document.getElementById('m1-btn-manche2').addEventListener('click', () => {
    mostraIntroManche(2);
  });
}

function mostraDomandaM1() {
  const d = m1State.domande[m1State.indice];
  const counter = document.getElementById('m1-question-counter');
  const box = document.getElementById('m1-question-box');

  counter.textContent = `Domanda ${m1State.indice + 1} / ${m1State.domande.length}`;

  // Fade-in sulla domanda
  box.classList.remove('fade-in-el');
  void box.offsetWidth; // reflow per riattivare animazione
  box.classList.add('fade-in-el');
  document.getElementById('m1-question-text').textContent = d.testo;
}

function onClickAnno(e) {
  if (!e.target.matches('.btn-year')) return;
  if (m1State.risposto) return;

  const d           = m1State.domande[m1State.indice];
  const risposta    = e.target.dataset.year;
  const corretta    = d.risposta_corretta_tra_anni || d.risposta;

  abilitaBottoniAnno(false);
  m1State.risposto = false; // reset per prossima domanda

  if (risposta === corretta) {
    e.target.classList.add('correct');
    suona('snd-ok');
    aggiornaPunteggio(punteggioTotale + 5000);
  } else {
    e.target.classList.add('wrong');
    suona('snd-ko');
    // Colora il bottone corretto di verde
    document.querySelectorAll('.btn-year').forEach(btn => {
      if (btn.dataset.year === corretta) btn.classList.add('correct');
    });
  }

  // Mostra bottone "Domanda successiva" con fade
  const btnNext = document.getElementById('m1-btn-next');
  btnNext.classList.remove('hidden');
  btnNext.style.opacity = '0';
  setTimeout(() => { btnNext.style.transition = 'opacity .4s'; btnNext.style.opacity = '1'; }, 50);
}

function abilitaBottoniAnno(abilita) {
  document.querySelectorAll('.btn-year').forEach(b => b.disabled = !abilita);
}

function rimuoviClassiAnno() {
  document.querySelectorAll('.btn-year').forEach(b => {
    b.classList.remove('correct', 'wrong');
  });
}

/* ====================================================
   MANCHE 2 — SCOSSA!
   ==================================================== */
let m2State = {};

function initM2() {
  m2State = {
    personaggi:     dati.manche2.personaggi,
    rimasti:        dati.manche2.personaggi.length,
    nonDire:        dati.manche2.personaggi.findIndex(p => !p.ha_vinto_nobel),
    fineManica:     false
  };
  aggiornaPunteggio(punteggioTotale);
  mostraSchermata('screen-m2');
  
  const regolaText = document.getElementById("m2-rule-text");
  if (regolaText && dati.manche2.regola) {
    regolaText.textContent = dati.manche2.regola;
  }

  document.getElementById('m2-next-bar').classList.add('hidden');
  document.getElementById('m2-bio-box').classList.add('hidden');

  costruisciBottoniM2();

  document.getElementById('m2-btn-manche3').addEventListener('click', () => {
    mostraIntroManche(3);
  });
}

function costruisciBottoniM2() {
  const container = document.getElementById('m2-buttons');
  container.innerHTML = '';
  m2State.personaggi.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className   = 'btn-person fade-in-el';
    btn.style.animationDelay = (i * 60) + 'ms';
    btn.textContent = p.nome;
    btn.dataset.idx = i;
    btn.addEventListener('click', () => onClickPersonaggioM2(i, btn));
    container.appendChild(btn);
  });
}

function onClickPersonaggioM2(idx, btn) {
  if (m2State.fineManica) return;
  const p = m2State.personaggi[idx];

  // Mostra bio
  const bioBox  = document.getElementById('m2-bio-box');
  const bioImg  = document.getElementById('m2-bio-img');
  const bioText = document.getElementById('m2-bio-text');

  bioImg.src         = p.immagine;
  bioImg.alt         = p.nome;
  bioText.innerHTML  = `<strong>${p.nome}</strong><br>${p.bio}`;
  bioBox.classList.remove('hidden');
  // Re-trigger animazione
  bioBox.classList.remove('fade-in-el');
  void bioBox.offsetWidth;
  bioBox.classList.add('fade-in-el');

  if (p.ha_vinto_nobel) {
    // Risposta corretta: ha vinto il Nobel
    suona('snd-ok');
    btn.classList.add('correct');
    btn.disabled = true;
    aggiornaPunteggio(punteggioTotale + 2000);
    m2State.rimasti--;

    // Controlla se è rimasto solo il personaggio da non dire
    const attivi = document.querySelectorAll('.btn-person:not(:disabled)');
    if (attivi.length === 1) {
      // Vittoria perfetta!
      m2State.fineManica = true;
      attivi[0].disabled = true;
      setTimeout(() => abilitaPassaggioM2(), 800);
    }
  } else {
    // Scossa! Ha cliccato il personaggio da non dire
    suona('snd-scossa');
    btn.classList.add('wrong');
    // Disabilita tutto
    document.querySelectorAll('.btn-person').forEach(b => b.disabled = true);
    m2State.fineManica = true;
    setTimeout(() => abilitaPassaggioM2(), 1200);
  }
}

function abilitaPassaggioM2() {
  document.getElementById('m2-next-bar').classList.remove('hidden');
}

/* ====================================================
   MANCHE 3 — QUANTE NE SAI?
   ==================================================== */
let m3State = {};

function initM3() {
  const rounds = dati.manche3.rounds || [{ titolo: 'Round 1', materie: dati.manche3.materie }];
  m3State = {
    rounds,
    roundCorrente: 0,
    materie:      rounds[0].materie,
    risposte:     0,
    totMaterie:   rounds[0].materie.length,
    materiaAttiva: null
  };
  aggiornaPunteggio(punteggioTotale);
  mostraSchermata('screen-m3');
  document.getElementById('m3-next-bar').classList.add('hidden');

  aggiornaInfoM3();
  costruisciGrigliaM3();

  document.getElementById('m3-btn-manche4').onclick = onAvanzaM3;
}

function aggiornaInfoM3() {
  const round = m3State.rounds[m3State.roundCorrente];
  document.getElementById('m3-round-title').textContent = round.titolo;
  document.getElementById('m3-round-counter').textContent = `Round ${m3State.roundCorrente + 1} / ${m3State.rounds.length}`;
  document.getElementById('m3-instruction').textContent = 'Scegli una materia per rispondere alla domanda';
}

function costruisciGrigliaM3() {
  const grid = document.getElementById('m3-subject-grid');
  grid.innerHTML = '';
  m3State.materie.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn-subject fade-in-el';
    btn.style.animationDelay = (i * 80) + 'ms';
    btn.dataset.idx = i;
    btn.innerHTML = `
      <i class="fa-solid ${m.icona}"></i>
      <span class="subj-name">${m.nome}</span>
      <span class="subj-pts">${m.punti.toLocaleString('it-IT')} pt</span>
    `;
    btn.addEventListener('click', () => apriModaleM3(i, btn));
    grid.appendChild(btn);
  });
}

function onAvanzaM3() {
  const prossimoRound = m3State.roundCorrente + 1;

  if (prossimoRound < m3State.rounds.length) {
    m3State.roundCorrente = prossimoRound;
    m3State.materie = m3State.rounds[prossimoRound].materie;
    m3State.risposte = 0;
    m3State.totMaterie = m3State.materie.length;
    m3State.materiaAttiva = null;

    document.getElementById('m3-next-bar').classList.add('hidden');
    aggiornaInfoM3();
    costruisciGrigliaM3();
    return;
  }

  mostraIntroManche(4);
}

function aggiornaBottoneAvanzamentoM3() {
  const prossimoRound = m3State.roundCorrente + 1;
  const btn = document.getElementById('m3-btn-manche4');

  if (prossimoRound < m3State.rounds.length) {
    btn.innerHTML = `${m3State.rounds[prossimoRound].titolo} <i class="fa-solid fa-chevron-right"></i>`;
  } else {
    btn.innerHTML = 'Manche 4 <i class="fa-solid fa-chevron-right"></i>';
  }
}

function apriModaleM3(idx, btnMateria) {
  const m = m3State.materie[idx];
  m3State.materiaAttiva = { idx, btnMateria };

  document.getElementById('modal-subject-name').textContent   = m.nome;
  document.getElementById('modal-subject-points').textContent = `${m.punti.toLocaleString('it-IT')} pt`;
  document.getElementById('modal-img').src                    = m.immagine;
  document.getElementById('modal-img').alt                    = m.nome;
  document.getElementById('modal-question').textContent       = m.domanda;

  // Risposte
  const container = document.getElementById('modal-answers');
  container.innerHTML = '';
  m.risposte.forEach((r, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn-answer fade-in-el';
    btn.style.animationDelay = (i * 60) + 'ms';
    btn.textContent = r.testo;
    btn.addEventListener('click', () => onRispostaM3(r.corretta, btn, m.punti));
    container.appendChild(btn);
  });

  // Reset feedback
  const fb = document.getElementById('modal-feedback');
  fb.className = 'modal-feedback hidden';
  fb.textContent = '';

  document.getElementById('modal-m3').classList.remove('hidden');
}

function onRispostaM3(corretta, btnCliccato, punti) {
  // Disabilita tutti i bottoni risposta
  document.querySelectorAll('.btn-answer').forEach(b => b.disabled = true);

  const fb = document.getElementById('modal-feedback');

  if (corretta) {
    btnCliccato.classList.add('correct');
    suona('snd-ok');
    aggiornaPunteggio(punteggioTotale + punti);
    fb.textContent  = `✓ Esatto! +${punti.toLocaleString('it-IT')} punti`;
    fb.className    = 'modal-feedback ok';
  } else {
    btnCliccato.classList.add('wrong');
    suona('snd-ko');
    // Evidenzia quella corretta
    document.querySelectorAll('.btn-answer').forEach(b => {
      const idx = Array.from(b.parentNode.children).indexOf(b);
      if (m3State.materie[m3State.materiaAttiva.idx].risposte[idx]?.corretta) {
        b.classList.add('correct');
      }
    });
    fb.textContent = '✗ Risposta errata. Peccato!';
    fb.className   = 'modal-feedback fail';
  }

  fb.classList.remove('hidden');

  // Disabilita bottone materia
  m3State.materiaAttiva.btnMateria.disabled = true;
  m3State.risposte++;

  // Chiudi modale dopo 3 secondi
  setTimeout(() => {
    document.getElementById('modal-m3').classList.add('hidden');
    if (m3State.risposte >= m3State.totMaterie) {
      aggiornaBottoneAvanzamentoM3();
      document.getElementById('m3-next-bar').classList.remove('hidden');
    }
  }, 3000);
}

/* ====================================================
   MANCHE 4 — DOMANDE A RAFFICA
   ==================================================== */
let m4State = {};
let m4Timer = null;

function initM4() {
  m4State = {
    domande: dati.manche4.domande,
    indice: 0,
    corrette: 0,
    secondiRimasti: dati.manche4.durata_secondi || 180,
    puntiPerRisposta: dati.manche4.punti_per_risposta || 2000,
    terminata: false
  };

  aggiornaPunteggio(punteggioTotale);
  mostraSchermata('screen-m4');
  document.getElementById('m4-next-bar').classList.add('hidden');
  document.getElementById('m4-feedback').className = 'm4-feedback hidden';
  aggiornaTimerM4();
  aggiornaStatisticheM4();
  mostraDomandaM4();

  const sndSuspence = document.getElementById('snd-suspence');
  if (sndSuspence) sndSuspence.loop = true;
  suona('snd-suspence');

  clearInterval(m4Timer);
  m4Timer = setInterval(() => {
    m4State.secondiRimasti--;
    aggiornaTimerM4();
    if (m4State.secondiRimasti <= 0) {
      terminaM4('Tempo scaduto!');
    }
  }, 1000);

  // document.getElementById('m4-btn-finale') è stato rinominato in m4-btn-manche5 in HTML, l'evento è agganciato sotto o si può agganciare qui
  document.getElementById('m4-btn-manche5').addEventListener('click', () => {
    mostraIntroManche(5);
  });
}

function aggiornaTimerM4() {
  const el = document.getElementById('m4-timer');
  const min = Math.floor(m4State.secondiRimasti / 60);
  const sec = m4State.secondiRimasti % 60;
  el.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
  el.classList.toggle('danger', m4State.secondiRimasti <= 20);
}

function aggiornaStatisticheM4() {
  document.getElementById('m4-question-counter').textContent =
    `Domanda ${Math.min(m4State.indice + 1, m4State.domande.length)} / ${m4State.domande.length}`;
  document.getElementById('m4-correct-counter').textContent = m4State.corrette;
}

function mostraDomandaM4() {
  if (m4State.terminata) return;

  if (m4State.indice >= m4State.domande.length) {
    terminaM4('Domande finite!');
    return;
  }

  const domanda = m4State.domande[m4State.indice];
  const box = document.getElementById('m4-question-box');
  const risposte = document.getElementById('m4-answers');

  box.classList.remove('fade-in-el');
  void box.offsetWidth;
  box.classList.add('fade-in-el');
  document.getElementById('m4-question-text').textContent = domanda.testo;
  risposte.innerHTML = '';

  domanda.risposte.forEach((risposta, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn-raffica-answer fade-in-el';
    btn.style.animationDelay = (i * 60) + 'ms';
    btn.textContent = risposta.testo;
    btn.addEventListener('click', () => onRispostaM4(risposta.corretta, btn));
    risposte.appendChild(btn);
  });

  aggiornaStatisticheM4();
}

function onRispostaM4(corretta, btnCliccato) {
  if (m4State.terminata) return;

  document.querySelectorAll('.btn-raffica-answer').forEach(b => b.disabled = true);
  const fb = document.getElementById('m4-feedback');

  if (corretta) {
    btnCliccato.classList.add('correct');
    // suona('snd-ok'); // Disabilitato nella quarta manche
    m4State.corrette++;
    aggiornaPunteggio(punteggioTotale + m4State.puntiPerRisposta);
    fb.textContent = `✓ Esatto! +${m4State.puntiPerRisposta.toLocaleString('it-IT')} punti`;
    fb.className = 'm4-feedback ok';
  } else {
    btnCliccato.classList.add('wrong');
    // suona('snd-ko'); // Disabilitato nella quarta manche
    document.querySelectorAll('.btn-raffica-answer').forEach((b, idx) => {
      if (m4State.domande[m4State.indice].risposte[idx]?.corretta) b.classList.add('correct');
    });
    fb.textContent = '✗ Risposta errata';
    fb.className = 'm4-feedback fail';
  }

  m4State.indice++;
  aggiornaStatisticheM4();
  setTimeout(() => {
    if (m4State.terminata) return;
    fb.className = 'm4-feedback hidden';
    mostraDomandaM4();
  }, 650);
}

function terminaM4(messaggio) {
  if (m4State.terminata) return;
  m4State.terminata = true;
  clearInterval(m4Timer);
  fermaSuono('snd-suspence');
  document.getElementById('m4-question-counter').textContent = messaggio;
  document.getElementById('m4-question-text').textContent =
    `Hai risposto correttamente a ${m4State.corrette} domande. \nTotale manche: ${(m4State.corrette * m4State.puntiPerRisposta).toLocaleString('it-IT')} punti.`;
  document.getElementById('m4-answers').innerHTML = '';
  document.getElementById('m4-feedback').className = 'm4-feedback hidden';
  document.getElementById('m4-next-bar').classList.remove('hidden');
  if (m4State.secondiRimasti <= 0) suona('snd-gong');
}

/* ====================================================
   MANCHE 5 — VERO O FALSO
   ==================================================== */
let m5State = {};
let m5Timer = null;

function initM5() {
  m5State = {
    domande: dati.manche5.domande,
    indice: 0,
    corrette: 0,
    secondiRimasti: dati.manche5.durata_secondi || 90,
    puntiPerRisposta: dati.manche5.punti_per_risposta || 2000,
    terminata: false
  };

  aggiornaPunteggio(punteggioTotale);
  mostraSchermata('screen-m5');
  document.getElementById('m5-next-bar').classList.add('hidden');
  document.getElementById('m5-feedback').className = 'm5-feedback hidden';
  aggiornaTimerM5();
  aggiornaStatisticheM5();
  mostraDomandaM5();

  const sndSuspence = document.getElementById('snd-suspence');
  if (sndSuspence) sndSuspence.loop = true;
  suona('snd-suspence');

  clearInterval(m5Timer);
  m5Timer = setInterval(() => {
    m5State.secondiRimasti--;
    aggiornaTimerM5();
    if (m5State.secondiRimasti <= 0) {
      terminaM5('Tempo scaduto!');
    }
  }, 1000);

  document.getElementById('m5-btn-finale').addEventListener('click', () => {
    mostraIntroManche(6);
  });
}

function aggiornaTimerM5() {
  const el = document.getElementById('m5-timer');
  const min = Math.floor(m5State.secondiRimasti / 60);
  const sec = m5State.secondiRimasti % 60;
  el.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
  el.classList.toggle('danger', m5State.secondiRimasti <= 20);
}

function aggiornaStatisticheM5() {
  document.getElementById('m5-question-counter').textContent =
    `Domanda ${Math.min(m5State.indice + 1, m5State.domande.length)} / ${m5State.domande.length}`;
  document.getElementById('m5-correct-counter').textContent = m5State.corrette;
}

function mostraDomandaM5() {
  if (m5State.terminata) return;

  if (m5State.indice >= m5State.domande.length) {
    terminaM5('Domande finite!');
    return;
  }

  const domanda = m5State.domande[m5State.indice];
  const box = document.getElementById('m5-question-box');
  const risposte = document.getElementById('m5-answers');

  box.classList.remove('fade-in-el');
  void box.offsetWidth;
  box.classList.add('fade-in-el');
  document.getElementById('m5-question-text').textContent = domanda.testo;
  risposte.innerHTML = '';

  domanda.risposte.forEach((risposta, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn-raffica-answer fade-in-el';
    btn.style.animationDelay = (i * 60) + 'ms';
    btn.textContent = risposta.testo;
    btn.addEventListener('click', () => onRispostaM5(risposta.corretta, btn));
    risposte.appendChild(btn);
  });

  aggiornaStatisticheM5();
}

function onRispostaM5(corretta, btnCliccato) {
  if (m5State.terminata) return;

  document.querySelectorAll('#m5-answers .btn-raffica-answer').forEach(b => b.disabled = true);
  const fb = document.getElementById('m5-feedback');

  if (corretta) {
    btnCliccato.classList.add('correct');
    // Nessun suono come richiesto
    m5State.corrette++;
    aggiornaPunteggio(punteggioTotale + m5State.puntiPerRisposta);
    fb.textContent = `✓ Esatto! +${m5State.puntiPerRisposta.toLocaleString('it-IT')} punti`;
    fb.className = 'm5-feedback ok';
  } else {
    btnCliccato.classList.add('wrong');
    // Nessun suono come richiesto
    document.querySelectorAll('#m5-answers .btn-raffica-answer').forEach((b, idx) => {
      if (m5State.domande[m5State.indice].risposte[idx]?.corretta) b.classList.add('correct');
    });
    fb.textContent = '✗ Risposta errata';
    fb.className = 'm5-feedback fail';
  }

  m5State.indice++;
  aggiornaStatisticheM5();
  setTimeout(() => {
    if (m5State.terminata) return;
    fb.className = 'm5-feedback hidden';
    mostraDomandaM5();
  }, 650);
}

function terminaM5(messaggio) {
  if (m5State.terminata) return;
  m5State.terminata = true;
  clearInterval(m5Timer);
  fermaSuono('snd-suspence');
  document.getElementById('m5-question-counter').textContent = messaggio;
  document.getElementById('m5-question-text').textContent =
    `Hai risposto correttamente a ${m5State.corrette} domande. \nTotale manche: ${(m5State.corrette * m5State.puntiPerRisposta).toLocaleString('it-IT')} punti.`;
  document.getElementById('m5-answers').innerHTML = '';
  document.getElementById('m5-feedback').className = 'm5-feedback hidden';
  document.getElementById('m5-next-bar').classList.remove('hidden');
  if (m5State.secondiRimasti <= 0) suona('snd-gong');
}

/* ====================================================
   MANCHE FINALE — GHIGLIOTTINA
   ==================================================== */
let m6State = {};
let m6Timer = null;

function initM6() {
  m6State = {
    coppie:        dati.finale.coppie,
    soluzione:     dati.finale.soluzione,
    coppiaNdx:     0,
    paroleScelte:  [],
    secondiRimasti: 60
  };
  aggiornaPunteggio(punteggioTotale);
  mostraSchermata('screen-m6');

  // Mostra Fase 1
  mostraFaseM6(1);
  mostraCoppia();

  // Bottone soluzione
  document.getElementById('m6-btn-solution').addEventListener('click', mostraSoluzione);

  // Bottoni regia
  document.getElementById('m6-btn-ok').addEventListener('click', () => fineGhigliottina(true));
  document.getElementById('m6-btn-no').addEventListener('click', () => fineGhigliottina(false));
}

function mostraFaseM6(n) {
  document.querySelectorAll('.m6-phase').forEach(p => p.classList.add('hidden'));
  document.getElementById(`m6-phase${n}`).classList.remove('hidden');
}

/* FASE 1: scelta parole */
function mostraCoppia() {
  const coppia    = m6State.coppie[m6State.coppiaNdx];
  const container = document.getElementById('m6-pair-container');
  container.innerHTML = '';

  ['a', 'b'].forEach(lato => {
    const parola = coppia[`parola_${lato}`];
    const btn = document.createElement('button');
    btn.className   = 'btn-parola fade-in-el';
    btn.textContent = parola;
    btn.dataset.parola = parola;
    btn.addEventListener('click', () => onSceltaParola(parola, btn));
    container.appendChild(btn);
  });

  document.getElementById('m6-pair-counter').textContent =
    `Coppia ${m6State.coppiaNdx + 1} / ${m6State.coppie.length}`;
}

function onSceltaParola(parola, btn) {
  const coppia    = m6State.coppie[m6State.coppiaNdx];
  const corretta  = coppia.corretta;

  // Disabilita entrambi i bottoni
  document.querySelectorAll('.btn-parola').forEach(b => b.disabled = true);

  if (parola === corretta) {
    btn.classList.add('correct');
    suona('snd-ok');
    m6State.paroleScelte.push(parola);
    aggiungiChip(parola);
  } else {
    btn.classList.add('wrong');
    suona('snd-cut');
    // Mostra quella corretta
    document.querySelectorAll('.btn-parola').forEach(b => {
      if (b.dataset.parola === corretta) b.classList.add('correct');
    });
    // DIMEZZA il punteggio (con animazione)
    aggiornaPunteggio(Math.floor(punteggioTotale / 2), true);
    m6State.paroleScelte.push(corretta);
    aggiungiChip(corretta);
  }

  m6State.coppiaNdx++;

  if (m6State.coppiaNdx < m6State.coppie.length) {
    setTimeout(mostraCoppia, 1200);
  } else {
    // Tutte le coppie completate → Fase 2
    setTimeout(iniziaTimerM6, 1400);
  }
}

function aggiungiChip(parola) {
  const wrap = document.getElementById('m6-chosen-words');
  const chip = document.createElement('span');
  chip.className   = 'm4-word-chip';
  chip.textContent = parola;
  wrap.appendChild(chip);
}

/* FASE 2: timer */
function iniziaTimerM6() {
  // Popola indizi
  const indiziWrap = document.getElementById('m6-indizi');
  indiziWrap.innerHTML = '';
  m6State.paroleScelte.forEach((p, i) => {
    const chip = document.createElement('div');
    chip.className = 'm4-indizio-chip fade-in-el';
    chip.style.animationDelay = (i * 60) + 'ms';
    chip.textContent = p;
    indiziWrap.appendChild(chip);
  });

  mostraFaseM6(2);
  m6State.secondiRimasti = 60;
  aggiornaTimerDisplayM6();

  suona('snd-suspence');

  m6Timer = setInterval(() => {
    m6State.secondiRimasti--;
    aggiornaTimerDisplayM6();
    if (m6State.secondiRimasti <= 0) {
      clearInterval(m6Timer);
      tempoScaduto();
    }
  }, 1000);
}

function aggiornaTimerDisplayM6() {
  const el  = document.getElementById('m6-timer');
  const min = Math.floor(m6State.secondiRimasti / 60);
  const sec = m6State.secondiRimasti % 60;
  el.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
  if (m6State.secondiRimasti <= 20) {
    el.classList.add('danger');
  }
}

function tempoScaduto() {
  fermaSuono('snd-suspence');
  suona('snd-gong');
  mostraFaseSoluzioneGhigliottina();
}

/* FASE 3: soluzione */
function mostraFaseSoluzioneGhigliottina() {
  // Popola indizi nella fase 3
  const indiziWrap = document.getElementById('m6-indizi-final');
  indiziWrap.innerHTML = '';
  m6State.paroleScelte.forEach((p, i) => {
    const chip = document.createElement('div');
    chip.className = 'm4-indizio-chip fade-in-el';
    chip.style.animationDelay = (i * 100) + 'ms';
    chip.textContent = p;
    indiziWrap.appendChild(chip);
  });

  document.getElementById('m6-solution-word').classList.add('hidden');
  document.getElementById('m6-regia-buttons').classList.add('hidden');
  document.getElementById('m6-btn-solution').classList.remove('hidden');

  mostraFaseM6(3);
}

function mostraSoluzione() {
  const solEl = document.getElementById('m6-solution-word');
  solEl.textContent = m6State.soluzione;
  solEl.classList.remove('hidden');
  document.getElementById('m6-btn-solution').classList.add('hidden');

  // Bottoni regia con fade
  setTimeout(() => {
    document.getElementById('m6-regia-buttons').classList.remove('hidden');
  }, 600);
}

/* FASE 4: esito */
function fineGhigliottina(vittoria) {
  if (vittoria) {
    suona('snd-winner');
    document.getElementById('win-score').textContent = punteggioTotale.toLocaleString('it-IT');
    mostraSchermata('screen-win');
  } else {
    document.getElementById('lose-score').textContent = punteggioTotale.toLocaleString('it-IT');
    mostraSchermata('screen-lose');
  }
}

/* ====================================================
   AVVIO APPLICAZIONE
   ==================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await caricaElencoSessioni();
    initHome();
    initConfig();
    mostraSchermata('screen-home');
  } catch (err) {
    console.error('Errore nel caricamento delle sessioni:', err);
    // Fallback: mostra comunque la home
    mostraSchermata('screen-home');
  }
});
