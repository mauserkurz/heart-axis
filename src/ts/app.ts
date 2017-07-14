import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { APP_BASE_HREF } from "@angular/common";
import { RouterModule } from "@angular/router";
import { App, routes } from "./app.component";
import { CalculatorComponent } from "./calculator.component";
import { FaqComponent } from "./faq.component";

@NgModule({
  declarations: [App, CalculatorComponent, FaqComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  bootstrap: [App],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ]
})

class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule).catch((err: any) => console.error(err));