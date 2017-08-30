// angular
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
// components
import { BtnPlus } from "../btn_plus.component/btn_plus.component";
import { JqHelper } from "../../helpers/jqHelper";

@Component ({
  selector: 'sum-field',
  templateUrl: './sum_field.component.html'
})

export class SumFieldComponent implements OnInit, OnDestroy {
  @Input() input: FormControl;
  @Input() step: number;
  @Input() maximum: number;
  @Input() minimum: number;
  @Input() data: {[s: string]: string};
  @HostBinding('class.form-group') formGroup: boolean = true;

  constructor () {}

  ngOnInit () {
    JqHelper.popoverStart ();
  }
  ngOnDestroy () {
    JqHelper.popoverHide ();
  }
}