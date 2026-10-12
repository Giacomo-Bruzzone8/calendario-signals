import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { routes } from './app.routes';
import { Home } from './home/home';
import { ComingSoonPage } from './pages/coming-soon-page';
import { DayDetailComponent } from './ui/day-detail/day-detail';
import { formatDate } from './functions/date-utils';
import { CalendarComponent } from './ui/calendar/calendar';

describe('Page navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideTranslateService()],
    });
    TestBed.inject(TranslateService).use('it');
  });

  it('opens each navbar destination', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', Home);
    await harness.navigateByUrl('/calendar', CalendarComponent);
    const goals = await harness.navigateByUrl('/goals', ComingSoonPage);
    expect(goals.title).toBe('NavbarComponent.Goals');
    const profile = await harness.navigateByUrl('/profile', ComingSoonPage);
    expect(profile.title).toBe('NavbarComponent.Profile');
    const today = await harness.navigateByUrl('/day', DayDetailComponent);
    expect(formatDate(today.date())).toBe(formatDate(new Date()));
  });

  it('updates the displayed date when navigating between days', async () => {
    const harness = await RouterTestingHarness.create();
    const first = await harness.navigateByUrl('/day/2026-09-28', DayDetailComponent);
    expect(formatDate(first.date())).toBe('2026-09-28');
    expect(harness.routeNativeElement?.textContent).toContain('28 settembre 2026');
    const second = await harness.navigateByUrl('/day/2026-10-03', DayDetailComponent);
    expect(formatDate(second.date())).toBe('2026-10-03');
    expect(harness.routeNativeElement?.textContent).toContain('3 ottobre 2026');
    expect(harness.routeNativeElement?.querySelector('a.back')?.getAttribute('href')).toBe('/calendar');
  });

  it('redirects malformed and impossible dates to the calendar', async () => {
    const harness = await RouterTestingHarness.create();
    for (const value of ['invalid', '2026-02-30', '2026-13-01']) {
      await harness.navigateByUrl(`/day/${value}`, CalendarComponent);
      expect(TestBed.inject(Router).url).toBe('/calendar');
    }
    await harness.navigateByUrl('/unknown-page', Home);
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('creates date links for days across year boundaries and initializes weekdays', () => {
    const calendar = TestBed.createComponent(CalendarComponent).componentInstance;
    expect(calendar.daysOfWeek).toHaveLength(7);
    expect(calendar.dayLink({ year: 2027, month: 0, date: 1, isToday: false })).toEqual(['/day', '2027-01-01']);
    expect(calendar.dayLink({ year: 2026, month: 11, date: 31, isToday: false })).toEqual(['/day', '2026-12-31']);
  });
});
