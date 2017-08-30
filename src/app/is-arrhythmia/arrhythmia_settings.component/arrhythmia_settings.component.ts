// angular
import { Component, OnInit, OnDestroy, HostBinding } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
// services and helpers
import { verifyNum, checkMinimum, checkMaximum } from "../../helpers/validators";
import { ArrhythmiaService } from "../services/arrhythmia.service";
import { AppState } from "../../services/app_state.service";
import { fadeIn } from "../../services/animations";
// components
import { SettingsFieldComponent } from "../../shared/settings_field.component/settings_field.component";

@Component ({
  selector: 'arrhythmia-settings',
  templateUrl: './arrhythmia_settings.component.html',
  animations: [
    fadeIn
  ],
  host: { '[@fadeIn]': '' }
})

export class ArrhythmiaSettingsComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  accuracy: AbstractControl;
  coefficient: AbstractControl;
  difference: AbstractControl;
  usePercentageField: AbstractControl;
  moreThenOnlyField: AbstractControl;
  usePercentage: boolean;
  moreThenOnly: boolean;
  formChanged: boolean;
  message: string;
  messageLoop: any;
  @HostBinding('class.container') container: boolean = true;

  constructor (
    fb: FormBuilder,
    public service: ArrhythmiaService,
    public state: AppState
  ) {
    this.usePercentage = state.getValue ('usePercentage').use;
    this.moreThenOnly = this.service.moreThenOnly;

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
      'coefficient': [
        this.service.settings.coefficient.init,
        Validators.compose(
          [
            Validators.required,
            verifyNum,
            checkMinimum (this.service.settings.coefficient.min),
            checkMaximum (this.service.settings.coefficient.max)
          ]
        )
      ],
      'difference': [
        this.service.settings.difference.init,
        Validators.compose(
          [
            Validators.required,
            verifyNum,
            checkMinimum (this.service.settings.difference.min),
            checkMaximum (this.service.settings.difference.max)
          ]
        )
      ],
      'moreThenOnly': [
        this.moreThenOnly
      ],
      'usePercentage': [
        this.usePercentage
      ],
    });

    this.accuracy = this.settingsForm.controls['accuracy'];
    this.coefficient = this.settingsForm.controls['coefficient'];
    this.difference = this.settingsForm.controls['difference'];
    this.usePercentageField = this.settingsForm.controls['usePercentage'];
    this.moreThenOnlyField = this.settingsForm.controls['moreThenOnly'];

    state.getStream ('usePercentage').subscribe ((value) => {
      this.usePercentage = value.use;
    });

    this.settingsForm.valueChanges.subscribe((data) => {
      this.formChanged = this.checkFormChanges (data);
    });

    this.usePercentageField.valueChanges.subscribe((data) => {
      this.state.toggle ('usePercentage', data);
    });

    this.moreThenOnlyField.valueChanges.subscribe((data) => {
      this.moreThenOnly = data;
      this.service.moreThenOnly = data;
    });
  }

  ngOnInit (): void {
    let formValue = sessionStorage.getItem('lastArrhythmiaSettings');

    if (formValue !== null) {
      this.settingsForm.setValue (JSON.parse(formValue));
      this.setSettings ();
    }
  }

  ngOnDestroy (): void {
    sessionStorage.setItem('lastArrhythmiaSettings', JSON.stringify(this.settingsForm.value));
  }

  onSubmit (val: object): void {
    if (this.settingsForm.valid) {
      this.setSettings ();
      this.formChanged = false;
      this.showResult ('сохранено');
    }
  }

  setSettings (): void {
    this.service.accuracy  = this.accuracy.value;
    this.service.coefficient  = this.coefficient.value;
    this.service.difference  = this.difference.value;
    this.service.moreThenOnly  = this.moreThenOnlyField.value;
  }

  reset (event: MouseEvent): void {
    event.preventDefault ();
    this.accuracy.reset (this.service.settings.accuracy.init);
    this.coefficient.reset (this.service.settings.coefficient.init);
    this.difference.reset (this.service.settings.difference.init);
    this.moreThenOnlyField.reset (this.service.settings.moreThenOnly);
    this.usePercentageField.reset (true);
    this.setSettings ();
    this.formChanged = false;
    this.showResult ('сброшено');
  }

  showResult (message: string): void {
    this.message = message;
    if (this.messageLoop) {
      clearTimeout (this.messageLoop);
    }

    this.messageLoop = setTimeout (() => {
      this.message = void (0);
    }, 3000);
  }

  checkFormChanges (val: object): boolean {
    return val['accuracy'] !== this.service.accuracy
      || val['coefficient'] !== this.service.coefficient
      || val['difference'] !== this.service.difference
      || val['moreThenOnly'] !== this.service.moreThenOnly;
  }
}