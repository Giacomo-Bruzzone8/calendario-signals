import { Component } from '@angular/core';
import { CalendarComponent } from "./ui/calendar/calendar";
import { Navbar } from "./ui/navbar/navbar";
import { CircularTimeline } from "./ui/circular-timeline/circular-timeline";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import 'dayjs/locale/en';

import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localeData);
dayjs.extend(localizedFormat);

@Component({
  selector: 'app-root',
  imports: [ TranslateModule, CalendarComponent, Navbar, CircularTimeline ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App
{
  constructor(private translate: TranslateService)
  {
    translate.addLangs(['it', 'en']);
    translate.use('it');
  }
}
