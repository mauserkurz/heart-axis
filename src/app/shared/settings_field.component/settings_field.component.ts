// angular
import { Component, HostBinding, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
// components
import { BtnPlus } from "../btn_plus.component/btn_plus.component";

@Component ({
  selector: 'settings-field',
  templateUrl: './settings_field.component.html'
})

export class SettingsFieldComponent {
  @Input() input: FormControl;
  @Input() step: number;
  @Input() maximum: number;
  @Input() minimum: number;
  @Input() value: number;
  @Input() data: {[s: string]: any};
  @HostBinding('class.container') container: boolean = true;

  constructor () {}
}