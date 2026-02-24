import { Component, signal } from '@angular/core';
import { CalendarComponent } from "./calendar/calendar";
import { Navbar } from "./navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [ CalendarComponent, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('calendarioNG');
}
