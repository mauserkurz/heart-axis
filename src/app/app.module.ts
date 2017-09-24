// angular
import { enableProdMode, NgModule } from '@angular/core';
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
    RouterModule.forRoot(routes, { useHash: true }),
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

enableProdMode(); // enable production state
platformBrowserDynamic().bootstrapModule(AppModule).catch((err: any) => console.error(err));