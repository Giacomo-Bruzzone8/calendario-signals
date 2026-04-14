# Timeline Circolare

## Scopo

Il **Timeline Circolare** è un componente Angular che rappresenta le 24 ore attraverso una visualizzazione radiale.  
Il tempo NON viene trattato come una linea, ma come un ciclo continuo, suddiviso in due circonferenze da 12 ore:

- **ciclo diurno** → 08:00–19:59
- **ciclo notturno** → 20:00–07:59

Il componente ha una sola responsabilità: **visualizzare eventi temporali sotto forma di archi** in modo chiaro, coerente e leggibile.

In linea con l’architettura dell’applicazione, il componente non determina autonomamente il giorno da visualizzare né gestisce la navigazione o il recupero dei dati.  
Riceve eventi già riferiti a una specifica giornata e si limita alla loro rappresentazione.

---

## Modello concettuale

La visualizzazione si basa su alcuni principi:

- **ciclicità del tempo**: le 24 ore sono rappresentate come due cicli continui
- **coerenza radiale**: ore, etichette e archi seguono una logica polare comune
- **semplicità semantica**: ogni arco corrisponde a un intervallo temporale definito
- **separazione delle responsabilità**: il componente non gestisce scheduling, validazione o business logic
- **leggibilità**: gli archi delle attività sono posizionati sulla circonferenza esterna

I punti di transizione tra i due cicli sono:

- **19:59 → 20:00**
- **07:59 → 08:00**

---

## Modello dati

Il componente riceve eventi già validi e normalizzati.

### Eventi temporali

Ogni evento temporale contiene almeno:

- `start`
- `end`
- `tipo`

Può inoltre includere proprietà opzionali utili alla rappresentazione.

Solo gli eventi temporali generano archi.

### Eventi non temporali

Eventi come note, spese, ricavi o informazioni accessorie non producono archi sulla timeline, ma possono essere gestiti altrove nell’interfaccia.

### Assunzioni

Il componente assume che:

- `start < end`
- i dati siano già coerenti rispetto a timezone e formato
- eventuali sovrapposizioni siano intenzionali
- il mapping categoria → colore sia definito esternamente

---

## Regole di rappresentazione

Un evento può produrre **uno o due archi**.

### Evento interno a un solo ciclo
Se `start` e `end` appartengono allo stesso ciclo, viene generato **un solo arco**.

Esempi:

- `09:00 → 13:00` → arco diurno
- `22:00 → 23:30` → arco notturno

### Evento che attraversa un confine
Se l’evento supera uno dei due punti di transizione, viene suddiviso in **due porzioni**, una per ciascun ciclo.

Esempi:

- `18:00 → 20:00`
  - `18:00 → 19:59` → diurno
  - `20:00 → 20:00+` → notturno

- `06:00 → 09:00`
  - `06:00 → 07:59` → notturno
  - `08:00 → 09:00` → diurno

---

## Flusso di elaborazione

La pipeline del componente è deterministica:

1. ricezione degli eventi temporali
2. estrazione degli orari rilevanti
3. determinazione del ciclo di appartenenza
4. eventuale suddivisione agli attraversamenti
5. conversione degli orari in angoli
6. costruzione dei parametri geometrici degli archi
7. rendering SVG

Il risultato è un insieme di archi pronti per essere disegnati.

---

## Geometria angolare

Ogni circonferenza rappresenta **12 ore = 360°**.

Quindi:

- **1 ora = 30°**
- **1 minuto = 0.5°**

L’angolo viene calcolato in relazione all’inizio del ciclo:

- ciclo diurno → riferimento: `08:00`
- ciclo notturno → riferimento: `20:00`

Formula generale:

`angolo = (oreRelative × 30) + (minuti × 0.5)`

Convenzioni:

- `0°` in alto
- incremento in senso orario

La durata dell’evento è quindi proporzionale all’ampiezza dell’arco.

---

## Rendering SVG

Il componente usa una struttura SVG composta da tre livelli:

1. **circonferenze base**
2. **archi delle attività**
3. **etichette delle ore**

Elementi principali:

- `<circle>` per i cicli
- `<path>` per gli archi
- `<text>` per le etichette

L’ordine di rendering è:

1. circonferenze
2. archi
3. etichette

Questo garantisce gerarchia visiva e leggibilità.

---

## Architettura Angular

Il componente può essere letto in quattro blocchi logici:

### 1. Input
Riceve:

- eventi temporali
- eventi non temporali opzionali
- configurazioni visive
- parametri di layout

Gli input sono trattati come immutabili.

### 2. Parsing e normalizzazione
Interpreta i dati e produce una lista uniforme di porzioni di evento già associate al ciclo corretto.

### 3. Calcolo geometrico
Trasforma le porzioni in archi SVG, definendo:

- angolo iniziale
- angolo finale
- raggio
- colore
- spessore

### 4. Template
Il template si limita a renderizzare i dati calcolati, senza logica geometrica complessa.

---

## Stato e reattività

Lo stato interno dovrebbe restare minimo e derivato dagli input:

- eventi normalizzati
- archi calcolati
- configurazioni derivate

L’uso di **Signals** è coerente con questa architettura, perché permette aggiornamenti reattivi e deterministici senza side effects inutili.

---

## Limiti del componente

Il Timeline Circolare non si occupa di:

- scheduling complesso
- validazione avanzata
- risoluzione dei conflitti
- ricorrenze
- business logic
- interazioni avanzate come hover, click, tooltip o animazioni

Questi aspetti possono essere aggiunti esternamente o in versioni successive.

---

## Estensioni future

L’architettura permette di introdurre facilmente:

- tooltip e interazioni
- animazioni
- nuovi stili grafici
- livelli informativi aggiuntivi
- cicli temporali configurabili
- nuovi tipi di eventi

---

## Sintesi finale

Il Timeline Circolare è un componente radiale focalizzato sulla rappresentazione visiva del tempo.  
La sua forza sta nella semplicità del modello: dati temporali in ingresso, suddivisione per ciclo, conversione angolare e rendering SVG.

Il componente resta così:

- modulare
- testabile
- prevedibile
- estendibile