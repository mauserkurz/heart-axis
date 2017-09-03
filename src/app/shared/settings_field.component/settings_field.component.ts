// angular
import { AfterViewInit, Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
// components
import { BtnPlus } from "../btn_plus.component/btn_plus.component";
import { JqHelper } from "../../helpers/jqHelper";

@Component ({
  selector: 'settings-field',
  templateUrl: './settings_field.component.html'
})

export class SettingsFieldComponent implements AfterViewInit, OnDestroy {
  @Input() input: FormControl;
  @Input() step: number;
  @Input() maximum: number;
  @Input() minimum: number;
  @Input() value: number;
  @Input() data: {[s: string]: any};
  @HostBinding('class.form-group') formGroup: boolean = true;

  constructor () {}

  ngAfterViewInit () {
    JqHelper.popoverStart ();
  }
  ngOnDestroy () {
    JqHelper.popoverHide ();
  }
}