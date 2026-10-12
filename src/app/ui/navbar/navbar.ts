import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [TranslateModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  availableLangs = ['en', 'it'];
  currentLang: string;
  flagMap: Record<string, string> = {
    en: '/img/flag-en.png',
    it: '/img/flag-it.png'
  };


  constructor(private translate: TranslateService) {
    this.currentLang = translate.getCurrentLang() || 'en';
    translate.use(this.currentLang);
  }

  changeLanguage(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;
    if (!this.availableLangs.includes(lang)) return;
    this.currentLang = lang;
    this.translate.use(lang);
  }
}
