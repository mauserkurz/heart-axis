import { Component } from "@angular/core";
import { Routes } from "@angular/router";
import { CalculatorComponent } from "./calculator.component";
import { FaqComponent } from "./faq.component";

export const routes: Routes = [
  { path: '', redirectTo: 'calculator', pathMatch: 'full' },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'faq', component: FaqComponent },
];

@Component({
  selector: 'app',
  styleUrls: [
    '../css/styles.scss',
  ],
  template: `
    <h1>Приложение функциональная диагностика.</h1>
    <nav>
      <ul>
        <li><a [routerLink]="['/calculator']">Расчет ЭОС</a></li>
        <li><a [routerLink]="['/faq']">ЧАВО</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `
})

export class App {

  constructor () {}

}