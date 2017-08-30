// angular
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// services
import { ArrhythmiaService, arrhythmiaServiceSettings } from "./services/arrhythmia.service";
// components
import { FaqComponent } from "../shared/faq.component/faq.component";
import { ArrhythmiaComponent } from "./arrhythmia.component/arrhythmia.component";
import { ArrhythmiaSettingsComponent } from "./arrhythmia_settings.component/arrhythmia_settings.component";
import { SharedModule } from "../shared/";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

const routes: Routes = [
  { path: 'calculator', component: ArrhythmiaComponent },
  { path: 'settings', component: ArrhythmiaSettingsComponent },
  { path: 'faq', component: FaqComponent },
];

@NgModule({
  declarations: [
    ArrhythmiaComponent,
    ArrhythmiaSettingsComponent,
  ],
  providers: [
    { provide: ArrhythmiaService, useFactory () {
        const settings: arrhythmiaServiceSettings = {
          coefficient: {
            min: 1,
            max: 100,
            init: 15
          },
          difference: {
            min: 1,
            max: 1000,
            init: 120
          },
          accuracy: {
            min: 0,
            max: 10,
            init: 2
          },
          interval: {
            min: 200,
            max: 3000,
            init: 1000
          },
          rateCoefficient: 60000,
          moreThenOnly: true
        };

        return new ArrhythmiaService (settings);
      }
    },
  ],
  imports: [
    RouterModule.forChild (routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})

export class IsArrhythmiaModule {}