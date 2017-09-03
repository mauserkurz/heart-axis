// angular
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// services
import { AxisCalculator, axisCalculatorParams } from "./services/axis_calculator.service";
// components
import { FaqComponent } from "../shared/faq.component/faq.component";
import { CalculatorComponent } from "./calculator.component/calculator.component";
import { AxisSettingsComponent } from "./axis_settings.component/axis_settings.component";
import { SharedModule } from "../shared/";

export const routes: Routes = [
  { path: '', redirectTo: 'calculator', pathMatch: 'full' },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'settings', component: AxisSettingsComponent },
  { path: 'faq', component: FaqComponent },
];

@NgModule({
  declarations: [
    CalculatorComponent,
    AxisSettingsComponent,
  ],
  providers: [
    { provide: AxisCalculator, useFactory () {
        const axisCalculatorSettings: axisCalculatorParams = {
          accuracy: {
            min: 0,
            max: 10,
            default: 2,
          },

          maxSum: {
            min: 0,
            max: 1000,
            default: {
              min: -20,
              max: 20,
            },
            initValue: 1,
          },

          maxWave: {
            min: 0,
            max: 1000,
            default: {
              min: 0,
              max: 20,
            },
            initR: 1,
            initQS: 0,
          },
        };

        return new AxisCalculator (axisCalculatorSettings);
      }
    },
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})

export class AxisHeartModule {}