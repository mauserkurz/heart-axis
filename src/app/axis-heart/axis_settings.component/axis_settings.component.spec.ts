// angular
import { Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { By } from '@angular/platform-browser';
import { TestBed, async, fakeAsync, tick, ComponentFixture, } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// services and helpers
import { AppState } from "../../services/app_state.service";
import { AxisCalculator, axisCalculatorParams } from "../services/axis_calculator.service";
// components
import { AxisSettingsComponent } from './axis_settings.component';

@Directive({
  selector: 'settings-field'
})
class MockSettingsField {
  @Input('input') public input: FormControl;
  @Input('step') public step: number;
  @Input('maximum') public maximum: number;
  @Input('minimum') public minimum: number;
  @Input('value') public value: number;
  @Input('data') public data: {[s: string]: string};
}

describe ('AxisSettingsComponent', () => {
  const formValue: {[s: string]: any} = {
    accuracy: 2,
    maxSum: 20,
    maxWave: 20,
    useSums: false
  };
  let component: AxisSettingsComponent;
  let fixture: ComponentFixture<AxisSettingsComponent>;
  let axisCalculatorSettings: axisCalculatorParams;
  let appState: AppState;
  let axisCalculator: AxisCalculator;
  let element: HTMLElement, message: HTMLOutputElement, reset: HTMLButtonElement, form: HTMLFormElement, input: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, BrowserAnimationsModule ],
      declarations: [
        AxisSettingsComponent,
        MockSettingsField,
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
            };

            return new AxisCalculator (axisCalculatorSettings);
          }
        },
        AppState,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    sessionStorage.removeItem ('lastSettings');
    fixture = TestBed.createComponent(AxisSettingsComponent);
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
    spyOn(appState, 'toggle').and.returnValue(appState);
    spyOn(appState, 'getValue').and.returnValue({ use: true });
    spyOn(appState, 'getStream').and.returnValue(Observable.of({ use: true }));
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });

  describe ('check validation', () => {
    it ('default value of inputs is valid', () => {
      expect (component.settingsForm.valid).toBeTruthy ();
    });

    it ('accuracy input correct validated', () => {
      component.accuracy.setValue(-1);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.accuracy.setValue(16);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.accuracy.setValue('.');
      expect (component.settingsForm.valid).toBeFalsy ();
      component.accuracy.setValue(undefined);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.accuracy.setValue(2);
      expect (component.settingsForm.valid).toBeTruthy ();
    });

    it ('maxSum input correct validated', () => {
      component.maxSum.setValue(-1);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.maxSum.setValue(1001);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.maxSum.setValue('.');
      expect (component.settingsForm.valid).toBeFalsy ();
      component.maxSum.setValue(undefined);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.maxSum.setValue(2);
      expect (component.settingsForm.valid).toBeTruthy ();
    });

    it ('maxWave input correct validated', () => {
      component.maxWave.setValue(-1);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.maxWave.setValue(1001);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.maxWave.setValue('.');
      expect (component.settingsForm.valid).toBeFalsy ();
      component.maxWave.setValue(undefined);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.maxWave.setValue(2);
      expect (component.settingsForm.valid).toBeTruthy ();
    });
  });

  describe ('check methods', () => {
    describe ('ngOnInit', () => {
      it ('should get sessionStorage lastSettings and set it as form value', () => {
        sessionStorage.setItem ('lastSettings', JSON.stringify(formValue));
        component.ngOnInit ();
        expect (component.settingsForm.value).toEqual (formValue);
      });

      it ('should call method setSettings when sessionStorage has lastSettings', () => {
        sessionStorage.setItem ('lastSettings', JSON.stringify(formValue));
        spyOn (component, 'setSettings');
        component.ngOnInit ();
        expect (component.setSettings).toHaveBeenCalled ();
      });
    });

    describe ('ngOnDestroy', () => {
      it ('should set as lastSettings form value to sessionStorage', () => {
        component.ngOnDestroy ();
        expect (component.settingsForm.value).toEqual (JSON.parse ( sessionStorage.getItem ('lastSettings') ));
      });
    });

    describe ('setSettings', () => {
      it ('should set settings to axisCalculatorModel', () => {
        component.setSettings ();
        expect (axisCalculator.setAccuracy).toHaveBeenCalled ();
        expect (axisCalculator.setMaxSum).toHaveBeenCalled ();
        expect (axisCalculator.setMaxWave).toHaveBeenCalled ();
      });
    });

    describe ('showResult', () => {
      let originalTimeout: number;

      beforeEach(function() {
          originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
          jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      });

      afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      });

      it ('should show message and after delay message removing', (done) => {
        const str: string = 'message';

        component.showResult (str);
        fixture.detectChanges ();

        element = fixture.debugElement.nativeElement;
        expect (element.querySelector ('.form-message').innerHTML).toContain (str);

        setTimeout (() => {
          fixture.detectChanges ();
          expect (element.querySelector ('.form-message')).toBeNull ();
          done ();
        }, 5000);
      });
    });

    describe ('reset', () => {
      it ('should reset fields on click', () => {
        component.accuracy.setValue (12);
        component.maxSum.setValue (12);
        component.maxWave.setValue (12);
        component.reset (new MouseEvent ('click'));
        fixture.detectChanges ();
        expect (component.accuracy.value).toEqual (axisCalculatorSettings.accuracy.default);
        expect (component.maxSum.value).toEqual (axisCalculatorSettings.maxSum.default.max);
        expect (component.maxWave.value).toEqual (axisCalculatorSettings.maxWave.default.max);
      });

      it ('should set formChanged to false and hide alert', () => {
        component.accuracy.setValue (12);
        component.maxSum.setValue (12);
        component.maxWave.setValue (12);
        component.reset (new MouseEvent ('click'));
        fixture.detectChanges ();
        expect (component.formChanged).toBeFalsy ();
        expect (element.querySelector ('.form-alert')).toBeNull();
      });

      it ('should on click call toggle of own state, setSettings and showResult', () => {
        spyOn (component, 'setSettings');
        spyOn (component, 'showResult');
        component.reset (new MouseEvent ('click'));
        expect (appState.toggle).toHaveBeenCalled ();
        expect (component.setSettings).toHaveBeenCalled ();
        expect (component.showResult).toHaveBeenCalled ();
      });
    });

    describe ('onSubmit', () => {
      it ('should call setSettings and showResult when form is valid', () => {
        spyOn (component, 'setSettings');
        spyOn (component, 'showResult');
        component.onSubmit (component.settingsForm.value);
        element = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect (component.settingsForm.valid).toBeTruthy ();
        expect (component.formChanged).toBeFalsy ();
        expect (element.querySelector ('.form-alert')).toBeNull();
        expect (component.setSettings).toHaveBeenCalled ();
        expect (component.showResult).toHaveBeenCalled ();
      });
    });

    describe ('changeInputs', () => {
      it ('should call method toggle of own state property', () => {
        component.changeInputs (true);
        expect (appState.toggle).toHaveBeenCalled ();
      });
    });

    describe ('checkFormChanges and formChanged property', () => {
      let otherFormValue: {[s: string]: any};

      beforeEach(() => {
        otherFormValue = {
          accuracy: 1,
          maxSum: 20,
          maxWave: 20,
          useSums: true
        };
        element = fixture.debugElement.nativeElement;
      });
      it ('should return true when values different', () => {
        expect (component.checkFormChanges (otherFormValue)).toBeTruthy();
        component.formChanged = true;
        fixture.detectChanges();
        expect (element.querySelector ('.form-alert').innerHTML).toContain('не сохранено');
      });
      it ('should return false when values equal', () => {
        expect (component.checkFormChanges (formValue)).toBeFalsy();
        fixture.detectChanges();
        expect (element.querySelector ('.form-alert')).toBeNull();
      });
    });
  });

  describe ('check markup', () => {
    beforeEach (() => {
      element = fixture.debugElement.nativeElement;
      input = fixture.debugElement.query(By.css('[name="use-sums"]')).nativeElement;
      form = fixture.debugElement.query(By.css('form')).nativeElement;
      reset = fixture.debugElement.query(By.css('[type="reset"]')).nativeElement;
    });

    it ('should on submit event call onSubmit', fakeAsync (() => {
      spyOn (component, 'onSubmit');

      form.dispatchEvent (new Event ('submit'));
      tick ();

      expect (component.onSubmit).toHaveBeenCalled ();
    }));

    it ('should on click use-sums checkbox toggle state', fakeAsync (() => {
      spyOn (component, 'changeInputs');
      expect (component.useSums).toBeTruthy ();
      expect (element.querySelector ('.use-sums-state').innerHTML).toContain ('Расчитывать используя суммы амплитуд QRS');

      input.click();
      tick ();
      fixture.detectChanges ();

      expect (input.checked).toBeTruthy ();
      expect (component.changeInputs).toHaveBeenCalled ();
    }));

    it ('should on click reset button call reset method', fakeAsync (() => {
      spyOn (component, 'reset');

      reset.dispatchEvent (new Event ('click'));
      tick ();

      expect (component.reset).toHaveBeenCalled ();
    }));
  });
});