// angular
import { Component, OnInit, OnDestroy, HostBinding } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
// services and helpers
import { verifyNum, checkMinimum, checkMaximum } from "../../helpers/validators";
import { ArrhythmiaService } from '../services/arrhythmia.service';
import { AppState } from "../../services/app_state.service";
// components
import { SumFieldComponent } from "../../shared/sum_field.component/sum_field.component";

@Component ({
  selector: 'arrhythmia',
  templateUrl: "./arrhythmia.component.html",
})

export class ArrhythmiaComponent implements OnInit, OnDestroy {
  arrhythmiaForm: FormGroup;
  pp1: AbstractControl;
  pp2: AbstractControl;
  heartRate: number[];
  output: string;
  useSeconds: boolean;
  isArrhythmia: boolean = false;
  usePercentage: boolean;
  @HostBinding('class.container') container: boolean = true;

  constructor (
    fb: FormBuilder,
    public arrhythmiaModel: ArrhythmiaService,
    public state: AppState
  ) {
    this.arrhythmiaForm = fb.group({
        'pp1': [
          this.arrhythmiaModel.settings.interval.init,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.arrhythmiaModel.settings.interval.min),
              checkMaximum (this.arrhythmiaModel.settings.interval.max)
            ]
          )
        ],
        'pp2': [
          this.arrhythmiaModel.settings.interval.init,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.arrhythmiaModel.settings.interval.min),
              checkMaximum (this.arrhythmiaModel.settings.interval.max)
            ]
          )
        ],
    });

    this.pp1 = this.arrhythmiaForm.controls['pp1'];
    this.pp2 = this.arrhythmiaForm.controls['pp2'];

    this.arrhythmiaForm.valueChanges.subscribe (() => {
      this.displayValue ();
    });

    this.usePercentage = state.getValue('usePercentage').use;
    state.getStream('usePercentage').subscribe(value => this.usePercentage = value.use);
  }

  ngOnInit (): void {
    let formValue = sessionStorage.getItem('lastPP');

    if (formValue !== null) {
      this.arrhythmiaForm.setValue (JSON.parse(formValue));
    }

    this.displayValue ();
  }

  ngOnDestroy (): void {
    sessionStorage.setItem('lastPP', JSON.stringify(this.arrhythmiaForm.value));
  }

  getValue (): number {
    let result: number;

    if (this.usePercentage) {
      result = this.arrhythmiaModel.countProportion (this.pp1.value, this.pp2.value);
      this.isArrhythmia = this.arrhythmiaModel.isArrhythmia (result, this.arrhythmiaModel.coefficient);
    } else {
      result = this.arrhythmiaModel.countDifferenceTime (this.pp1.value, this.pp2.value);
      this.isArrhythmia = this.arrhythmiaModel.isArrhythmia (result, this.arrhythmiaModel.difference);
    }

    return result;
  }

  displayValue (): void {
    if (this.arrhythmiaForm.invalid) {
      this.output = 'Форма заполнена не корректно';
    } else {
      let result: number = this.getValue();

      this.output = `${result} ${this.usePercentage ? '%' : 'мс'}`;
      this.heartRate = this.getHeartRate ();
    }
  }

  reset (event?: MouseEvent): void {
    if (event) {
      event.preventDefault ();
    }

    this.pp1.reset (this.arrhythmiaModel.settings.interval.init);
    this.pp2.reset (this.arrhythmiaModel.settings.interval.init);
  }

  getHeartRate (): number[] {
    return this.arrhythmiaModel.getHeartRate(
      this.pp1.value,
      this.pp2.value,
      this.isArrhythmia
    );
  }
}