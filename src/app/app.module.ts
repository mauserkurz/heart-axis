import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Directive for outside click listening
import { ClickOutsideModule } from 'ng-click-outside';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ClickOutsideModule, // TODO replace with own directive
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
