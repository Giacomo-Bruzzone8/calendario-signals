import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay } from '../../models/calendar-day.model';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import dayjs, { Dayjs } from 'dayjs';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss']
})
export class CalendarComponent implements OnDestroy{  
  // VARIABILI
  daysOfWeek: string[] = [];

  // VARIABILI PRIVATE
  private today = dayjs();

  // SIGNAL
  currentDate = signal<Dayjs>(this.today);
  currentDateSignal = signal<CalendarDay | null>(null);
  currentLang = signal<string>('');

  private destroy = new Subject<void>();
  constructor(private translate: TranslateService)
  {
    translate.onLangChange.pipe(takeUntil(this.destroy))
    .subscribe((event) => {
      this.currentLang.set(event.lang);

      dayjs.locale(this.currentLang());

      const weekdays = dayjs.weekdaysShort().map(g => g.charAt(0).toUpperCase() + g.slice(1));
      this.daysOfWeek = [...weekdays.slice(1), weekdays[0]];
    });
  }

  ngOnDestroy(): void
  {
    this.destroy.next();
    this.destroy.complete();
  }
  
  // COMPUTED SIGNAL
  year = computed(() => this.currentDate().year());
  month = computed(() => this.currentDate().month());

  headerDescription = computed(() => {
    dayjs.locale(this.currentLang()); // Using currentLang signal so that it updates when language changes

    const date = dayjs().year(this.year()).month(this.month());
    const monthName = date.format('MMMM');

    return monthName.charAt(0).toUpperCase() + monthName.slice(1) + ' ' + this.year();
  });

  // COMPUTED SIGNAL DI TIPO CalendarDay
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
    const today = this.currentDate();
    const oggiPassato = dayjs(today).subtract(1, 'month');
    this.currentDate.set(oggiPassato);
  }

  nextMonth()
  {
    const today = this.currentDate();
    const oggiFuturo = dayjs(today).add(1, 'month');
    this.currentDate.set(oggiFuturo);
  }

  selectDay(day: CalendarDay)
  {
    this.currentDateSignal.set(day);
  }

  isDaySelected(candidate: CalendarDay): boolean
  {
    const current = this.currentDateSignal();
    if (!current) return false;

    const currentDate = dayjs(`${current.year}-${current.month + 1}-${current.date}`);
    const candidateDate = dayjs(`${candidate.year}-${candidate.month + 1}-${candidate.date}`);

    return candidate.currentMonth && currentDate.isSame(candidateDate, 'day') || false;
  }
}