import { Component, signal, computed, inject, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { formatDate } from '../../functions/date-utils';
import { CalendarDay } from '../../models/calendar-day.model';
import { StorageService } from '../../services/storage.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/it';
import 'dayjs/locale/en';
import { Subject, takeUntil } from 'rxjs';

dayjs.extend(localeData);

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss']
})
export class CalendarComponent implements OnDestroy{  
// DECLARATIONS
  daysOfWeek: string[] = [];
  private today = dayjs();
  private readonly storage = inject(StorageService);

// DESTROY
  private destroy = new Subject<void>();
    ngOnDestroy(): void
  {
    this.destroy.next();
    this.destroy.complete();
  }

// COSTRUCTOR
  constructor(private translate: TranslateService)
  {
    this.updateLanguage(translate.getCurrentLang() || 'en');
    translate.onLangChange.pipe(takeUntil(this.destroy))
    .subscribe((event) => {
      this.updateLanguage(event.lang);
    });
  }

  private updateLanguage(lang: string): void {
    this.currentLang.set(lang);
    const weekdays = dayjs().locale(lang).localeData().weekdaysShort()
      .map(g => g.charAt(0).toUpperCase() + g.slice(1));
    this.daysOfWeek = [...weekdays.slice(1), weekdays[0]];
  }

  dayLink(day: CalendarDay): string[] {
    return ['/day', formatDate(new Date(day.year, day.month, day.date))];
  }

// SIGNAL
  currentDate = signal<Dayjs>(this.today);
  selectedDate = signal<CalendarDay | null>(null);
  menuDay = signal<CalendarDay | null>(null);
  currentLang = signal<string>('');
  
// COMPUTED SIGNAL
  datesWithContent = computed(() => new Set(Object.values(this.storage.days())
    .filter(day => day.timeline.length > 0 || day.extra.length > 0)
    .map(day => day.date)));

  hasContent(day: CalendarDay): boolean {
    return this.datesWithContent().has(this.dayLink(day)[1]);
  }

  year = computed(() => this.currentDate().year());
  month = computed(() => this.currentDate().month());

  headerDescription = computed(() => {
    dayjs.locale(this.currentLang()); // Using currentLang signal so that it updates when language changes

    const date = dayjs().year(this.year()).month(this.month());
    const monthName = date.format('MMMM');

    return monthName.charAt(0).toUpperCase() + monthName.slice(1) + ' ' + this.year();
  });

// COMPUTED SIGNAL FROM CalendarDay type
  previousMonthDays = computed<CalendarDay[]>(() => {
    const currentYear = this.year();
    const currentMonth = this.month();

    const daysInPreviousMonth = dayjs().year(currentYear).month(currentMonth).date(0).date(); // 0 → last day of previous month
    const firstDayOfMonth = dayjs().year(currentYear).month(currentMonth).date(1); // 1 → first day of current month
    const firstDayOfWeekIndex = (firstDayOfMonth.day() + 6) % 7; // 0 = Monday

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
    const daysInCurrentMonth = dayjs().year(currentYear).month(currentMonth + 1).date(0).date(); // 0 → last day of previous month

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

// MANAGE CALENDAR
  previousMonth()
  {
    this.closeMenu();
    const today = this.currentDate();
    const lastToday = dayjs(today).subtract(1, 'month');
    this.currentDate.set(lastToday);
  }

  nextMonth()
  {
    this.closeMenu();
    const today = this.currentDate();
    const nextToday = dayjs(today).add(1, 'month');
    this.currentDate.set(nextToday);
  }

  selectDay(day: CalendarDay)
  {
    this.selectedDate.set(day);
    this.closeMenu();
  }

  openDayMenu(event: MouseEvent, day: CalendarDay): void
  {
    event.preventDefault();
    this.selectedDate.set(day);
    this.menuDay.set(day);
  }

  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  closeMenu(): void
  {
    this.menuDay.set(null);
  }

  isDaySelected(candidate: CalendarDay): boolean
  {
    const current = this.selectedDate();
    if (!current) return false;

    return current.year === candidate.year
      && current.month === candidate.month
      && current.date === candidate.date;
  }
}
