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
  currentLang: string;

  constructor(private translate: TranslateService)
  {
    this.currentLang = translate.getCurrentLang() || 'en';
  }

  changeLanguage(event: any)
  {
    const lang = event.target.value;
    this.currentLang = lang;
    this.translate.use(lang);
  }
}