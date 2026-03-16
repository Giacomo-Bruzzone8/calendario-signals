import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  availableLangs = ['en', 'it'];

  flagMap: Record<string, string> = {
    en: '/img/flag-en.png',
    it: '/img/flag-it.png'
  };

  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = translate.getCurrentLang() || 'en';
    translate.use(this.currentLang);
  }

  changeLanguage(event: any) {
    const lang = event.target.value;
    this.currentLang = lang;
    this.translate.use(lang);
  }
}
