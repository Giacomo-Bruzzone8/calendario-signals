# SIGNAL => CREA UN CONTENITORE REATTIVO CHE SI AGGIORNA IN BASE A DETERMINATE CIRCOSTANZE
# COMPUTED => CREA UN CONTENITORE CHE SI AGGIORNA AUTOMATICAMENTE QUANDO I SIGNAL CHE LO COMPONGONO CAMBIANO

# COME JAVASCRIPT RICONOSCE IL TEMPO
- Per i mesi usa 0-11: 0 
  QUINDI: 0 = Gennaio, 11 = Dicembre
- Per i giorni usa 0-6
  QUINDI: 0 = Domenica, 6 = Sabato


# OGGETTO DATE IN TYPESCRIPT / JAVASCRIPT
1. QUALI SONO I PARAMETRI DI INGRESSO?
Le forme principali sono:

A- Senza Argomenti ->
 esempio => const d = new Date();
B- Con Timestamp (millisecondi dal 1/1/1970 UTC)
 esempio => const d = new Date(1700000000000);
C- Con Stringa ->
 esempio => const d = new Date('2024-02-25T10:30:00'); !PRESTARE ATTENZIONE AL FORMATO!
D- Con parametri numerici separati
 esempio => const d = new Date(year, monthIndex, day?, hours?, minutes?, seconds?, ms?);

SPIEGAZIONE DEI PARAMETRI =>
year → anno (es. 2024)
monthIndex → 0–11 (0 = gennaio, 11 = dicembre)
day → 1–31 (default: 1)
hours → 0–23 (default: 0)
minutes, seconds, ms → opzionali, default 0

2. Metodi nativi di Date =>
Getters:
- getFullYear() → anno (es. 2024)
- getMonth() → mese 0–11
- getDate() → giorno del mese 1–31
- getDay() → giorno della settimana 0–6 (0 = domenica)
- getHours(), getMinutes(), getSeconds()

Setters:
- setFullYear(anno)
- setMonth(meseIndex)
- setDate(giorno)
- setHours(), setMinutes(), ecc.

Altri metodi utili:
- getTime() → timestamp in millisecondi
- toISOString() → stringa ISO
- toLocaleString(locale, options) → formattazione localizzata (come nel tuo nomeDelMese)

# COME SI RECUPERANO I NOMI DEI MESI

nomeDelMese = computed(() =>
  new Date(this.year(), this.month(), 1).toLocaleString('it-IT', { month: 'long' })
);

Ecco quello che accade => new Date(this.year(), this.month(), 1) 
- this.year() → legge il valore del signal year.
- this.month() → legge il valore del signal month.
- 1 → primo giorno del mese

Mentre quello che accade => .toLocaleString('it-IT', { month: 'long' }):
- it-IT → locale italiana
- { month: 'long' } → nome completo del mese (es. "febbraio")

Perché si aggiorna da solo?
- Perché è un computed, Dipende da this.year() e this.month().
Quando uno dei due signal cambia (year.set(...) o month.set(...)), Angular ricalcola automaticamente il valore del computed.
Il template che lo usa (es. {{ monthName() }}) si aggiorna di conseguenza.

# GENERICS E INTERFACCIA

giorni = signal<CalendarDay[]>([]);

Perché si usano "< ... >" e cosa significano:
- si tratta delle generics di typescript
- questo signal conterrà un valore di TIPO → CalendarDay[] (array di CalendarDay).
- il valore iniziale è [] (array vuoto).

! Questo ci permette di definire la struttura dei giorni !

Vantaggi:
- Autocompletamento: this.days().map(day => day.isToday) è tipizzato.
- Sicurezza: non puoi fare this.days.set([ { foo: 123 } ]) perché non rispetta CalendarDay.

