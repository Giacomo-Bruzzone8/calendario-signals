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
  // VARIABILI
  giorniDellaSettimana = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  // VARIABILI PRIVATE
  private oggi = new Date();

  // SIGNAL
  anno = signal(this.oggi.getFullYear());
  mese = signal(this.oggi.getMonth());
  giorniDelCalendario = signal<CalendarDay[]>([]);
  giornoSelezionatoSignal = signal<CalendarDay | null>(null);

  // COMPUTED SIGNAL
  nomeDelMese = computed(() =>
    new Date(this.anno(), this.mese(), 1).toLocaleString('it-IT', { month: 'long' })
  );

  // COSTRUTTORE
  constructor() {
    this.generaGiorni();
  }

  // METODI
  mesePrecedente() {
    const m = this.mese();
    const a = this.anno();
    if (m === 0) {
      this.mese.set(11);
      this.anno.set(a - 1);
    }
    else {
      this.mese.set(m - 1);
    }
    this.generaGiorni();
  }

  meseSuccessivo() {
    const m = this.mese();
    const a = this.anno();
    if (m === 11) {
      this.mese.set(0);
      this.anno.set(a + 1);
    }
    else {
      this.mese.set(m + 1);
    }
    this.generaGiorni();
  }

  giornoSelezionato(giorno: CalendarDay) {
    this.giornoSelezionatoSignal.set(giorno);
  }

  private generaGiorni() {
	// INFORMAZIONI
    const annoCalendario = this.anno();
    const meseCalendario = this.mese();
    const primoGiornoDelMese = new Date(annoCalendario, meseCalendario, 1);
    const giorniDelMeseCorrente = new Date(annoCalendario, meseCalendario + 1, 0).getDate();
    const giorniDelMesePrecedente = new Date(annoCalendario, meseCalendario, 0).getDate();
    const giorniDaVisualizzare: CalendarDay[] = []; // Array vuoto di tipo CalendarDay[]

    //* converto il giorno della settimana JS (0=dom,...,6=sab) in un indice con 0=lun,...,6=dom
    const indicePrimoGiornoSettimana = (primoGiornoDelMese.getDay() + 6) % 7;
    //* aggiungo i giorni finali del mese precedente per completare la prima settimana del mese corrente, se necessario.
    //* es: se il mese inizia di mercoledì, mostro lunedì e martedì del mese precedente


    //* aggiungo i giorni finali del mese precedente per riempire la prima settimana (se il mese non inizia di lunedì)
    for (let i = indicePrimoGiornoSettimana - 1; i >= 0; i--) {
      giorniDaVisualizzare.push({
        anno: meseCalendario === 0 ? annoCalendario - 1 : annoCalendario,
        mese: meseCalendario === 0 ? 11 : meseCalendario - 1,
        numero_del_giorno_del_calendario: giorniDelMesePrecedente - i,
        meseDiverso: true,
        giornoAttuale: false
      });
    }

    //* riconosco i giorni del mese corrente da renderizzare
    for (let giorno = 1; giorno <= giorniDelMeseCorrente; giorno++) {
  
      const giornoAttuale = giorno === this.oggi.getDate() && meseCalendario === this.oggi.getMonth() && annoCalendario === this.oggi.getFullYear();

      //* per ogni iterazione del ciclo spingo il giorno del meseCorrente nell' array.
      giorniDaVisualizzare.push({
        anno: annoCalendario,
        mese: meseCalendario,
        numero_del_giorno_del_calendario: giorno,
        meseDiverso: false,
        giornoAttuale //* se giornoAttuale è true, lo riconosco come "oggi"
      });
    }

    //* WHILE: Itera sino a quando la condizione è verificata.
    //* Aggiungendo i giorni del mese successivo se necessario per completare l'ultima settimana del calendario.
    let count = 1;
    while (giorniDaVisualizzare.length % 7 !== 0) {
      giorniDaVisualizzare.push({
        anno: meseCalendario === 11 ? annoCalendario + 1 : annoCalendario,
        mese: meseCalendario === 11 ? 0 : meseCalendario + 1,
        numero_del_giorno_del_calendario: count,
        meseDiverso: true,
        giornoAttuale: false
      });
      count++;
    }

    //* aggiorno il calendario con la nuova lista di giorni, innescando un aggiornamento del template grazie alla reattività dei signal
    this.giorniDelCalendario.set(giorniDaVisualizzare);
  }
}
