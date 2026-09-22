import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarComponent } from '../ui/calendar/calendar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, CalendarComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {}