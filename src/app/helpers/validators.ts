import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { Range } from "../qtc/services/qtc.service";

interface customError {
  [s: string]: boolean,
}

export function checkMinimum (minimum: number): ValidatorFn {
  return (control: FormControl): customError => {
    if (control.value < minimum) {
      return { invalidMinimum: true };
    }
  }
}

export function checkMaximum (maximum: number): ValidatorFn {
  return (control: FormControl): customError => {
    if (control.value > maximum) {
      return { invalidMaximum: true };
    }
  }
}

export function verifyNum (control: FormControl): customError {
  if (typeof control.value !== 'number' || !isFinite (control.value)) {
    return { invalidNumber: true };
  }
}

export function allValuesNotZero (...controlsKeys: string[]): ValidatorFn {
  return (form: FormGroup): customError => {
    let values: number[] = [];

    controlsKeys.map ((elem) => {
      values.push (form.controls[elem].value);
    });

    if (values.every (elem => elem === 0)) {
      return { allValueIsZero: true };
    }
  }
}

export function sumOfValuesNotZero (...controlCouples: string[][]): ValidatorFn {
  return (form: FormGroup): customError => {
    let values: number[] = [];

    controlCouples.map (couple => {
      values.push (
        form.controls[couple[0]].value - form.controls[couple[1]].value
      );
    });

    if (values.every (elem => elem === 0)) {
      return { allSumsIsZero: true };
    }
  }
}

export function noSuchBorders (range: Range): ValidatorFn {
  return (control: FormControl): customError => {
    let targetRange: any[] = range.currentDataObserver.value.slice(0);

    if (targetRange.some(value => control.value === value.border)) {
      return { borderExist: true };
    }
  }
}