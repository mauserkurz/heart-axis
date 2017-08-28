import { Component, HostBinding } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppState } from '../../services/app_state.service';

@Component ({
  selector: 'calc-wrap',
  templateUrl: './calc_wrapper.component.html'
})

export class CalcWrapperComponent {
  @HostBinding('class.container') container: boolean = true;
  title: string;
  calculatorType: string;

  constructor (
    private route: ActivatedRoute,
    private state: AppState
  ) {
    route
      .url
      .subscribe ( value => this.calculatorType = value[0].path );
    state
      .getDataStream ('calcWrapperData')
      .subscribe ( value => this.title = value[this.calculatorType].title );
  }
}