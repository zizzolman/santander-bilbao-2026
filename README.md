# Santander & Bilbao — sito multipagina bilingue

Sito statico pronto per GitHub Pages (nessun server, nessuna chiave API).

## File

- `index.html`: home con voli, alloggi, trasporti, checklist e collegamenti ai giorni.
- `04-santander.html`: venerdì 4 dicembre — Santander.
- `05-bilbao.html`: sabato 5 dicembre — Bilbao / Casco Viejo.
- `06-bilbao.html`: domenica 6 dicembre — Bilbao / Ensanche e Artxanda.
- `07-guggenheim.html`: lunedì 7 dicembre — Guggenheim e rientro a Santander.
- `08-rientro.html`: martedì 8 dicembre — aeroporto e rientro.
- `assets/style.css`: stile responsive.
- `assets/data.js`: testi e dati in italiano e spagnolo.
- `assets/app.js`: navigazione, Google Maps, traduzione e checklist.

## Pubblicazione su GitHub Pages

1. Apri `https://github.com/zizzolman/santander-bilbao-2026`.
2. Carica **i sei HTML e la cartella `assets`** nella radice del repository, sovrascrivendo il vecchio `index.html`.
3. Verifica `Settings > Pages > Deploy from a branch > main > / (root)`.
4. Controlla `Actions` per il deploy e apri `https://zizzolman.github.io/santander-bilbao-2026/`.

**Importante:** non caricare il file ZIP come unico file. Estrai prima il contenuto e carica i file mantenendo la cartella `assets`.

## Note

- Il pulsante della lingua salva la preferenza in `localStorage`: rimane attiva anche cambiando pagina.
- Le spunte vengono salvate **solo nel browser/dispositivo in uso**. Non sono sincronizzate fra i due telefoni.
- Le mappe Google incorporate mostrano la zona; il percorso completo con tappe usa Google Maps in una nuova scheda. I collegamenti funzionano senza chiave API.
- Per caricare correttamente le risorse locali, apri la guida pubblicata su GitHub Pages o tramite un server locale.
- Prezzi, corse autobus, disponibilità dei ristoranti e orari possono variare; verificare per le date del viaggio.
