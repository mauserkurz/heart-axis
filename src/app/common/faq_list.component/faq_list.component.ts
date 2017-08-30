// angular
import { Component, HostBinding } from "@angular/core";
// services and helpers
import { slideInOut } from "../../services/animations";

@Component ({
  selector: 'faq-list',
  templateUrl: './faq_list.component.html',
  animations: [
    slideInOut
  ],
  host: { '[@slideInOut]': '' }
})

export class FAQListComponent {
  @HostBinding('class.container') container: boolean = true;
}