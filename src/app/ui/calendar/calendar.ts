import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/it';
import 'dayjs/locale/en';
import { Subject, takeUntil } from 'rxjs';
import { formatDate } from '../../functions/date-utils';
import { CalendarDay } from '../../models/calendar-day.model';
import { StorageService } from '../../services/storage.service';
import { DayActivityEditor } from '../day-activity-editor/day-activity-editor';

dayjs.extend(localeData);

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, DayActivityEditor],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss'],
})

export class CalendarComponent implements OnDestroy {


  // Dipendenze e valori iniziali usati dal calendario.
  private readonly storage = inject(StorageService);
  private readonly destroy = new Subject<void>();
  private readonly today = dayjs();

  // Stato modificabile dalle azioni dell'utente e dal cambio di lingua.
  daysOfWeek: string[] = [];
  currentDate = signal<Dayjs>(this.today);
  selectedDate = signal<CalendarDay | null>(null);
  menuDay = signal<CalendarDay | null>(null);
  editorDate = signal<Date | null>(null);
  currentLang = signal<string>('');

  // Valori derivati: si aggiornano quando cambiano data, lingua o attività salvate.
  year = computed(() => this.currentDate().year());
  month = computed(() => this.currentDate().month());
  datesWithContent = computed(() => new Set(Object.values(this.storage.days())
    .filter(day => day.timeline.length > 0 || day.extra.length > 0)
    .map(day => day.date)));

  headerDescription = computed(() => {
    dayjs.locale(this.currentLang()); // Legge il signal per aggiornare il titolo al cambio di lingua.

    const date = dayjs().year(this.year()).month(this.month());
    const monthName = date.format('MMMM');

    return monthName.charAt(0).toUpperCase() + monthName.slice(1) + ' ' + this.year();
  });

  // Giorni mostrati nella griglia, inclusi quelli dei mesi adiacenti.
  previousMonthDays = computed<CalendarDay[]>(() => {
    const currentYear = this.year();
    const currentMonth = this.month();

    const daysInPreviousMonth = dayjs().year(currentYear).month(currentMonth).date(0).date(); // Giorno 0: ultimo giorno del mese precedente.
    const firstDayOfMonth = dayjs().year(currentYear).month(currentMonth).date(1); // Primo giorno del mese corrente.
    const firstDayOfWeekIndex = (firstDayOfMonth.day() + 6) % 7; // Lunedì corrisponde a 0.

    return Array.from({ length: firstDayOfWeekIndex }, (_, i) => ({
      date: daysInPreviousMonth - (firstDayOfWeekIndex - 1 - i),
      month: currentMonth === 0 ? 11 : currentMonth - 1,
      year: currentMonth === 0 ? currentYear - 1 : currentYear,

      isToday: false,
      previousMonth: true,
      nextMonth: false
    }));
  });

  currentMonthDays = computed<CalendarDay[]>(() => {
    const currentYear = this.year();
    const currentMonth = this.month();
    const daysInCurrentMonth = dayjs().year(currentYear).month(currentMonth + 1).date(0).date(); // Giorno 0 del mese successivo: ultimo giorno del mese corrente.

    return Array.from({ length: daysInCurrentMonth }, (_, i) => {
      const date = i + 1;
      const isToday =
        date === this.today.date() &&
        currentMonth === this.today.month() &&
        currentYear === this.today.year();

      return {
        year: currentYear,
        month: currentMonth,
        date,
        currentMonth: true,
        isToday
      };
    });
  });

  nextMonthDays = computed<CalendarDay[]>(() => {
    const currentYear = this.year();
    const currentMonth = this.month();

    const previousDays = this.previousMonthDays();
    const currentDays = this.currentMonthDays();

    const totals = [...previousDays, ...currentDays];
    const missingDays = (7 - (totals.length % 7)) % 7;

    return Array.from({ length: missingDays }, (_, i) => ({
      year: currentMonth === 11 ? currentYear + 1 : currentYear,
      month: currentMonth === 11 ? 0 : currentMonth + 1,
      date: i + 1,
      isToday: false,
      previousMonth: false,
      nextMonth: true
    }));
  });

  calendarDays = computed<CalendarDay[]>(() => [
    ...this.previousMonthDays(),
    ...this.currentMonthDays(),
    ...this.nextMonthDays()
  ]);


  /** Imposta la lingua iniziale e ascolta i cambi di lingua dell'applicazione. */
  constructor(private translate: TranslateService) {
    this.updateLanguage(translate.getCurrentLang() || 'en');
    translate.onLangChange.pipe(takeUntil(this.destroy))
      .subscribe((event) => {
        this.updateLanguage(event.lang);
      });
  }

  /** Interrompe l'ascolto della lingua quando Angular rimuove il calendario. */
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Aggiorna titolo e nomi dei giorni; è chiamato all'avvio e a ogni cambio di lingua. */
  private updateLanguage(lang: string): void {
    this.currentLang.set(lang);
    const weekdays = dayjs().locale(lang).localeData().weekdaysShort()
      .map(g => g.charAt(0).toUpperCase() + g.slice(1));
    this.daysOfWeek = [...weekdays.slice(1), weekdays[0]];
  }

  // Metodi di supporto usati dal template per rappresentare i giorni.

  /** Crea la rotta del dettaglio; è usato dal link del menu e dall'etichetta del giorno. */
  dayLink(day: CalendarDay): string[] {
    return ['/day', formatDate(new Date(day.year, day.month, day.date))];
  }

  /** Indica se il giorno ha contenuti; il template lo usa per mostrare il segnalino. */
  hasContent(day: CalendarDay): boolean {
    return this.datesWithContent().has(this.dayLink(day)[1]);
  }

  /** Confronta un giorno con quello selezionato; il template lo usa per stile e accessibilità. */
  isDaySelected(candidate: CalendarDay): boolean {
    const current = this.selectedDate();
    if (!current) return false;

    return current.year === candidate.year
      && current.month === candidate.month
      && current.date === candidate.date;
  }

  // Metodi richiamati dalle interazioni con il calendario.

  /** Mostra il mese precedente quando si preme la freccia sinistra. */
  previousMonth(): void {
    this.closeMenu();
    const today = this.currentDate();
    const lastToday = dayjs(today).subtract(1, 'month');
    this.currentDate.set(lastToday);
  }

  /** Mostra il mese successivo quando si preme la freccia destra. */
  nextMonth(): void {
    this.closeMenu();
    const today = this.currentDate();
    const nextToday = dayjs(today).add(1, 'month');
    this.currentDate.set(nextToday);
  }

  /** Seleziona un giorno al clic sinistro e chiude l'eventuale menu aperto. */
  selectDay(day: CalendarDay): void {
    this.selectedDate.set(day);
    this.closeMenu();
  }

  /** Al clic destro seleziona il giorno e apre il suo menu al posto di quello del browser. */
  openDayMenu(event: MouseEvent, day: CalendarDay): void {
    event.preventDefault();
    this.selectedDate.set(day);
    this.menuDay.set(day);
  }

  /** Apre la finestra delle attività dalla voce del menu relativa al giorno scelto. */
  openActivityEditor(day: CalendarDay): void {
    this.selectedDate.set(day);
    this.closeMenu();
    this.editorDate.set(new Date(day.year, day.month, day.date, 12));
  }

  /** Nasconde la finestra quando il componente delle attività emette l'evento di chiusura. */
  closeActivityEditor(): void {
    this.editorDate.set(null);
  }

  /** Chiude il menu a un clic nel documento, con Esc o durante altre azioni del calendario. */
  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  closeMenu(): void {
    this.menuDay.set(null);
  }
}
