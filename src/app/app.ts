// angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// services
import { AxisCalculator, axisCalculatorParams } from "../app/services/axis_calculator.service";
import { AppState } from "../app/services/app_state.service";
// app
import { AppComponent, routes } from "./app.component";
import { CalculatorComponent } from "./calculator.component/calculator.component";
import { FaqComponent } from "./faq.component/faq.component";
import { AxisSettingsComponent } from "./axis_settings.component/axis_settings.component";
import { BtnPlus } from "./btn_plus.component/btn_plus.component";
import { BtnMinus } from "./btn_minus.component/btn_minus.component";
import { SumFieldComponent } from "./sum_field.component/sum_field.component";

@NgModule({
  declarations: [AppComponent, CalculatorComponent, FaqComponent, AxisSettingsComponent, BtnPlus, BtnMinus, SumFieldComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  bootstrap: [AppComponent],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: AxisCalculator, useFactory () {
        const axisCalculatorSettings: axisCalculatorParams = {
          accuracy: {
            min: 0,
            max: 15,
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
        }

        return new AxisCalculator (axisCalculatorSettings);
      }
    },
    AppState
  ]
})

class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule).catch((err: any) => console.error(err));