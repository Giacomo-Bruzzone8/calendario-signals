# Calendar Component — Introduzione

Il **Calendar Component** è progettato per rappresentare la struttura temporale di un mese in modo chiaro, leggibile e semanticamente coerente.  

L’obiettivo del componente è fornire una base solida per:

- selezionare una data  
- visualizzare la distribuzione dei giorni nel mese  
- distinguere chiaramente i confini tra mesi   

Il design del calendario è costruito su principi di semplicità, continuità visiva e prevedibilità, così da risultare immediatamente comprensibile a qualsiasi utente.

---

# Modello concettuale

Il Calendar si basa su un modello mentale universale e consolidato.

## Struttura a griglia 7×5 o 7×6

Il mese viene rappresentato come una **griglia di settimane**, dove:

- ogni colonna rappresenta un giorno della settimana  
- ogni riga rappresenta una settimana  
- la griglia può avere 5 o 6 righe a seconda del mese  

Questa struttura garantisce stabilità visiva e prevedibilità.

## Continuità dei giorni

Per evitare “buchi” nella griglia:

- i giorni del mese precedente vengono mostrati all’inizio della prima settimana  
- i giorni del mese successivo completano l’ultima settimana  

La griglia risulta così **sempre completa**, indipendentemente dal mese.

## Settimana che inizia di lunedì

Il calendario utilizza lo standard europeo:

- **Lunedì** come primo giorno della settimana  
- **Domenica** come ultimo  

Questo influisce sulla logica di calcolo degli offset e sulla disposizione della griglia.

## Stati semantici dei giorni

Ogni giorno possiede uno stato semantico che ne definisce il ruolo:

- **currentMonth** → indica che il giorno appartiene al mese attualmente visualizzato, indipendentemente dal mese reale corrente.
- **previousMonth** → giorno del mese precedente  
- **nextMonth** → giorno del mese successivo  
- **today** → giorno corrente  
- **selected** → giorno selezionato dall’utente  

Questi stati guidano lo stile e l’interazione.

# Fondamenti del componente

Il Calendar Component si basa su alcuni principi fondamentali che guidano sia la sua struttura interna sia la sua rappresentazione visiva.  
Questi principi garantiscono coerenza, prevedibilità e una chiara interpretazione dei dati temporali.

---

## Principi chiave

### **Linearità temporale**
Il calendario rappresenta il tempo in modo lineare:

- i giorni sono disposti in ordine sequenziale  
- le settimane scorrono dall’alto verso il basso  
- la struttura rimane stabile indipendentemente dal mese  

Questa linearità rende immediata la lettura e l’interpretazione della distribuzione temporale.

### **Separazione delle responsabilità**
Il componente:

- non gestisce eventi complessi  
- non interpreta ricorrenze  
- non applica logiche di scheduling  

La sua responsabilità è esclusivamente quella di **rappresentare i giorni** e gestire la selezione.

### **Internazionalizzazione**
Il calendario supporta:

- nomi dei giorni localizzati  
- nomi dei mesi localizzati  
- aggiornamento dinamico della lingua  

Questo garantisce coerenza con il resto dell’applicazione e adattabilità a contesti multilingua.

---

# Modello dei dati

Il Calendar Component utilizza un modello dati semplice ma espressivo, progettato per rappresentare in modo chiaro tutte le informazioni necessarie alla costruzione della griglia mensile.  
La struttura è pensata per essere minimale, leggibile e facilmente integrabile con altri componenti dell’applicazione.

---

## CalendarDay

L’unità fondamentale del calendario è il tipo **CalendarDay**, che rappresenta un singolo giorno all’interno della griglia.

Ogni giorno contiene:

- **year**          → anno numerico (es. 2026)  
- **month**         → mese numerico (0–11)  
- **date**          → giorno del mese (1–31)  
- **currentMonth**  → indica se il giorno appartiene al mese visualizzato  
- **previousMonth** → indica se il giorno appartiene al mese precedente  
- **nextMonth**     → indica se il giorno appartiene al mese successivo  
- **isToday**       → indica se il giorno corrisponde alla data odierna  
- **selected**      → indica se il giorno è selezionato dall’utente  

Questa struttura permette di distinguere chiaramente i diversi tipi di giorno e di applicare stili coerenti.

---

## Stati semantici

Gli stati semantici sono fondamentali per la leggibilità del calendario.  
Ogni giorno può appartenere a una delle seguenti categorie:

- **Giorni del mese corrente**  
  Visualizzati con stile principale.  
  Sono i giorni che l’utente si aspetta di vedere nel mese selezionato.

- **Giorni del mese precedente**  
  Mostrati per completare la prima settimana.  
  Aiutano a mantenere continuità visiva.

- **Giorni del mese successivo**  
  Mostrati per completare l’ultima settimana.  
  Mantengono la griglia stabile e prevedibile.

- **Giorno corrente (today)**  
  Evidenziato per fornire un riferimento temporale immediato.

- **Giorno selezionato (selected)**  
  Indica la scelta dell’utente ed è utilizzato per interazioni successive.

---

## Derivazione dei dati

Il modello dei dati non viene fornito dall’esterno:  
viene **generato internamente** dal componente a partire da una singola informazione:

- la **data corrente visualizzata** (`currentDate`)

Da questa data vengono derivati:

- i giorni del mese precedente necessari a completare la prima settimana  
- tutti i giorni del mese corrente  
- i giorni del mese successivo necessari a completare la griglia  

Il risultato è una lista completa e ordinata di oggetti `CalendarDay`.
il calendario non gestisce eventi, ricorrenze o logiche complesse, ma si concentra esclusivamente sulla rappresentazione dei giorni.

# Flusso di elaborazione

Il Calendar Component segue un flusso di elaborazione chiaro e deterministico, che trasforma una singola data di riferimento in una griglia mensile completa, coerente e semanticamente strutturata.  
Ogni fase ha una responsabilità precisa e contribuisce alla costruzione della rappresentazione finale.

---

## 1. Determinazione del mese visualizzato

Il punto di partenza è la variabile reattiva:

- **currentDate** → rappresenta il mese attualmente visualizzato

Da questa data vengono estratti:

- anno corrente  
- mese corrente  

Queste informazioni costituiscono la base per tutti i calcoli successivi.

---

## 2. Calcolo dei giorni del mese precedente

Per determinare quanti giorni del mese precedente devono essere mostrati nella prima settimana:

1. si identifica il **primo giorno del mese corrente**  
2. si calcola il suo **indice di giorno della settimana**, normalizzato affinché il calendario inizi di lunedì  
3. si estraggono gli ultimi *N* giorni del mese precedente, dove *N* è l’offset calcolato

Questi giorni vengono marcati con:

- `previousMonth = true`  
- `currentMonth = false`  
- `nextMonth = false`

---

## 3. Calcolo dei giorni del mese corrente

Vengono generati tutti i giorni del mese corrente, da 1 all’ultimo giorno del mese.

Ogni giorno viene marcato con:

- `currentMonth = true`  
- `previousMonth = false`  
- `nextMonth = false`

Inoltre, viene identificato:

- il **giorno odierno** (`isToday = true`)  
- il **giorno selezionato** (`selected = true`)

---

## 4. Calcolo dei giorni del mese successivo

Una volta combinati:

- giorni del mese precedente  
- giorni del mese corrente  

si verifica se la griglia è completa.

Se il totale non è multiplo di 7, vengono aggiunti i primi giorni del mese successivo fino a completare l’ultima settimana.

Questi giorni vengono marcati con:

- `nextMonth = true`  
- `currentMonth = false`  
- `previousMonth = false`

---

## 5. Composizione della griglia finale

La griglia finale è ottenuta concatenando:

1. `previousMonthDays`  
2. `currentMonthDays`  
3. `nextMonthDays`  

Il risultato è una lista ordinata e completa di oggetti `CalendarDay`, pronta per essere renderizzata nel template.

---

## 6. Gestione della selezione

Quando l’utente seleziona un giorno:

- il valore di `selectedDate` viene aggiornato  
- la griglia viene rivalutata tramite Signals  
- lo stile del giorno selezionato viene applicato automaticamente  

La selezione non modifica la struttura della griglia, ma solo il suo stato visivo.

---

## 7. Reattività e aggiornamenti

Il componente utilizza Signals per garantire:

- aggiornamenti immediati quando cambia la lingua  
- aggiornamenti immediati quando cambia il mese visualizzato  
- aggiornamenti immediati quando cambia il giorno selezionato  

Ogni modifica rigenera automaticamente i computed signals, mantenendo la griglia sempre coerente.
Il risultato è una rappresentazione mensile completa, leggibile e pronta per essere utilizzata come base per funzionalità più avanzate.

# Rendering e struttura visiva

La rappresentazione visiva del Calendar Component è costruita su una struttura semplice, leggibile e coerente con il modello concettuale.  
Il rendering si basa su elementi HTML e classi semantiche che riflettono lo stato di ciascun giorno, garantendo una visualizzazione chiara e immediatamente interpretabile.

---

## 1. Header

L’header contiene:

- il nome del mese  
- l’anno  
- i pulsanti di navigazione (mese precedente / mese successivo)

Il suo ruolo è fornire un contesto temporale chiaro e permettere all’utente di muoversi tra i mesi in modo intuitivo.

---

## 2. Days of Week Row

La riga dei giorni della settimana mostra le abbreviazioni localizzate:

- Lunedì  
- Martedì  
- Mercoledì  
- Giovedì  
- Venerdì  
- Sabato  
- Domenica  

Questa riga funge da riferimento visivo per interpretare correttamente la griglia sottostante.

---

## 3. Calendar Grid

La griglia è il cuore del componente.  
È composta da una sequenza ordinata di oggetti `CalendarDay`, ognuno rappresentato da una cella.

Ogni cella:

- mostra il numero del giorno  
- applica classi semantiche basate sul modello dati  
- gestisce la selezione tramite click  
- mantiene proporzioni e spaziature costanti  

Le classi semantiche applicate includono:

- `.current-month`  
- `.previous-month`  
- `.next-month`  
- `.today`  
- `.selected`  

Queste classi determinano lo stile visivo del giorno e ne comunicano immediatamente il ruolo.

---

## 4. Legend

La legenda fornisce una spiegazione visiva degli stati semantici:

- giorni del mese corrente  
- giorni del mese precedente  
- giorni del mese successivo  
- giorno corrente  
- giorno selezionato  

La legenda è opzionale ma utile per rendere il componente autoesplicativo.
Il risultato è una rappresentazione mensile pulita, leggibile e pronta per essere utilizzata come base per funzionalità più avanzate.

# Architettura del componente

L’architettura del Calendar Component è progettata per essere essenziale, prevedibile e facile da estendere.  
Ogni parte del componente ha una responsabilità chiara e contribuisce alla costruzione della griglia mensile in modo deterministico.

---

## Struttura generale

Il componente è organizzato in tre livelli principali:

1. **Stato interno**
2. **Costruzione della griglia**
3. **Rendering dichiarativo**

Questa suddivisione garantisce ordine e semplicità, evitando sovrapposizioni tra logica e presentazione.

---

## 1. Stato interno

Lo stato mantenuto dal componente è minimale e comprende:

- **currentDate** → rappresenta la data di riferimento per determinare il mese visualizzato, non la data odierna.
- **selectedDate** → giorno selezionato  
- **locale** → lingua corrente  

Questi valori sono gestiti tramite Signals, assicurando aggiornamenti immediati e un comportamento completamente reattivo.

---

## 2. Costruzione della griglia

La logica di calcolo della griglia è isolata dal template e si occupa di:

- determinare il primo giorno del mese  
- calcolare l’offset iniziale  
- generare i giorni del mese corrente  
- completare la griglia con i giorni dei mesi adiacenti  
- applicare gli stati semantici ai singoli giorni  

Il risultato è una lista ordinata di `CalendarDay`, già pronta per il rendering.

---

## 3. Rendering dichiarativo

Il template si limita a:

- mostrare l’header  
- mostrare i giorni della settimana  
- iterare sulla griglia  
- applicare classi semantiche  
- gestire la selezione  

Non contiene logiche di calcolo: la costruzione della griglia è interamente delegata alla fase precedente.
La struttura rimane intenzionalmente minimale, così da rendere il componente stabile, leggibile e semplice da mantenere.

# Considerazioni finali e limiti

Il Calendar Component è progettato per rappresentare in modo chiaro e immediato la struttura temporale di un mese.  
La sua architettura minimale, la separazione delle responsabilità e l’uso di uno stato reattivo lo rendono uno strumento semplice, stabile e facilmente integrabile.

Tuttavia, il componente presenta alcuni limiti intenzionali:

---

## Limiti del componente

- **Nessuna gestione degli eventi**  
  Il calendario non interpreta né visualizza eventi, appuntamenti o ricorrenze.  
  La sua responsabilità è esclusivamente la rappresentazione dei giorni.

- **Nessuna logica di scheduling**  
  Il componente non gestisce conflitti, sovrapposizioni o regole di pianificazione.  
  Qualsiasi logica avanzata deve essere implementata esternamente.

- **Nessuna interpretazione semantica avanzata**  
  Gli stati dei giorni sono puramente visivi.  
  Il componente non assegna significati aggiuntivi né applica regole di business.

- **Interazioni limitate**  
  L’unica interazione prevista è la selezione di un giorno.  
  Funzionalità come range selection, tooltip o drag-and-drop non sono incluse nella versione base.

- **Struttura temporale fissa**  
  Il calendario utilizza una griglia mensile standard con settimana che inizia di lunedì.  
  Configurazioni alternative (es. settimana che inizia di domenica) non sono previste nativamente.

---

## Obiettivo del design

Questi limiti non rappresentano mancanze, ma scelte progettuali deliberate.  
Il componente rimane focalizzato sulla sua responsabilità principale:

**fornire una rappresentazione mensile chiara, stabile e semanticamente coerente, pronta per essere estesa o integrata in contesti più complessi.**

La sua semplicità è la sua forza: permette di costruire funzionalità avanzate senza compromettere la leggibilità e la prevedibilità del componente di base.
