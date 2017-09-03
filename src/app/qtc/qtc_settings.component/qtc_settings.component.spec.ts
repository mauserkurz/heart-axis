// angular
import { Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { TestBed, async, fakeAsync, tick, ComponentFixture, } from '@angular/core/testing';
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// services and helpers
import { QTcService, qtcServiceSettings, Range } from "../services/qtc.service";
import { checkMaximum, checkMinimum, noSuchBorders } from "../../helpers/validators";
// components
import { QTcSettingsComponent } from './qtc_settings.component';

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

describe ('QTcSettingsComponent', () => {
  const formValue: {[s: string]: any} = {
    accuracy: 0,
  };
  let component: QTcSettingsComponent;
  let fixture: ComponentFixture<QTcSettingsComponent>;
  let service: QTcService;
  let element: HTMLElement,
      message: HTMLOutputElement,
      reset: HTMLButtonElement,
      form: HTMLFormElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, BrowserAnimationsModule, ],
      declarations: [
        QTcSettingsComponent,
        MockSettingsField,
      ],
      providers: [
        { provide: QTcService, useFactory () {
            let settings: qtcServiceSettings = {
              accuracy: {
                min: 0,
                max: 10,
                init: 0
              },
              interval: {
                min: 100,
                max: 1000,
                initQT: 400,
                initRR: 750,
              },
              isMale: true,
              ranges: {
                male: new Range(
                  [
                    {
                      border: 430,
                      name: 'Норма',
                      colorClass: 'info',
                    },
                    {
                      border: 450,
                      name: 'Пограничное',
                      colorClass: 'warning',
                    },
                  ],
                  100,
                  1000,
                  'Удлинение',
                  'danger',
                  0
                ),
                female: new Range(
                  [
                    {
                      border: 450,
                      name: 'Норма',
                      colorClass: 'info',
                    },
                    {
                      border: 470,
                      name: 'Пограничное',
                      colorClass: 'warning',
                    },
                  ],
                  100,
                  1000,
                  'Удлинение',
                  'danger',
                  0
                ),
              },
            };

            return new QTcService (settings);
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    sessionStorage.removeItem ('lastQTcSettings');
    fixture = TestBed.createComponent(QTcSettingsComponent);
    component = fixture.componentInstance;
    service = TestBed.get(QTcService);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });

  describe ('check validation settings form', () => {
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
  });

  describe ('check validation range form', () => {
    it ('default value of inputs is valid', () => {
      expect (component.rangeForm.valid).toBeTruthy ();
    });

    it ('name input correct validated', () => {
      component.name.setValue(undefined);
      expect (component.rangeForm.valid).toBeFalsy ();
      component.name.setValue('Граница');
      expect (component.rangeForm.valid).toBeTruthy ();
    });

    it ('border input correct validated', () => {
      component.updateSex('male');
      component.border.setValue(430);
      expect (component.rangeForm.valid).toBeFalsy ();
      component.border.setValue('');
      expect (component.rangeForm.valid).toBeFalsy ();
      component.border.setValue(300);
      expect (component.rangeForm.valid).toBeTruthy ();
    });
  });

  describe ('check methods', () => {
    describe ('ngOnInit', () => {
      it ('should get sessionStorage lastQTcSettings and set it as form value', () => {
        sessionStorage.setItem ('lastQTcSettings', JSON.stringify(formValue));
        component.ngOnInit ();
        expect (component.settingsForm.value).toEqual (formValue);
      });

      it ('should call method setSettings when sessionStorage has lastQTcSettings', () => {
        sessionStorage.setItem ('lastQTcSettings', JSON.stringify(formValue));
        spyOn (component, 'setSettings');
        component.ngOnInit ();
        expect (component.setSettings).toHaveBeenCalled ();
      });
    });

    describe ('ngOnDestroy', () => {
      it ('should set as lastQTcSettings form value to sessionStorage', () => {
        component.ngOnDestroy ();
        expect (component.settingsForm.value).toEqual (JSON.parse ( sessionStorage.getItem ('lastQTcSettings') ));
      });
    });

    describe ('setSettings', () => {
      it ('should set settings to service', () => {
        component.setSettings ();
        expect (service.accuracy).toEqual (component.accuracy.value);
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
      it ('should reset fields settings form on click', () => {
        component.accuracy.setValue (12);
        component.reset (new MouseEvent ('click'));
        fixture.detectChanges ();
        expect (component.accuracy.value).toEqual (service.settings.accuracy.init);
      });

      it ('should reset fields range form on click', () => {
        component.rangeForm.setValue ({ name: 'Заданная граница', border: 400, colorClass: 'alert-info' });
        component.reset (new MouseEvent ('click'));
        fixture.detectChanges ();
        expect (component.rangeForm.value).toEqual ({ name: 'Новая граница', border: 300, colorClass: 'alert-info' });
      });

      it ('should reset ranges to initial state', () => {
        spyOn(component.service.settings.ranges['male'], 'resetValue');
        spyOn(component.service.settings.ranges['female'], 'resetValue');
        component.reset (new MouseEvent ('click'));
        fixture.detectChanges ();
        expect (component.service.settings.ranges['male'].resetValue).toHaveBeenCalled ();
        expect (component.service.settings.ranges['female'].resetValue).toHaveBeenCalled ();
      });

      it ('should set formChanged to false and hide alert', () => {
        component.accuracy.setValue (12);
        component.reset (new MouseEvent ('click'));
        fixture.detectChanges ();
        expect (component.formChanged).toBeFalsy ();
        expect (element.querySelector ('.form-alert')).toBeNull();
      });

      it ('should on click call setSettings and showResult', () => {
        spyOn (component, 'setSettings');
        spyOn (component, 'showResult');
        component.reset (new MouseEvent ('click'));
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
        expect (component.setSettings).toHaveBeenCalled ();
        expect (component.showResult).toHaveBeenCalled ();
      });

      it ('should call when form is valid hide alert because formChanged now false', () => {
        component.onSubmit (component.settingsForm.value);
        element = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect (component.settingsForm.valid).toBeTruthy ();
        expect (component.formChanged).toBeFalsy ();
        expect (element.querySelector ('.form-alert')).toBeNull();
      });
    });

    describe ('checkFormChanges and formChanged property', () => {
      let otherFormValue: {[s: string]: any};

      beforeEach(() => {
        otherFormValue = {
          accuracy: 4,
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

    describe('addItem', () => {
      it ('should add range form value to certain range object', () => {
        let rangeFormValue: any = { name: 'Новая граница', border: 300, colorClass: 'alert-info' };
        component.addItem(rangeFormValue);

        expect(component.selectedSex).toEqual('male');
        expect(component.service.settings.ranges['male']
            .currentDataObserver.value.some(value => rangeFormValue.border === value.border )).toBeTruthy();
      });

      it ('should do nothing when form is invalid', () => {
        let rangeFormValue: any = { name: '', border: 400, colorClass: 'alert-info' };
        component.border.setValue(undefined);
        fixture.detectChanges();

        component.addItem(rangeFormValue);

        expect (component.rangeForm.valid).toBeFalsy();
        expect(component.service.settings.ranges['male']
            .currentDataObserver.value.some(value => rangeFormValue.border === value.border )).toBeFalsy();
      });
    });

    describe('reInitBorderValidation', () => {
      it ('should update validators of border control', () => {
        component.reInitBorderValidation ('male');

        component.border.setValue (undefined);
        expect(component.border.valid).toBeFalsy();
        component.border.setValue (0);
        expect(component.border.valid).toBeFalsy();
        component.border.setValue (5000);
        expect(component.border.valid).toBeFalsy();
        component.border.setValue (430);
        expect(component.border.valid).toBeFalsy();
        component.border.setValue (300);
        expect(component.border.valid).toBeTruthy();
      });

      it ('should check validity of border control', () => {
        spyOn(component.border, 'updateValueAndValidity');
        component.reInitBorderValidation ('male');

        expect(component.border.updateValueAndValidity).toHaveBeenCalled ();
      });
    });

    describe('updateSex', () => {
      it ('should change selectedSex property', () => {
        expect(component.selectedSex).toEqual('male');
        component.updateSex('female');

        expect(component.selectedSex).toEqual('female');
      });

      it ('should call reInitBorderValidation method', () => {
        spyOn(component, 'reInitBorderValidation');
        component.updateSex('female');

        expect(component.reInitBorderValidation).toHaveBeenCalled ();
      })
    });

    describe('removeRangeItem', () => {
      it ('should call removeItem method of range object', () => {
        spyOn(component.service.settings.ranges['male'], 'removeItem');
        component.removeRangeItem ('male', 1);

        expect(component.service.settings.ranges['male'].removeItem).toHaveBeenCalledWith (1);
      });
    });
  });

  describe ('check markup', () => {
    beforeEach (() => {
      element = fixture.debugElement.nativeElement;
      form = fixture.debugElement.query(By.css('.count-form')).nativeElement;
      reset = fixture.debugElement.query(By.css('[type="reset"]')).nativeElement;
    });

    it ('should on submit event call onSubmit', fakeAsync (() => {
      spyOn (component, 'onSubmit');

      form.dispatchEvent (new Event ('submit'));
      fixture.detectChanges();
      tick ();

      expect (component.onSubmit).toHaveBeenCalled ();
    }));

    it ('should on click reset button call reset method', fakeAsync (() => {
      spyOn (component, 'reset');

      reset.dispatchEvent (new Event ('click'));
      fixture.detectChanges();
      tick ();

      expect (component.reset).toHaveBeenCalled ();
    }));

    it ('should on submit range form call addItem and add new item to borders', fakeAsync (() => {
      component.rangeForm.setValue({ name: 'Новая граница', border: 300, colorClass: 'alert-info' });
      expect(component.selectedSex).toEqual('male');
      expect(component.rangeForm.valid).toBeTruthy();

      element.querySelector('.range-form').dispatchEvent(new Event('submit'));
      tick ();
      fixture.detectChanges();

      expect (element.querySelectorAll('#male .border-view')[0]
        .querySelector('.badge-info').innerHTML).toEqual('300 мсек.');
    }));

    it ('should on click link #male-tab call updateSex', fakeAsync (() => {
      spyOn (component, 'updateSex');
      element.querySelector('#male-tab').dispatchEvent(new Event('click'));
      tick ();

      expect (component.updateSex).toHaveBeenCalled ();
    }));

    it ('should on click link #female-tab call updateSex', fakeAsync (() => {
      spyOn (component, 'updateSex');
      element.querySelector('#female-tab').dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick ();

      expect (component.updateSex).toHaveBeenCalled ();
    }));

    it ('should on click call removeRangeItem and delete certain border-view', fakeAsync (() => {
      let borderView: Element = element.querySelectorAll('#male .border-view')[0];
      let border: string = borderView.querySelector('.badge-info').innerHTML;
      spyOn (component, 'removeRangeItem');

      borderView.querySelector('button').dispatchEvent(new Event('click'));
      fixture.detectChanges();
      tick ();

      expect (element.querySelectorAll('#male .border-view')[0]
        .querySelector('.badge-info').innerHTML !== border).toBeFalsy();
      expect (component.removeRangeItem).toHaveBeenCalled ();
    }));
  });
});