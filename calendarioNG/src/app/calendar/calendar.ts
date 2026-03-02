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
    dataCorrente = signal<Date>(this.oggi);
    giornoSelezionatoSignal = signal<CalendarDay | null>(null);

  // COMPUTED SIGNAL
    anno = computed(() => this.dataCorrente().getFullYear());
    mese = computed(() => this.dataCorrente().getMonth());
    nomeDelMese = computed(() =>
    new Date(this.anno(), this.mese(), 1).toLocaleString('it-IT', { month: 'long' })
  );

  // COMPUTED SIGNAL DI TIPO CalendarDay
    giorniMesePrecedente = computed<CalendarDay[]>(() => {
      const annoCalendario = this.anno(); 
      const meseCalendario = this.mese(); 
      const giorniDelMesePrecedente = new Date(annoCalendario, meseCalendario, 0).getDate();
      const primoGiornoDelMese = new Date(annoCalendario, meseCalendario, 1);
      const indicePrimoGiornoSettimana = (primoGiornoDelMese.getDay() + 6) % 7;
      
      return Array.from({ length: indicePrimoGiornoSettimana }, (_, i) => ({
        anno: meseCalendario === 0 ? annoCalendario - 1 : annoCalendario,
        mese: meseCalendario === 0 ? 11 : meseCalendario - 1, 
        numero_del_giorno_del_calendario: giorniDelMesePrecedente - (indicePrimoGiornoSettimana - 1 - i), 
        meseDiverso: true,
        giornoAttuale: false
      })); 
    });

    giorniMeseCorrente = computed<CalendarDay[]>(() => {
      const annoCalendario = this.anno();
      const meseCalendario = this.mese();
      const giorniDelMeseCorrente = new Date(annoCalendario, meseCalendario + 1, 0).getDate();

      return Array.from({ length: giorniDelMeseCorrente }, (_, i) => {
        const giorno = i + 1;
        const giornoAttuale =
          giorno === this.oggi.getDate() &&
          meseCalendario === this.oggi.getMonth() &&
          annoCalendario === this.oggi.getFullYear();

        return {
          anno: annoCalendario,
          mese: meseCalendario,
          numero_del_giorno_del_calendario: giorno,
          meseDiverso: false,
          giornoAttuale
        };
    });
  });
  
  giorniMeseSuccessivo = computed<CalendarDay[]>(() => {
    const annoCalendario = this.anno();
    const meseCalendario = this.mese();

    const giorniPrecedenti = this.giorniMesePrecedente();
    const giorniCorrenti = this.giorniMeseCorrente();

    const totale = [...giorniPrecedenti, ...giorniCorrenti];
    const giorniMancanti = (7 - (totale.length % 7)) % 7;

    return Array.from({ length: giorniMancanti }, (_, i) => ({
      anno: meseCalendario === 11 ? annoCalendario + 1 : annoCalendario,
      mese: meseCalendario === 11 ? 0 : meseCalendario + 1,
      numero_del_giorno_del_calendario: i + 1,
      meseDiverso: true,
      giornoAttuale: false
    }));
  });

  giorniDelCalendario = computed<CalendarDay[]>(() => [
  ...this.giorniMesePrecedente(),
  ...this.giorniMeseCorrente(),
  ...this.giorniMeseSuccessivo()
]);

  // METODI
  mesePrecedente() {
  const oggi = this.dataCorrente();
  const oggiPassato = new Date(oggi);
  oggiPassato.setMonth(oggiPassato.getMonth() - 1);
  this.dataCorrente.set(oggiPassato);
}

meseSuccessivo() {
  const oggi = this.dataCorrente();
  const oggiFuturo = new Date(oggi);
  oggiFuturo.setMonth(oggiFuturo.getMonth() + 1);
  this.dataCorrente.set(oggiFuturo);
}

  giornoSelezionato(giorno: CalendarDay) {
    this.giornoSelezionatoSignal.set(giorno);
  }
}