// angular
import { Component, HostBinding } from "@angular/core";
// services and helpers
import { fadeIn } from "../../services/animations";

@Component ({
  selector: 'not-found.',
  templateUrl: './not_found.component.html',
  animations: [
    fadeIn
  ],
  host: { '[@fadeIn]': '' }
})

export class NotFoundComponent {
  @HostBinding('class.container') container: boolean = true;
}