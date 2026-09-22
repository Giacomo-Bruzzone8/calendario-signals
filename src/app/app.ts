import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './ui/navbar/navbar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import 'dayjs/locale/en';

import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { CircularTimeline } from "./ui/circular-timeline/circular-timeline";

dayjs.extend(localeData);
dayjs.extend(localizedFormat);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, Navbar, CircularTimeline],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(private translate: TranslateService) {
  this.translate.addLangs(['it', 'en']);
  this.translate.setFallbackLang('it');
  this.translate.use('en');
  dayjs.locale('it');
}
}