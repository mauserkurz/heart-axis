// angular
import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
// services and helpers
import { borderArrayItem, QTcService, viewArrayItem } from "../services/qtc.service";
import { fadeIn } from "../../services/animations";
import { checkMaximum, checkMinimum, verifyNum } from "../../helpers/validators";
// components
import { SumFieldComponent } from "../../shared/sum_field.component/sum_field.component";

@Component ({
  selector: 'qtc',
  templateUrl: "./qtc.component.html",
  animations: [
    fadeIn
  ],
  host: { '[@fadeIn]': '' }
})

export class QTcComponent implements OnInit, OnDestroy {
  qtcForm: FormGroup;
  qt: AbstractControl;
  rr: AbstractControl;
  isMaleField: AbstractControl;
  isMale: boolean;
  outputBazett: string;
  outputFredericia: string;
  outputHodges: string;
  outputFramingham: string;
  compareResult: { [key: string]: viewArrayItem };
  @HostBinding('class.container') container: boolean = true;

  constructor (
    fb: FormBuilder,
    public service: QTcService
  ) {
    this.isMale = this.service.settings.isMale;

    this.qtcForm = fb.group({
        'qt': [
          this.service.settings.interval.initQT,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.service.settings.interval.min),
              checkMaximum (this.service.settings.interval.max)
            ]
          )
        ],
        'rr': [
          this.service.settings.interval.initRR,
          Validators.compose(
            [
              Validators.required,
              verifyNum,
              checkMinimum (this.service.settings.interval.min),
              checkMaximum (this.service.settings.interval.max)
            ]
          )
        ],
        'isMale': [
          this.service.settings.isMale
        ],
    });

    this.qt = this.qtcForm.controls['qt'];
    this.rr = this.qtcForm.controls['rr'];
    this.isMaleField = this.qtcForm.controls['isMale'];

    this.qtcForm.valueChanges.subscribe (() => {
      this.displayValue ();
    });

    this.isMaleField.valueChanges.subscribe ((value) => {
      this.isMale = value;
    });
  }

  ngOnInit (): void {
    let formValue = sessionStorage.getItem('lastQTc');

    if (formValue !== null) {
      this.qtcForm.setValue (JSON.parse(formValue));
    }

    this.displayValue ();
  }

  ngOnDestroy (): void {
    sessionStorage.setItem('lastQTc', JSON.stringify(this.qtcForm.value));
  }

  classifyQTc (action?: string): void {
    let result: { [key: string]: viewArrayItem} = {};

    if (action === 'clear') {
      this.compareResult = result;
    } else {
      let selector: string = this.isMale ? 'male' : 'female';

      result['bazett'] = this.service.settings.ranges[selector].compareValue(
        this.service.getByBazett(this.qt.value, this.rr.value)
      );
      result['fredericia'] = this.service.settings.ranges[selector].compareValue(
        this.service.getByFredericia(this.qt.value, this.rr.value)
      );
      result['framingham'] = this.service.settings.ranges[selector].compareValue(
        this.service.getByFramingham(this.qt.value, this.rr.value)
      );
      result['hodges'] = this.service.settings.ranges[selector].compareValue(
        this.service.getByHodges(this.qt.value, this.rr.value)
      );

      this.compareResult = result;
    }
  }

  displayValue (): void {
    if (this.qtcForm.invalid) {
      this.outputBazett =
        this.outputFramingham =
          this.outputFredericia =
            this.outputHodges = 'ERROR';
      this.classifyQTc ('clear');
    } else {
      this.outputBazett = `${this.service.getByBazett(this.qt.value, this.rr.value)}`;
      this.outputFramingham = `${this.service.getByFramingham(this.qt.value, this.rr.value)}`;
      this.outputFredericia = `${this.service.getByFredericia(this.qt.value, this.rr.value)}`;
      this.outputHodges = `${this.service.getByHodges(this.qt.value, this.rr.value)}`;
      this.classifyQTc ();
    }
  }

  reset (event?: MouseEvent): void {
    if (event) {
      event.preventDefault ();
    }

    this.qt.reset (this.service.settings.interval.initQT);
    this.rr.reset (this.service.settings.interval.initRR);
    this.isMaleField.reset (this.service.settings.isMale);
  }
}