// angular
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
// components
import { BtnPlus } from "../btn_plus.component/btn_plus.component";
import { BtnMinus } from "../btn_minus.component/btn_minus.component";

@Component ({
  selector: 'sum-field',
  templateUrl: './sum_field.component.html'
})

export class SumFieldComponent {
  @Input() input: FormControl;
  @Input() maximum: number;
  @Input() minimum: number;
  @Input() data: {[s: string]: string};

  constructor () {}
}