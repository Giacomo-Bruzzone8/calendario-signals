# Calendar Component

## Scopo

Il **Calendar Component** è un componente Angular che rappresenta un mese tramite una griglia settimanale chiara, stabile e leggibile.

La sua responsabilità principale è:

- visualizzare i giorni del mese
- permettere la selezione di una data
- mantenere continuità visiva tra l’inizio e la fine del mese

Il componente non gestisce eventi o logiche di pianificazione: si occupa esclusivamente della rappresentazione del calendario mensile.

In linea con l’architettura dell’applicazione, il componente non coordina altri moduli né interpreta i contenuti associati alla data selezionata.  
La sua responsabilità termina con la selezione del giorno o con la navigazione verso la vista di dettaglio.

---

## Modello concettuale

Il calendario adotta un modello mentale standard e immediatamente riconoscibile.

### Griglia mensile
Il mese viene rappresentato come una griglia di settimane:

- 7 colonne → giorni della settimana
- 5 o 6 righe → settimane del mese

### Continuità visiva
Per evitare celle vuote:

- i giorni finali del mese precedente completano la prima settimana
- i giorni iniziali del mese successivo completano l’ultima settimana

La griglia risulta così sempre completa e prevedibile.

### Convenzione settimanale
Il componente segue la convenzione europea:

- **lunedì** come primo giorno della settimana
- **domenica** come ultimo

### Stati semantici dei giorni
Ogni giorno può assumere uno o più stati utili al rendering:

- `currentMonth`
- `previousMonth`
- `nextMonth`
- `isToday`

Questi stati guidano stile e comportamento interattivo.

---

## Modello dati

L’unità base del calendario è `CalendarDay`.

### CalendarDay

Ogni elemento della griglia contiene almeno:

- `year`
- `month`
- `date`
- `currentMonth`
- `previousMonth`
- `nextMonth`
- `isToday`

Questa struttura permette di distinguere con chiarezza i giorni del mese visualizzato da quelli usati solo per completare la griglia.

### Derivazione dei dati

La griglia non viene fornita dall’esterno, ma generata internamente a partire da una sola informazione:

- `currentDate` → data di riferimento del mese visualizzato

Da essa vengono derivati:

- i giorni del mese precedente necessari alla prima settimana
- tutti i giorni del mese corrente
- i giorni del mese successivo necessari a chiudere la griglia

---

## Regole di costruzione della griglia

La costruzione del calendario segue una logica deterministica.

### 1. Mese visualizzato
Dal valore di `currentDate` vengono ricavati:

- anno
- mese

### 2. Offset iniziale
Si individua il primo giorno del mese e si calcola il suo indice settimanale, normalizzato su settimana che inizia di lunedì.

Questo offset determina quanti giorni del mese precedente devono essere mostrati.

### 3. Giorni del mese corrente
Vengono generati tutti i giorni del mese selezionato, dal giorno 1 all’ultimo.

### 4. Completamento finale
Se la lista totale non completa l’ultima settimana, vengono aggiunti i primi giorni del mese successivo fino ad arrivare a una griglia completa.

### 5. Stati semantici
Durante la costruzione vengono assegnati gli stati utili al rendering:

- appartenenza al mese corrente o adiacente
- giorno odierno

Lo stato di selezione non viene assegnato durante questa fase, ma è derivato dal componente in base al valore di `selectedDate`.

---

## Flusso di elaborazione

La pipeline del componente può essere letta così:

1. lettura di `currentDate`
2. determinazione del mese visualizzato
3. calcolo dell’offset iniziale
4. generazione dei giorni del mese corrente
5. aggiunta dei giorni dei mesi adiacenti
6. assegnazione degli stati semantici
7. rendering della griglia

Il risultato è una lista ordinata di `CalendarDay`, pronta per il template.

---

## Rendering e struttura visiva

Il rendering è semplice e dichiarativo.

### Header
L’header mostra:

- mese corrente visualizzato
- anno
- controlli di navigazione tra i mesi

### Riga dei giorni della settimana
Mostra le abbreviazioni localizzate dei sette giorni, da lunedì a domenica.

### Griglia del calendario
Ogni elemento `CalendarDay` viene renderizzato come una cella della griglia.

Ogni cella:

- mostra il numero del giorno
- applica classi semantiche
- gestisce il click di selezione

Classi tipiche:

- `.current-month`
- `.previous-month`
- `.next-month`
- `.today`
- `.selected`

### Legenda
La legenda è opzionale e serve a spiegare gli stati visivi dei giorni.

---

## Architettura Angular

L’architettura del componente può essere divisa in tre blocchi principali.

### 1. Stato interno
Lo stato è minimale e comprende:

- `currentDate`
- `selectedDate`
- `locale`

`selectedDate` rappresenta il giorno attualmente selezionato nella vista e viene usato per derivare lo stato visivo di selezione delle celle della griglia.

`locale` rappresenta la lingua corrente del calendario (es. "it", "en") e viene utilizzato per la localizzazione dei nomi dei giorni e dei mesi.

Questi valori sono gestiti tramite **Signals**:

### 2. Costruzione della griglia
La logica di calcolo è separata dal template e si occupa di:

- determinare il primo giorno del mese
- calcolare l’offset
- generare i giorni del mese corrente
- aggiungere i giorni dei mesi adiacenti
- assegnare gli stati semantici

### 3. Template dichiarativo
Il template si limita a:

- mostrare header e giorni della settimana
- iterare sulla griglia
- applicare classi CSS
- gestire la selezione

Non contiene logica di calcolo temporale.

---

## Reattività

L’uso di Signals rende il componente completamente reattivo.

Ogni modifica a:

- mese visualizzato
- data selezionata
- lingua corrente

rigenera automaticamente i dati derivati e aggiorna il rendering.

Questo mantiene il componente semplice, prevedibile e privo di side effects non necessari.

---

## Limiti del componente

Il Calendar Component non si occupa di:

- eventi
- ricorrenze
- scheduling
- conflitti temporali
- business logic
- selezione multipla o per intervalli
- drag-and-drop
- configurazioni alternative della settimana

Il componente adotta infatti una struttura mensile standard con settimana che inizia di lunedì.

---

## Estensioni future

L’architettura permette di introdurre facilmente:

- indicatori di eventi sui giorni
- range selection
- tooltip
- drag-and-drop
- supporto a settimane configurabili
- viste alternative
- integrazione con componenti esterni come timeline giornaliera o agenda

---

## Sintesi finale

Il Calendar Component è un componente mensile focalizzato sulla rappresentazione dei giorni e sulla selezione della data.

La sua forza sta in un modello semplice:

- stato minimo
- griglia derivata in modo deterministico
- rendering dichiarativo
- semantica visiva chiara

Questo lo rende:

- leggibile
- stabile
- testabile
- facilmente integrabile con il resto dell’applicazione