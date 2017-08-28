import { Component, HostBinding } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppState } from '../../services/app_state.service';

@Component ({
  selector: 'faq',
  templateUrl: './faq.component.html'
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