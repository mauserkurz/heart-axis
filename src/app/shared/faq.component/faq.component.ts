// angular
import { Component, HostBinding } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
// services and helpers
import { AppState } from '../../services/app_state.service';
import { fadeIn } from "../../services/animations";

@Component ({
  selector: 'faq',
  templateUrl: './faq.component.html',
  animations: [
    fadeIn
  ],
  host: { '[@fadeIn]': '' }
})

export class FaqComponent {
  data: string;
  calculatorType: any;
  @HostBinding('class.container') container: boolean = true;

  constructor (
    private route: ActivatedRoute,
    private state: AppState
  ) {
    route
      .parent
      .url
      .subscribe ( value => this.calculatorType = value[0].path );
    state
      .getDataStream ('faqData')
      .subscribe ( value => this.data = value[this.calculatorType].data );
  }
}