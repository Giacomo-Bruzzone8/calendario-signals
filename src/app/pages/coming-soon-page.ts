import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-coming-soon-page',
  imports: [TranslateModule, RouterLink],
  template: `<section class="page"><h1>{{ title | translate }}</h1><p>{{ 'Pages.ComingSoon' | translate }}</p><a routerLink="/calendar">{{ 'Pages.OpenCalendar' | translate }}</a></section>`,
  styleUrl: './page.scss',
})
export class ComingSoonPage {
  readonly title = inject(ActivatedRoute).snapshot.data['title'] as string;
}
