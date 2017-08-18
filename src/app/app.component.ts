// angular
import { Component, ViewEncapsulation } from "@angular/core";
import { Routes } from "@angular/router";
// components
import { CalculatorComponent } from "./calculator.component/calculator.component";
import { FaqComponent } from "./faq.component/faq.component";
import { AxisSettingsComponent } from "./axis_settings.component/axis_settings.component";

export const routes: Routes = [
  { path: '', redirectTo: 'calculator', pathMatch: 'full' },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'settings', component: AxisSettingsComponent },
];

// require ('./app.scss');

@Component({
  selector: 'app',
  // styleUrls: [
  //   './app.scss',
  // ],
  templateUrl: './app.component.html',
})

export class AppComponent {

  constructor () {}

}