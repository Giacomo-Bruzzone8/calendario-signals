import { Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarComponent } from '../ui/calendar/calendar';
import { CircularTimeline } from '../ui/circular-timeline/circular-timeline';
import { StorageService } from '../services/storage.service';
import { formatDate } from '../functions/date-utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, CalendarComponent, CircularTimeline],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private readonly storage = inject(StorageService);
  readonly today = new Date();
  readonly todayEvents = computed(() => this.storage.getDay(formatDate(this.today))?.timeline ?? []);
}
