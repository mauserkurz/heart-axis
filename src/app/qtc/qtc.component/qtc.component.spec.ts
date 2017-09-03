// angular
import { Directive, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { TestBed, async, ComponentFixture, tick, fakeAsync, } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// services and helpers
import { QTcService, qtcServiceSettings, Range } from '../services/qtc.service';
// components
import { QTcComponent } from './qtc.component';

@Directive({
  selector: 'sum-field'
})
class MockSumField {
  @Input('input') public input: FormControl;
  @Input('step') public step: number;
  @Input('maximum') public maximum: number;
  @Input('minimum') public minimum: number;
  @Input('data') public data: {[s: string]: string};
}

describe ('QTcComponent', () => {
  const formValue: {[s:string]: any} = {
        rr: 750,
        qt: 380,
        isMale: true,
      };
  let settings: qtcServiceSettings;
  let component: QTcComponent;
  let service: QTcService;
  let fixture: ComponentFixture<QTcComponent>;
  let element: HTMLElement, output: HTMLOutputElement, reset: Element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, BrowserAnimationsModule, ],
      declarations: [
        QTcComponent,
        MockSumField,
      ],
      providers: [
        { provide: QTcService, useFactory () {
            settings = {
              accuracy: {
                min: 0,
                max: 10,
                init: 0
              },
              interval: {
                min: 200,
                max: 2000,
                initQT: 400,
                initRR: 750
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
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    sessionStorage.removeItem ('lastQTc');
    fixture = TestBed.createComponent(QTcComponent);
    component = fixture.componentInstance;
    service = TestBed.get(QTcService);
    fixture.detectChanges();

    // spy on QTcService service
    spyOn(service, 'getByBazett').and.returnValue(440);
    spyOn(service, 'getByFredericia').and.returnValue(440);
    spyOn(service, 'getByHodges').and.returnValue(440);
    spyOn(service, 'getByFramingham').and.returnValue(440);
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });

  describe ('check validation', () => {
    describe('fields validation', () => {
      it ('rr input correct validated', () => {
        component.rr.setValue(undefined);
        expect (component.qtcForm.valid).toBeFalsy ();
        component.rr.setValue(2001);
        expect (component.qtcForm.valid).toBeFalsy ();
        component.rr.setValue(199);
        expect (component.qtcForm.valid).toBeFalsy ();
        component.rr.setValue('.');
        expect (component.qtcForm.valid).toBeFalsy ();
        component.rr.setValue(1000);
        expect (component.qtcForm.valid).toBeTruthy ();
      });
      it ('qt input correct validated', () => {
        component.qt.setValue(undefined);
        expect (component.qtcForm.valid).toBeFalsy ();
        component.qt.setValue(2001);
        expect (component.qtcForm.valid).toBeFalsy ();
        component.qt.setValue(199);
        expect (component.qtcForm.valid).toBeFalsy ();
        component.qt.setValue('.');
        expect (component.qtcForm.valid).toBeFalsy ();
        component.qt.setValue(400);
        expect (component.qtcForm.valid).toBeTruthy ();
      });
    });
  });

  describe ('check methods', () => {
    describe('classifyQTc', () => {
      it ('should set empty object to compareResult - clearing them', () => {
        component.classifyQTc ('clear');

        expect(component.compareResult).toEqual({});
      });
      it ('should set object which describe closest maximum to compareResult property', () => {
        component.rr.setValue (1000);
        component.qt.setValue (400);
        component.isMaleField.setValue (true);
        component.classifyQTc ();
        fixture.detectChanges();

        expect(component.compareResult).toEqual({
          bazett: { min: 431, max: 450, name: "Пограничное", colorClass: "warning" },
          framingham: { min: 431, max: 450, name: "Пограничное", colorClass: "warning" },
          fredericia: { min: 431, max: 450, name: "Пограничное", colorClass: "warning" },
          hodges: { min: 431, max: 450, name: "Пограничное", colorClass: "warning" }
        });
      });
    });
    describe ('displayValue', () => {
      it ('should output error when form is invalid', () => {
        component.rr.setValue(2001);
        component.displayValue ();
        expect (component.outputBazett).toEqual ('ERROR');
        expect (component.outputFredericia).toEqual ('ERROR');
        expect (component.outputFramingham).toEqual ('ERROR');
        expect (component.outputHodges).toEqual ('ERROR');
      });

      it ('should output 440 when all correct', () => {
        component.rr.setValue (1000);
        component.qt.setValue (400);
        component.displayValue ();
        expect (component.outputBazett).toEqual ('440');
        expect (component.outputFredericia).toEqual ('440');
        expect (component.outputFramingham).toEqual ('440');
        expect (component.outputHodges).toEqual ('440');
      });

      it ('should call classifyQTc method', () => {
        spyOn(component, 'classifyQTc');
        component.rr.setValue (1000);
        component.qt.setValue (400);
        component.displayValue ();

        expect (component.classifyQTc).toHaveBeenCalled ();
      });
    });

    describe ('ngOnInit', () => {
      it ('should get sessionStorage lastQTc and set it as form value', () => {
        sessionStorage.setItem ('lastQTc', JSON.stringify(formValue));
        spyOn (component, 'displayValue');
        component.ngOnInit ();
        expect (component.qtcForm.value.rr).toEqual (formValue['rr']);
        expect (component.qtcForm.value.qt).toEqual (formValue['qt']);
        expect (component.qtcForm.value.isMale).toEqual (formValue['isMale']);
      });

      it ('ngOnInit call displayValue method', () => {
        spyOn (component, 'displayValue');
        component.ngOnInit ();
        expect (component.displayValue).toHaveBeenCalled ();
      });
    });

    describe ('ngOnDestroy', () => {
      it ('should set form value to sessionStorage as lastQTc', () => {
        component.ngOnDestroy ();
        expect (component.qtcForm.value).toEqual (JSON.parse ( sessionStorage.getItem ('lastQTc') ));
      });
    });

    describe ('reset', () => {
      it ('should reset rr, qt and isMaleField fields', () => {
        component.rr.setValue (800);
        component.qt.setValue (430);
        component.isMaleField.setValue (false);
        component.reset ();
        expect (component.rr.value).toEqual (service.settings.interval.initRR);
        expect (component.qt.value).toEqual (service.settings.interval.initQT);
        expect (component.isMaleField.value).toEqual (service.settings.isMale);
      });
    });
  });
  describe ('check markup', () => {
    beforeEach (() => {
      element = fixture.debugElement.nativeElement;
      output = fixture.debugElement.query(By.css('.form-result .alert strong')).nativeElement;
      reset = element.querySelector ('[type="reset"]');
    });

    it ('should on valid form 4 results of range comparison are showed', () => {
      component.rr.setValue (1000);
      component.qt.setValue (440);
      component.isMaleField.setValue (true);
      fixture.detectChanges();
      expect (element.querySelectorAll ('.warning').length).toEqual (4);
    });

    it ('should on invalid form all results of range comparison removed', () => {
      component.rr.setValue ('.');
      fixture.detectChanges();
      expect (element.querySelectorAll ('.warning').length).toEqual (0);
    });

    it ('should on input change rewrite output', () => {
      component.rr.setValue ('.');
      fixture.detectChanges();
      expect (output.innerHTML).toContain ('ERROR');
    });

    it ('should on click is-male checkbox toggle isMale property and show it', fakeAsync (() => {
      let input: HTMLInputElement = fixture.debugElement.query(By.css('[name="is-male"]')).nativeElement;

      expect (element.querySelector ('.state-alert').innerHTML).toContain ('Выбран мужской пол');

      input.click();
      tick ();
      fixture.detectChanges ();

      expect (!input.checked).toBeTruthy ();
      expect (element.querySelector ('.state-alert').innerHTML).toContain ('Выбран женский пол');
    }));

    it ('should on reset click call reset method', () => {
      spyOn (component, 'reset');
      reset.dispatchEvent (new Event ('click'));
      fixture.detectChanges();
      expect (component.reset).toHaveBeenCalled ();
    });
  });
});