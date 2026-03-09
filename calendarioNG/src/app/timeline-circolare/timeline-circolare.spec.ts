import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineCircolare } from './timeline-circolare';

describe('TimelineCircolare', () => {
  let component: TimelineCircolare;
  let fixture: ComponentFixture<TimelineCircolare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineCircolare]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineCircolare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
