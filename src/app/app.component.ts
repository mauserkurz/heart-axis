// angular
import { Component, HostBinding, ViewEncapsulation, } from "@angular/core";
// services
import { fadeIn } from "./services/animations";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: [
   './app.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeIn
  ],
  host: { '[@fadeIn]': '' }
})

export class AppComponent {
  @HostBinding('class.container') container: boolean = true;

  constructor () {}

}