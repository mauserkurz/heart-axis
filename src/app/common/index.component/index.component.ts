import { Component, HostBinding } from "@angular/core";

@Component ({
  selector: 'index',
  templateUrl: './index.component.html'
})

export class IndexComponent {
  @HostBinding('class.container') container: boolean = true;
}