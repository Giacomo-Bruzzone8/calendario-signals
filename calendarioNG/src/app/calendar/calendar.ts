/* SIGNAL => CREA UN CONTENITORE REATTIVO CHE SI AGGIORNA IN BASE A DETERMINATE CIRCOSTANZE
[per leggere un signal si usa => this.nomeSignal()] [per aggiornare un signal si usa => this.nomeSignal.set(valore)] */
// COMPUTED => CREA UN CONTENITORE CHE SI AGGIORNA AUTOMATICAMENTE QUANDO I SIGNAL CHE LO COMPONGONO CAMBIANO
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay } from '../models/calendar-day.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})

export class CalendarComponent {

  // VARIABILE CHE CONTIENE I NOMI DEI GIORNI DELLA SETTIMANA, USATA NEL TEMPLATE PER RENDERIZZARE LE INTESTAZIONI
  weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  // VARIABILE PRIVATA CHE CONTIENE LA DATA ODIERNA, USATA PER DETERMINARE QUALI GIORNI RENDERIZZARE COME "OGGI"
  private today = new Date();

  // IN QUESTI SIGNAL VENGONO MEMORIZZATI L'ANNO E IL MESE ATTUALI DEL CALENDARIO, SFRUTTANDO METODI PER MANIPOLARE I Date
  year = signal(this.today.getFullYear());
  month = signal(this.today.getMonth()); // 0-11

  // nome del mese !!
  monthName = computed(() =>
    new Date(this.year(), this.month(), 1).toLocaleString('it-IT', { month: 'long' })
  );

  // lista dei giorni da renderizzare !!
  days = signal<CalendarDay[]>([]);

  // CONSTRUCTOR => VIENE ESEGUITO QUANDO IL COMPONENTE VIENE INIZIALIZZATO, IN QUESTO CASO CHIAMA IL METODO PER GENERARE I GIORNI DEL MESE CORRENTE
  constructor() {
    this.generateDays();
  }

  // CALCOLO DEL MESE PRECEDENTE
  prevMonth() {
    const m = this.month();
    const y = this.year();
    // Se sei a gennaio,  andare al mese precedente significa ->
    if (m === 0) {
      // dicembre dell'anno precedente
      this.month.set(11);
      this.year.set(y - 1);
    }
    // Altrimenti, sottraggo 1 al mese attuale
    else {
      this.month.set(m - 1);
    }
    this.generateDays();
  }

  // CALCOLO DEL MESE SUCCESSIVO
  nextMonth() {
    const m = this.month();
    const y = this.year();
    // Se sei a dicembre, andare al mese successivo significa ->
    if (m === 11) {
      // gennaio dell'anno successivo
      this.month.set(0);
      this.year.set(y + 1);
    }
    // Altrimenti, aggiungo 1 al mese attuale
    else {
      this.month.set(m + 1);
    }
    this.generateDays();
  }

  selectDay(day: CalendarDay) {
    console.log('Giorno selezionato:', day);
    // qui poi potrai gestire selezioni, eventi, ecc.
  }

  /* GENERA LA LISTA DEI GIORNI DA RENDERIZZARE IN BASE ALL'ANNO E AL MESE ATTUALI,
   INCLUDENDO ANCHE I GIORNI DEL MESE PRECEDENTE E SUCCESSIVO PER RIEMPIRE LA GRIGLIA */
  private generateDays() {
    const year = this.year();
    const month = this.month();

    // calcolo il primo giorno del mese
    const firstDayOfMonth = new Date(year, month, 1);

    /* La formula (x + 6) % 7 è un trucco matematico per ruotare la settimana.
    .getDay() restituisce 0 per domenica, 1 per lunedì, ..., 6 per sabato */
    const startWeekDay = (firstDayOfMonth.getDay() + 6) % 7;

    /* calcolo quanti giorni ha il mese corrente
    Trucco classico -> Il giorno 0 del mese successivo = ultimo giorno del mese corrente. */
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    /* calcolo quanti giorni ha il mese precedente
    Stesso trucco -> Il giorno 0 del mese corrente = ultimo giorno del mese precedente. */
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // array che conterrà tutti i giorni da renderizzare, inclusi quelli degli altri mesi
    const days: CalendarDay[] = [];

    // riconosco i giorni del mese precedente da renderizzare (se il mese inizia di mercoledì, devo mostrare lunedì e martedì del mese precedente)
    for (let i = startWeekDay - 1; i >= 0; i--) {
      // popolo l'array con il lunedì del mese precedente, decrementando fino a riempire i giorni mancanti
      days.push({
        // rispetto la struttura dell interfaccia, ma con otherMonth: true per differenziarli
        date: daysInPrevMonth - i,
        otherMonth: true,
        isToday: false
      });
    }

    // riconosco i giorni del mese corrente da renderizzare, evidenziando quello che corrisponde alla data odierna
    for (let d = 1; d <= daysInMonth; d++) {
      // controllo se il giorno corrente è "oggi" confrontando giorno, mese e anno con la data odierna
      const isToday =
        d === this.today.getDate() &&
        month === this.today.getMonth() &&
        year === this.today.getFullYear();

      // popolo l'array con i giorni del mese corrente, differenziandoli da quelli degli altri mesi ed evidenziando "oggi"
      days.push({
        date: d,
        otherMonth: false,
        isToday
      });
    }

    // riempo fino a multiplo di 7 con giorni del mese successivo !!
    while (days.length % 7 !== 0) {
      const nextDate = days.length - (startWeekDay + daysInMonth) + 1;
      days.push({
        date: nextDate,
        otherMonth: true,
        isToday: false
      });
    }
    // aggiorno il calendario con la nuova lista di giorni, innescando un aggiornamento del template grazie alla reattività dei signal
    this.days.set(days);
  }
}
