import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app',
  styles: [
    require('../css/styles.scss').toString(),
  ],
  template: `
    <h1>Webpack with angular starter.</h1>
  `
})
class App {

  constructor () {}

}

@NgModule({
  declarations: [App],
  imports: [BrowserModule],
  bootstrap: [App]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);