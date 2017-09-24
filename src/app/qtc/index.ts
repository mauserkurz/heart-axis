// angular
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// services
import { QTcService, qtcServiceSettings, Range } from "./services/qtc.service";
// components
import { FaqComponent } from "../shared/faq.component/faq.component";
import { QTcComponent } from "./qtc.component/qtc.component";
import { QTcSettingsComponent } from "./qtc_settings.component/qtc_settings.component";
import { SharedModule } from "../shared/";

const routes: Routes = [
  { path: '', redirectTo: 'calculator', pathMatch: 'full' },
  { path: 'calculator', component: QTcComponent },
  { path: 'settings', component: QTcSettingsComponent },
  { path: 'faq', component: FaqComponent },
];

@NgModule({
  declarations: [
    QTcComponent,
    QTcSettingsComponent,
  ],
  providers: [
    { provide: QTcService, useFactory () {
        const settings: qtcServiceSettings = {
          accuracy: {
            min: 0,
            max: 10,
            init: 0
          },
          interval: {
            min: 100,
            max: 3000,
            initQT: 400,
            initRR: 1000,
          },
          isMale: true,
          ranges: {
            male: new Range(
              [
                {
                  border: 430,
                  name: 'Норма',
                  colorClass: 'alert-info',
                },
                {
                  border: 450,
                  name: 'Пограничное',
                  colorClass: 'alert-warning',
                },
              ],
              100,
              1000,
              'Удлинение',
              'alert-danger',
              0
            ),
            female: new Range(
              [
                {
                  border: 450,
                  name: 'Норма',
                  colorClass: 'alert-info',
                },
                {
                  border: 470,
                  name: 'Пограничное',
                  colorClass: 'alert-warning',
                },
              ],
              100,
              1000,
              'Удлинение',
              'alert-danger',
              0
            ),
          },
        };

        return new QTcService (settings);
      }
    },
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})

export default class QTcModule {}