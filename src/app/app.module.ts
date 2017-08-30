// angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// services
import { AppState } from "./services/app_state.service";
import { routes } from "./app.routes";
// app
import { AppComponent } from "./app.component";
import { CalcWrapperComponent } from "./common/calc_wrapper.component/calc_wrapper.component";
import { NotFoundComponent } from "./common/not_found.component/not_found.component";
import { IndexComponent } from './common/index.component/index.component';
import { FAQListComponent } from './common/faq_list.component/faq_list.component';
// nested modules
import { AxisHeartModule } from "./axis-heart/index";
import { IsArrhythmiaModule } from "./is-arrhythmia/index";

@NgModule({
  declarations: [
    AppComponent,
    CalcWrapperComponent,
    NotFoundComponent,
    IndexComponent,
    FAQListComponent,
  ],
  imports: [
    BrowserModule,
    AxisHeartModule,
    IsArrhythmiaModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    AppState
  ]
})

export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule).catch((err: any) => console.error(err));