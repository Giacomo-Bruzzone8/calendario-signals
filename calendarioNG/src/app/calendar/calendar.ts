import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: number;
  otherMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {

  // giorni della settimana (puoi cambiarli in LUN/MAR ecc.)
  weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  private today = new Date();

  year = signal(this.today.getFullYear());
  month = signal(this.today.getMonth()); // 0-11

  // nome del mese
  monthName = computed(() =>
    new Date(this.year(), this.month(), 1).toLocaleString('it-IT', { month: 'long' })
  );

  // lista dei giorni da renderizzare
  days = signal<CalendarDay[]>([]);

  constructor() {
    this.generateDays();
  }

  prevMonth() {
    const m = this.month();
    const y = this.year();
    if (m === 0) {
      this.month.set(11);
      this.year.set(y - 1);
    } else {
      this.month.set(m - 1);
    }
    this.generateDays();
  }

  nextMonth() {
    const m = this.month();
    const y = this.year();
    if (m === 11) {
      this.month.set(0);
      this.year.set(y + 1);
    } else {
      this.month.set(m + 1);
    }
    this.generateDays();
  }

  selectDay(day: CalendarDay) {
    console.log('Giorno selezionato:', day);
    // qui poi potrai gestire selezioni, eventi, ecc.
  }

  private generateDays() {
    const year = this.year();
    const month = this.month();

    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekDay = (firstDayOfMonth.getDay() + 6) % 7; // 0 = lunedì

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // giorni del mese precedente
    for (let i = startWeekDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        otherMonth: true,
        isToday: false
      });
    }

    // giorni del mese corrente
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        d === this.today.getDate() &&
        month === this.today.getMonth() &&
        year === this.today.getFullYear();

      days.push({
        date: d,
        otherMonth: false,
        isToday
      });
    }

    // opzionale: riempi fino a multiplo di 7 con giorni del mese successivo
    while (days.length % 7 !== 0) {
      const nextDate = days.length - (startWeekDay + daysInMonth) + 1;
      days.push({
        date: nextDate,
        otherMonth: true,
        isToday: false
      });
    }

    this.days.set(days);
  }
}
