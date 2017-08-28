import { Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { TestBed, async, fakeAsync, tick, ComponentFixture, } from '@angular/core/testing';
import { By } from "@angular/platform-browser";
import { ArrhythmiaSettingsComponent } from './arrhythmia_settings.component';
import { Observable } from 'rxjs';
import { AppState } from "../../services/app_state.service";
import { ArrhythmiaService, arrhythmiaServiceSettings } from "../services/arrhythmia.service";

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
    coefficient: 15,
    difference: 120,
    moreThenOnly: true,
    usePercentage: true,
  };
  let component: ArrhythmiaSettingsComponent;
  let fixture: ComponentFixture<ArrhythmiaSettingsComponent>;
  let service: ArrhythmiaService;
  let appState: AppState;
  let element: HTMLElement,
      message: HTMLOutputElement,
      reset: HTMLButtonElement,
      form: HTMLFormElement,
      usePercentageInput: HTMLInputElement,
      moreThenOnlyInput: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ],
      declarations: [
        ArrhythmiaSettingsComponent,
        MockSettingsField,
      ],
      providers: [
        { provide: ArrhythmiaService, useFactory () {
            let settings: arrhythmiaServiceSettings = {
              coefficient: {
                min: 1,
                max: 100,
                init: 15
              },
              difference: {
                min: 1,
                max: 1000,
                init: 120
              },
              accuracy: {
                min: 0,
                max: 15,
                init: 2
              },
              interval: {
                min: 200,
                max: 3000,
                init: 1000
              },
              rateCoefficient: 60000,
              moreThenOnly: true
            };

            return new ArrhythmiaService (settings);
          }
        },
        AppState,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    sessionStorage.removeItem ('lastArrhythmiaSettings');
    fixture = TestBed.createComponent(ArrhythmiaSettingsComponent);
    component = fixture.componentInstance;
    appState = TestBed.get(AppState);
    service = TestBed.get(ArrhythmiaService);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();

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

    it ('coefficient input correct validated', () => {
      component.coefficient.setValue(0);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.coefficient.setValue(101);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.coefficient.setValue('.');
      expect (component.settingsForm.valid).toBeFalsy ();
      component.coefficient.setValue(undefined);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.coefficient.setValue(2);
      expect (component.settingsForm.valid).toBeTruthy ();
    });

    it ('difference input correct validated', () => {
      component.difference.setValue(0);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.difference.setValue(1001);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.difference.setValue('.');
      expect (component.settingsForm.valid).toBeFalsy ();
      component.difference.setValue(undefined);
      expect (component.settingsForm.valid).toBeFalsy ();
      component.difference.setValue(2);
      expect (component.settingsForm.valid).toBeTruthy ();
    });
  });

  describe ('check methods', () => {
    describe ('ngOnInit', () => {
      it ('should get sessionStorage lastArrhythmiaSettings and set it as form value', () => {
        sessionStorage.setItem ('lastArrhythmiaSettings', JSON.stringify(formValue));
        component.ngOnInit ();
        expect (component.settingsForm.value).toEqual (formValue);
      });

      it ('should call method setSettings when sessionStorage has lastArrhythmiaSettings', () => {
        sessionStorage.setItem ('lastArrhythmiaSettings', JSON.stringify(formValue));
        spyOn (component, 'setSettings');
        component.ngOnInit ();
        expect (component.setSettings).toHaveBeenCalled ();
      });
    });

    describe ('ngOnDestroy', () => {
      it ('should set as lastArrhythmiaSettings form value to sessionStorage', () => {
        component.ngOnDestroy ();
        expect (component.settingsForm.value).toEqual (JSON.parse ( sessionStorage.getItem ('lastArrhythmiaSettings') ));
      });
    });

    describe ('setSettings', () => {
      it ('should set settings to service', () => {
        component.setSettings ();
        expect (service.accuracy).toEqual (component.accuracy.value);
        expect (service.coefficient).toEqual (component.coefficient.value);
        expect (service.difference).toEqual (component.difference.value);
        expect (service.moreThenOnly).toEqual (component.moreThenOnlyField.value);
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
        expect (element.querySelector ('#message').innerHTML).toContain (str);

        setTimeout (() => {
          fixture.detectChanges ();
          expect (element.querySelector ('#message')).toBeNull ();
          done ();
        }, 5000);
      });
    });

    describe ('reset', () => {
      it ('should reset fields on click', () => {
        component.accuracy.setValue (12);
        component.coefficient.setValue (1200);
        component.difference.setValue (1200);
        component.reset (new MouseEvent ('click'));
        fixture.detectChanges ();
        expect (component.accuracy.value).toEqual (service.settings.accuracy.init);
        expect (component.coefficient.value).toEqual (service.settings.coefficient.init);
        expect (component.difference.value).toEqual (service.settings.difference.init);
      });

      it ('should set formChanged to false and hide alert', () => {
        component.accuracy.setValue (12);
        component.coefficient.setValue (1200);
        component.difference.setValue (1200);
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

    describe ('checkFormChanges and formChanged property', () => {
      let otherFormValue: {[s: string]: any};

      beforeEach(() => {
        otherFormValue = {
          accuracy: 4,
          coefficient: 15,
          difference: 120,
          moreThenOnly: true,
          usePercentage: true,
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
      usePercentageInput = fixture.debugElement.query(By.css('[name="use-percentage"]')).nativeElement;
      moreThenOnlyInput = fixture.debugElement.query(By.css('[name="more-then-only"]')).nativeElement;
      form = fixture.debugElement.query(By.css('form')).nativeElement;
      reset = fixture.debugElement.query(By.css('[type="reset"]')).nativeElement;
    });

    it ('should on submit event call onSubmit', fakeAsync (() => {
      spyOn (component, 'onSubmit');

      form.dispatchEvent (new Event ('submit'));
      tick ();

      expect (component.onSubmit).toHaveBeenCalled ();
    }));

    it ('should on click use-percentage checkbox toggle state', fakeAsync (() => {
      expect (component.usePercentage).toBeTruthy ();
      expect (element.querySelectorAll ('.state-alert')[1].innerHTML)
        .toContain ('Расчитывать используя разность в %');

      usePercentageInput.click();
      tick ();
      fixture.detectChanges ();

      expect (usePercentageInput.checked).toBeFalsy ();
      expect (appState.toggle).toHaveBeenCalled ();
    }));

    it ('should on click more-then-only checkbox toggle state', fakeAsync (() => {
      expect (component.moreThenOnly).toBeTruthy ();
      expect (element.querySelectorAll ('.state-alert')[0].innerHTML)
        .toContain ('Расчитывать если результат больше разницы');

      moreThenOnlyInput.click();
      tick ();
      fixture.detectChanges ();

      expect (moreThenOnlyInput.checked).toBeFalsy ();
      expect (service.moreThenOnly).toBeFalsy ();
    }));

    it ('should on click reset button call reset method', fakeAsync (() => {
      spyOn (component, 'reset');

      reset.dispatchEvent (new Event ('click'));
      tick ();

      expect (component.reset).toHaveBeenCalled ();
    }));
  });
});