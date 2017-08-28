import { Component, HostBinding } from "@angular/core";

@Component ({
  selector: 'faq-list',
  templateUrl: './faq_list.component.html'
})

export class FAQListComponent {
  @HostBinding('class.container') container: boolean = true;
}