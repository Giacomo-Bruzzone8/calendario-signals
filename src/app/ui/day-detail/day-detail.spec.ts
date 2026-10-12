import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayDetailComponent as DayDetail } from './day-detail';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

describe('DayDetail', () => {
  let component: DayDetail;
  let fixture: ComponentFixture<DayDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayDetail],
      providers: [provideRouter([]), provideTranslateService()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
