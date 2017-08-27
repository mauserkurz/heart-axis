// angular
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
// components
import { BtnPlus } from "../btn_plus.component/btn_plus.component";

@Component ({
  selector: 'sum-field',
  templateUrl: './sum_field.component.html'
})

export class SumFieldComponent {
  @Input() input: FormControl;
  @Input() step: number;
  @Input() maximum: number;
  @Input() minimum: number;
  @Input() data: {[s: string]: string};

  constructor () {}
}