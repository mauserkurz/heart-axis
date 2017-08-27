// angular
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
// services and helpers
import { verifyNum, checkMinimum, checkMaximum } from "../../helpers/validators";
import { AxisCalculator } from "../services/axis_calculator.service";
import { AppState } from "../../services/app_state.service";
// components
import { SettingsFieldComponent } from "../../shared/settings_field.component/settings_field.component";

@Component ({
  selector: 'axis-settings',
  templateUrl: './axis_settings.component.html'
})

export class AxisSettingsComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  accuracy: AbstractControl;
  maxSum: AbstractControl;
  maxWave: AbstractControl;
  useSumsField: AbstractControl;
  useSums: boolean;
  formChanged: boolean;
  message: string;
  messageLoop: any;

  constructor (
    fb: FormBuilder,
    public axisCalculatorModel: AxisCalculator,
    public state: AppState
  ) {
    this.useSums = state.getValue ('useSums').use;

    this.settingsForm = fb.group({
      'accuracy': [
        this.axisCalculatorModel.settings.accuracy.default,
        Validators.compose(
          [
            Validators.required,
            verifyNum,
            checkMinimum (this.axisCalculatorModel.settings.accuracy.min),
            checkMaximum (this.axisCalculatorModel.settings.accuracy.max)
          ]
        )
      ],
      'maxSum': [
        this.axisCalculatorModel.settings.maxSum.default.max,
        Validators.compose(
          [
            Validators.required,
            verifyNum,
            checkMinimum (this.axisCalculatorModel.settings.maxSum.min),
            checkMaximum (this.axisCalculatorModel.settings.maxSum.max)
          ]
        )
      ],
      'maxWave': [
        this.axisCalculatorModel.settings.maxWave.default.max,
        Validators.compose(
          [
            Validators.required,
            verifyNum,
            checkMinimum (this.axisCalculatorModel.settings.maxWave.min),
            checkMaximum (this.axisCalculatorModel.settings.maxWave.max)
          ]
        )
      ],
      'useSums': [
        !this.useSums
      ],
    });

    this.accuracy = this.settingsForm.controls['accuracy'];
    this.maxSum = this.settingsForm.controls['maxSum'];
    this.maxWave = this.settingsForm.controls['maxWave'];
    this.useSumsField = this.settingsForm.controls['useSums'];

    state.getStream ('useSums').subscribe ((value) => {
      this.useSums = value.use;
    });

    this.settingsForm.valueChanges.subscribe((data) => {
      this.formChanged = this.checkFormChanges (data);
    });

    this.useSumsField.valueChanges.subscribe((data) => {
      this.changeInputs (!data);
    });
  }

  ngOnInit (): void {
    let formValue = sessionStorage.getItem('lastSettings');

    if (formValue !== null) {
      this.settingsForm.setValue (JSON.parse(formValue));
      this.setSettings ();
    }
  }

  ngOnDestroy (): void {
    sessionStorage.setItem('lastSettings', JSON.stringify(this.settingsForm.value));
  }

  onSubmit (val: object): void {
    if (this.settingsForm.valid) {
      this.setSettings ();
      this.formChanged = false;
      this.showResult ('сохранено');
    }
  }

  setSettings (): void {
    this.axisCalculatorModel
      .setAccuracy (this.accuracy.value)
      .setMaxSum (-1 * this.maxSum.value, this.maxSum.value)
      .setMaxWave (this.maxWave.value);
  }

  reset (event: MouseEvent): void {
    event.preventDefault ();
    this.accuracy.reset (this.axisCalculatorModel.settings.accuracy.default);
    this.maxSum.reset (this.axisCalculatorModel.settings.maxSum.default.max);
    this.maxWave.reset (this.axisCalculatorModel.settings.maxWave.default.max);
    this.state.toggle ('useSums', true);
    this.setSettings ();
    this.formChanged = false;
    this.showResult ('сброшено');
  }

  changeInputs (direction: boolean): void {
    this.state.toggle ('useSums', direction);
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
    return val['accuracy'] !== this.axisCalculatorModel.accuracy
      || val['maxSum'] !== this.axisCalculatorModel.maxSum.max
      || val['maxWave'] !== this.axisCalculatorModel.maxWave.max
      || val['useSums'] === this.useSums;
  }
}