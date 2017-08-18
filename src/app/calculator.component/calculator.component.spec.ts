import { Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { By } from '@angular/platform-browser';
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { Observable } from 'rxjs';
import { AxisCalculator, axisCalculatorParams } from "../services/axis_calculator.service";
import { AppState } from "../services/app_state.service";

// @Directive({
//   selector: 'btn-minus'
// })
// class MockBtnMinus {
//   @Input('input')
//   public input: FormControl;
// }

// @Directive({
//   selector: 'btn-plus'
// })
// class MockBtnPlus {
//   @Input('input')
//   public input: FormControl;
// }

@Directive({
  selector: 'sum-field'
})
class MockSumField {
  @Input('input') public input: FormControl;
  @Input('maximum') public maximum: number;
  @Input('minimum') public minimum: number;
  @Input('data') public data: {[s: string]: string};
}

describe ('CalculatorComponent', () => {
  const formValue: {[s:string]: number} = {
        qs1: 10,
        qs3: 10,
        r1: 10,
        r3: 10,
        sumI: 10,
        sumIII: 10
      };
  let axisCalculatorSettings: axisCalculatorParams;
  let component: CalculatorComponent;
  let appState: AppState;
  let axisCalculator: AxisCalculator;
  let fixture: ComponentFixture<CalculatorComponent>;
  let element: HTMLElement, input: Element, output: HTMLOutputElement, reset: Element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ],
      declarations: [
        CalculatorComponent,
        MockSumField,
      ],
      providers: [
        { provide: AxisCalculator, useFactory () {
            axisCalculatorSettings = {
              accuracy: {
                min: 0,
                max: 15,
                default: 2,
              },

              maxSum: {
                min: 0,
                max: 1000,
                default: {
                  min: -20,
                  max: 20,
                },
                initValue: 1,
              },

              maxWave: {
                min: 0,
                max: 1000,
                default: {
                  min: 0,
                  max: 20,
                },
                initR: 1,
                initQS: 0,
              },
            }

            return new AxisCalculator (axisCalculatorSettings);
          }
        },
        AppState,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    sessionStorage.removeItem ('lastSums');
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    appState = TestBed.get(AppState);
    axisCalculator = TestBed.get(AxisCalculator);
    fixture.detectChanges();

    // spy on axisCalculator service
    spyOn(axisCalculator, 'countAngle').and.callFake((sumI: number, sumIII: number): number => {
      if (sumI === 0 && sumIII === 5) {
        return 90;
      } else if (sumI !== 0 && sumIII !== 0) {
        return 120;
      } else {
        return NaN;
      }
    });
    spyOn(axisCalculator, 'countSumsThenAngle').and.returnValue(60);
    spyOn(axisCalculator, 'setAccuracy').and.returnValue(axisCalculator);
    spyOn(axisCalculator, 'setMaxSum').and.returnValue(axisCalculator);
    spyOn(axisCalculator, 'setMaxWave').and.returnValue(axisCalculator);
    // spy on appState service
    spyOn(appState, 'toggleSums').and.returnValue(appState);
    spyOn(appState, 'useSumsCurrent').and.returnValue({ useSums: true });
    spyOn(appState, 'useSumsStream').and.returnValue(Observable.of({ useSums: true }));
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });

  describe ('check validation', () => {
    it ('default value of inputs is valid', () => {
      for (let i in component.calculatorForm.controls) {
        console.log (component.calculatorForm.controls[i].errors);
        console.log (component.calculatorForm.controls[i].value, i);
      }
      console.log (component.calculatorForm.errors);
      expect (component.calculatorForm.valid).toBeTruthy ();
    });

    it ('when sumI and sumIII values is zero, then form is invalid, but when one of them not zero form valid', () => {
      component.sumI.setValue(0);
      component.sumIII.setValue(0);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.sumI.setValue(1);
      expect (component.calculatorForm.valid).toBeTruthy ();
    });

    it ('when r1 - qs1 and r3 - qs3 values is zero, then form is invalid, but when one of sums not zero form valid', () => {
      component.r1.setValue(1);
      component.qs1.setValue(1);
      component.r3.setValue(5);
      component.qs3.setValue(5);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.r1.setValue(2);
      expect (component.calculatorForm.valid).toBeTruthy ();
    });

    it ('sumI input correct validated', () => {
      component.sumI.setValue(21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.sumI.setValue(-21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.sumI.setValue('');
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.sumI.setValue(10);
      expect (component.calculatorForm.valid).toBeTruthy ();
    });

    it ('sumIII input correct validated', () => {
      component.sumIII.setValue(21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.sumIII.setValue(-21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.sumIII.setValue('');
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.sumIII.setValue(10);
      expect (component.calculatorForm.valid).toBeTruthy ();
    });

    it ('r1 input correct validated', () => {
      component.r1.setValue(21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.r1.setValue(-21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.r1.setValue('');
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.r1.setValue(10);
      expect (component.calculatorForm.valid).toBeTruthy ();
    });

    it ('r3 input correct validated', () => {
      component.r3.setValue(21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.r3.setValue(-21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.r3.setValue('');
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.r3.setValue(10);
      expect (component.calculatorForm.valid).toBeTruthy ();
    });

    it ('qs1 input correct validated', () => {
      component.qs1.setValue(21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.qs1.setValue(-21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.qs1.setValue('');
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.qs1.setValue(10);
      expect (component.calculatorForm.valid).toBeTruthy ();
    });

    it ('qs3 input correct validated', () => {
      component.qs3.setValue(21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.qs3.setValue(-21);
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.qs3.setValue('');
      expect (component.calculatorForm.valid).toBeFalsy ();
      component.qs3.setValue(10);
      expect (component.calculatorForm.valid).toBeTruthy ();
    });
  });

  describe ('check methods', () => {
    describe ('ngOnInit', () => {
      it ('should get sessionStorage lastSums and set it as form value', () => {
        sessionStorage.setItem ('lastSums', JSON.stringify(formValue));
        component.ngOnInit ();
        expect (component.calculatorForm.value.sumI).toEqual (formValue.sumI);
        expect (component.calculatorForm.value.sumIII).toEqual (formValue.sumIII);
      });

      it ('reset hidden waves inputs when useSums is true', () => {
        spyOn (component, 'resetWaves');
        component.ngOnInit ();
        expect (component.useSums).toBeTruthy ();
        expect (component.resetWaves).toHaveBeenCalled ();
      });
    });

    describe ('ngOnDestroy', () => {
      it ('should set as lastSums form value to sessionStorage', () => {
        component.ngOnDestroy ();
        expect (component.calculatorForm.value).toEqual (JSON.parse ( sessionStorage.getItem ('lastSums') ));
      });
    });

    describe ('getValue', () => {
      it ('should get angle alfa using sums input when useSums is true', () => {
        expect (component.useSums).toBeTruthy ();
        expect (component.getValue ()).toEqual (120);
      });
    });

    describe ('displayValue', () => {
      it ('should output error when form is invalid', () => {
        component.sumI.setValue(21);
        component.displayValue ();
        expect (component.outputValue).toEqual ('Что-то пошло не так');
      });

      it ('should output error when service return NaN instead number', () => {
        component.sumI.setValue (0);
        component.sumIII.setValue (0);
        component.displayValue ();
        expect (component.outputValue).toEqual ('Что-то пошло не так');
      });

      it ('should output 120 degries when all correct', () => {
        component.sumI.setValue (0);
        component.sumIII.setValue (5);
        component.displayValue ();
        expect (component.outputValue).toEqual ('90°');
      });
    });

    describe ('reset', () => {
      it ('should just call resetSums and resetWaves methods and as result reset all fields', () => {
        spyOn (component, 'resetSums');
        spyOn (component, 'resetWaves');
        component.reset (new MouseEvent ('click'));
        expect (component.resetSums).toHaveBeenCalled ();
        expect (component.resetWaves).toHaveBeenCalled ();
      });
    });

    describe ('resetSums', () => {
      it ('should reset sumI and sumIII fields', () => {
        component.sumI.setValue (15);
        component.sumIII.setValue (15);
        component.resetSums ();
        expect (component.sumI.value).toEqual (axisCalculatorSettings.maxSum.initValue);
        expect (component.sumIII.value).toEqual (axisCalculatorSettings.maxSum.initValue);
      });
    });

    describe ('resetWaves', () => {
      it ('should reset r1, qs1 and r3, qs3 fields', () => {
        component.r1.setValue (15);
        component.qs1.setValue (15);
        component.r3.setValue (15);
        component.qs3.setValue (15);
        component.resetWaves ();
        expect (component.r1.value).toEqual (axisCalculatorSettings.maxWave.initR);
        expect (component.qs1.value).toEqual (axisCalculatorSettings.maxWave.initQS);
        expect (component.r3.value).toEqual (axisCalculatorSettings.maxWave.initR);
        expect (component.qs3.value).toEqual (axisCalculatorSettings.maxWave.initQS);
      });
    });
  });

  describe ('check markup', () => {
    beforeEach (() => {
      element = fixture.debugElement.nativeElement;
      // input = fixture.debugElement.query(By.css('[name="sumI"]')).nativeElement;
      input = element.querySelector ('[name="sumI"]');
      output = fixture.debugElement.query(By.css('#output')).nativeElement;
      // reset = fixture.debugElement.query(By.css('[type="reset"]')).nativeElement
      reset = element.querySelector ('[type="reset"]');
    });

    it ('should on input change rewrite output', () => {
      component.sumI.setValue ('.');
      fixture.detectChanges();
      expect (output.innerHTML).toContain ('Что-то пошло не так');
    });

    it ('should on reset click call reset method', () => {
      spyOn (component, 'reset');
      reset.dispatchEvent (new Event ('click'));
      fixture.detectChanges();
      expect (component.reset).toHaveBeenCalled ();
    });
  });
});