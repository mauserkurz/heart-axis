// angular
import { Component, HostBinding } from "@angular/core";
// services and helpers
import { fadeIn } from "../../services/animations";

@Component ({
  selector: 'index',
  templateUrl: './index.component.html',
  animations: [
    fadeIn
  ],
  host: { '[@fadeIn]': '' }
})

export class IndexComponent {
  @HostBinding('class.container') container: boolean = true;
}