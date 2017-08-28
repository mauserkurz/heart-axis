import { Component, HostBinding } from "@angular/core";

@Component ({
  selector: 'not-found.',
  templateUrl: './not_found.component.html'
})

export class NotFoundComponent {
  @HostBinding('class.container') container: boolean = true;
}