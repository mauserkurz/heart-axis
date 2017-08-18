import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { checkMinimum, checkMaximum, verifyNum, allValuesNotZero, sumOfValuesNotZero } from './validators';

describe ('Validators', () => {
  const minimum: number = 10;
  const maximum: number = 10;
  const control: FormControl = new FormControl;

  describe ('checkMinimum', () => {
    it ('return error when value of FormControl is less then minimum', () => {
      control.setValue (9);
      expect (checkMinimum (minimum) (control)).toEqual ({ invalidMinimum: true });
    });

    it ('no error when value of FormControl is equal minimum', () => {
      control.setValue (10);
      expect (checkMinimum (minimum) (control)).toEqual (undefined);
    });

    it ('no error when value of FormControl is greater then minimum', () => {
      control.setValue (11);
      expect (checkMinimum (minimum) (control)).toEqual (undefined);
    });
  });

  describe ('checkMaximum', () => {
    it ('return error when value of FormControl is greater then maximum', () => {
      control.setValue (11);
      expect (checkMaximum (maximum) (control)).toEqual ({ invalidMaximum: true });
    });

    it ('no error when value of FormControl is equal maximum', () => {
      control.setValue (10);
      expect (checkMaximum (maximum) (control)).toEqual (undefined);
    });

    it ('no error when value of FormControl is less then maximum', () => {
      control.setValue (9);
      expect (checkMaximum (maximum) (control)).toEqual (undefined);
    });
  });

  describe ('verifyNum', () => {
    it ('return error when value of FormControl is not number', () => {
      control.setValue ('0');
      expect (verifyNum (control)).toEqual ({ invalidNumber: true }); 
    });

    it ('return error when value of FormControl is infinite', () => {
      control.setValue (Infinity);
      expect (verifyNum (control)).toEqual ({ invalidNumber: true }); 
    });

    it ('no error when value of FormControl is number and finite', () => {
      control.setValue (0);
      expect (verifyNum (control)).toEqual (undefined); 
    });
  });

  describe ('allValuesNotZero', () => {
    let fb: FormBuilder;
    let form: FormGroup;

    beforeEach (() => {
      fb = new FormBuilder;
      form = fb.group ({
        'sumI': [0],
        'sumIII': [0],
      });
    });

    it ('should return error when all controls value is zero', () => {
      expect (allValuesNotZero ('sumI', 'sumIII')(form)).toEqual ({ allValueIsZero: true }); 
    });

    it ('no return error when some control value is not zero', () => {
      form.controls['sumI'].setValue (1);
      expect (allValuesNotZero ('sumI', 'sumIII')(form)).toEqual (undefined); 
    });
  });

  describe ('sumOfValuesNotZero', () => {
    let fb: FormBuilder;
    let form: FormGroup;

    beforeEach (() => {
      fb = new FormBuilder;
      form = fb.group ({
        'r1': [1],
        'qs1': [1],
        'r3': [5],
        'qs3': [5],
      });
    });

    it ('should return error when all sums controls is zero', () => {
      expect (sumOfValuesNotZero (['r1', 'qs1'], ['r3', 'qs3'])(form)).toEqual ({ allSumsIsZero: true }); 
    });

    it ('no return error when some sum of control is not zero', () => {
      form.controls['r1'].setValue (2);
      expect (sumOfValuesNotZero (['r1', 'qs1'], ['r3', 'qs3'])(form)).toEqual (undefined); 
    });
  });
});