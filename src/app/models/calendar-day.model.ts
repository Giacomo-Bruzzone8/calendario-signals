export interface CalendarDay
{
  date: number;
  month: number;
  year: number;

  currentMonth?: boolean;
  previousMonth?: boolean;
  nextMonth?: boolean;
  isToday: boolean;
}