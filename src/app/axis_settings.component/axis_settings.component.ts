// angular
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
// services and helpers
import { verifyNum, checkMinimum, checkMaximum } from "../helpers/validators";
import { AxisCalculator } from "../services/axis_calculator.service";
import { AppState } from "../services/app_state.service";
// components
import { BtnPlus } from "../btn_plus.component/btn_plus.component";
import { BtnMinus } from "../btn_minus.component/btn_minus.component";

@Component ({
  selector: 'axis-settings',
  templateUrl: './axis_settings.component.html'
})

export class AxisSettingsComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  accuracy: AbstractControl;
  maxSum: AbstractControl;
  maxWave: AbstractControl;
  useSums: boolean;
  message: string;
  messageLoop: any;

  constructor (
    fb: FormBuilder,
    public axisCalculatorModel: AxisCalculator,
    public state: AppState
  ) {

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
    });

    this.accuracy = this.settingsForm.controls['accuracy'];
    this.maxSum = this.settingsForm.controls['maxSum'];
    this.maxWave = this.settingsForm.controls['maxWave'];
    this.useSums = state.useSumsCurrent ().useSums;

    state.useSumsStream ().subscribe ((value) => {
      this.useSums = value.useSums;
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
    this.state.toggleSums (true);
    this.setSettings ();
    this.showResult ('сброшено');
  }

  changeInputs (): void {
    this.state.toggleSums ();
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
}