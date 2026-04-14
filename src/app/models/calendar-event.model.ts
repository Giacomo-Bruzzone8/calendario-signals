export interface Interval
{
  start: string; // ISO: "2026-03-06T14:00"
  end: string;   // ISO: "2026-03-06T16:00"
  note?: string;
}

// ===============================
//  TIMELINE EVENTS
// ===============================

export type TimelineEvent =
  | Sleep
  | Work
  | Study
  | Reading
  | Sport
  | FreeTime
  | CustomActivity;

// SLEEP
export interface Sleep extends Interval {
  type: 'Sleep';
  dream?: string;
}

// WORK
export interface Work extends Interval {
  type: 'Work';
}

// STUDY
export interface Study extends Interval {
  type: 'Study';
  subject: string;
  goal?: string;
}

// READING
export interface Reading extends Interval {
  type: 'Reading';
  book: string;
  author: string;
}

// SPORT
export interface Sport extends Interval {
  type: 'Sport';
  sport: string;
  workout?: string;
}

// FREE TIME
export interface FreeTime extends Interval {
  type: 'FreeTime';
  hobby?: string;
}

// CUSTOM ACTIVITY
export interface CustomActivity extends Interval {
  type: 'CustomActivity';
  activity: string;
  category?: string;
}

// ===============================
//  NON-TIMED EVENTS
// ===============================

export type NonTimelineEvent =
  | Memo
  | Expense
  | Income
  | RecurringExpense
  | Reminder;

// NOTE BLOCK
export interface Memo {
  type: 'Memo';
  note: string;
}

// EXPENSE
export interface Expense {
  type: 'Expense';
  amountSpent: number;
  category: string;
}

// INCOME
export interface Income {
  type: 'Income';
  amountReceived: number;
  category: string;
}

// RECURRING EXPENSE
export interface RecurringExpense {
  type: 'RecurringExpense';
  amountSpent: number;
  category: string;
}

// SCHEDULED EVENT (non-timed)
export interface Reminder {
  type: 'Reminder';
  date: string; // "2026-03-06"
  message: string;
  time?: string;
  note?: string;
}

// ===============================
//  GENERAL CALENDAR EVENT
// ===============================

export interface DayDetail {
  id: string;
  date: string; // "2026-03-06"
  timeline: TimelineEvent[];    // ONLY timed events
  extra: NonTimelineEvent[];    // EVERYTHING ELSE
}