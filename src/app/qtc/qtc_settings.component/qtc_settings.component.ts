// angular
import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
// services and helpers
import { QTcService } from "../services/qtc.service";
import { fadeIn } from "../../services/animations";
import { checkMaximum, checkMinimum, noSuchBorders, verifyNum } from "../../helpers/validators";
// components
import { SettingsFieldComponent } from "../../shared/settings_field.component/settings_field.component";

@Component ({
  selector: 'qtc-settings',
  templateUrl: './qtc_settings.component.html',
  animations: [
    fadeIn
  ],
  host: { '[@fadeIn]': '' }
})
export class QTcSettingsComponent implements OnInit, OnDestroy {
  rangeForm: FormGroup;
  name: AbstractControl;
  border: AbstractControl;
  colorClass: AbstractControl;

  settingsForm: FormGroup;
  accuracy: AbstractControl;

  formChanged: boolean;
  message: string;
  messageLoop: any;
  maleData: any[];
  femaleData: any[];
  maleRange: any[];
  femaleRange: any[];
  selectedSex: string = 'male';
  @HostBinding('class.container') container: boolean = true;

  constructor (
    fb: FormBuilder,
    public service: QTcService
  ) {
    this.settingsForm = fb.group({
      'accuracy': [
        this.service.settings.accuracy.init,
        Validators.compose(
          [
            Validators.required,
            verifyNum,
            checkMinimum (this.service.settings.accuracy.min),
            checkMaximum (this.service.settings.accuracy.max)
          ]
        )
      ],
    });

    this.accuracy = this.settingsForm.controls['accuracy'];

    this.accuracy.valueChanges.subscribe((value) => {
      this.service.settings.ranges['male'].updateAccuracy (value);
      this.service.settings.ranges['female'].updateAccuracy (value);
    });

    this.settingsForm.valueChanges.subscribe((data) => {
      this.formChanged = this.checkFormChanges (data);
    });

    this.rangeForm = fb.group({
      'name': [
        'Новая граница',
        Validators.required
      ],
      'border': [
        300,
        Validators.compose(
          [
            Validators.required,
            checkMinimum (this.service.settings.interval.min),
            checkMaximum (this.service.settings.interval.max),
            noSuchBorders (this.service.settings.ranges[this.selectedSex])
          ]
        )
      ],
      'colorClass': [
        'alert-info',
        Validators.required
      ]
    });

    this.name = this.rangeForm.controls['name'];
    this.border = this.rangeForm.controls['border'];
    this.colorClass = this.rangeForm.controls['colorClass'];

    this.showRange ('male');
    this.showRange ('female');
  }

  private showRange (type: string): void {
    this.service.settings.ranges[type].viewArrayObserver.subscribe( value => {
      this[type + 'Range'] = value;
    });
    this.service.settings.ranges[type].currentDataObserver.subscribe( value => {
      this[type + 'Data'] = value;
      this.reInitBorderValidation (type);
    });
  }

  ngOnInit (): void {
    let formValue = sessionStorage.getItem('lastQTcSettings');

    if (formValue !== null) {
      this.settingsForm.setValue (JSON.parse(formValue));
      this.setSettings ();
    }
  }

  ngOnDestroy (): void {
    sessionStorage.setItem('lastQTcSettings', JSON.stringify(this.settingsForm.value));
  }

  setSettings (): void {
    this.service.accuracy  = this.accuracy.value;
  }

  showResult (message: string): void {
    this.message = message;

    clearTimeout (this.messageLoop);

    this.messageLoop = setTimeout (() => {
      this.message = void (0);
    }, 3000);
  }

  reset (event: MouseEvent): void {
    event.preventDefault ();
    this.service.settings.ranges['male'].resetValue();
    this.service.settings.ranges['female'].resetValue();
    this.rangeForm.reset({ name: 'Новая граница', border: 300, colorClass: 'alert-info' });
    this.accuracy.reset (this.service.settings.accuracy.init);
    this.setSettings ();
    this.formChanged = false;
    this.showResult ('сброшено');
  }

  onSubmit (val: object): void {
    if (this.settingsForm.valid) {
      this.setSettings ();
      this.formChanged = false;
      this.showResult ('сохранено');
    }
  }

  checkFormChanges (val: object): boolean {
    return val['accuracy'] !== this.service.accuracy;
  }

  addItem (val: any): void {
    if (this.rangeForm.valid) {
      this.service.settings.ranges[this.selectedSex].addItem ({
        name: val.name,
        border: val.border,
        colorClass: val.colorClass,
      });
    }
  }

  updateSex (value: string): void {
    this.selectedSex = value;
    this.reInitBorderValidation (value);
  }

  reInitBorderValidation (selectedSex: string): void {
    this.border.setValidators(Validators.compose ([
      Validators.required,
      checkMinimum (this.service.settings.interval.min),
      checkMaximum (this.service.settings.interval.max),
      noSuchBorders (this.service.settings.ranges[selectedSex])
    ]));
    this.border.updateValueAndValidity();
  }

  removeRangeItem (type: string, index: number): void {
    this.service.settings.ranges[type].removeItem(index);
  }
}