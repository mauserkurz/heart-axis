// angular
import { Directive, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// services and helpers
import { ArrhythmiaService, arrhythmiaServiceSettings } from '../services/arrhythmia.service';
import { AppState } from "../../services/app_state.service";
// components
import { ArrhythmiaComponent } from './arrhythmia.component';

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

describe ('ArrhythmiaComponent', () => {
  const formValue: {[s:string]: number} = {
        pp1: 1000,
        pp2: 1000
      };
  let settings: arrhythmiaServiceSettings;
  let component: ArrhythmiaComponent;
  let service: ArrhythmiaService;
  let fixture: ComponentFixture<ArrhythmiaComponent>;
  let element: HTMLElement, output: HTMLOutputElement, reset: Element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, BrowserAnimationsModule, ],
      declarations: [
        ArrhythmiaComponent,
        MockSumField,
      ],
      providers: [
        { provide: ArrhythmiaService, useFactory () {
            settings = {
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
        AppState
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    sessionStorage.removeItem ('lastSums');
    fixture = TestBed.createComponent(ArrhythmiaComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ArrhythmiaService);
    fixture.detectChanges();

    // spy on ArrhythmiaService service
    spyOn(service, 'countProportion').and.returnValue(20);
    spyOn(service, 'countDifferenceTime').and.returnValue(200);
    spyOn(service, 'isArrhythmia').and.callFake((delta: number, baseDelta: number): boolean => {
      return delta > baseDelta;
    });
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });

  describe ('check validation', () => {
    describe('fields validation', () => {
      it ('pp1 input correct validated', () => {
        component.pp1.setValue(undefined);
        expect (component.arrhythmiaForm.valid).toBeFalsy ();
        component.pp1.setValue(3001);
        expect (component.arrhythmiaForm.valid).toBeFalsy ();
        component.pp1.setValue(199);
        expect (component.arrhythmiaForm.valid).toBeFalsy ();
        component.pp1.setValue('.');
        expect (component.arrhythmiaForm.valid).toBeFalsy ();
        component.pp1.setValue(1000);
        expect (component.arrhythmiaForm.valid).toBeTruthy ();
      });
      it ('pp2 input correct validated', () => {
        component.pp2.setValue(undefined);
        expect (component.arrhythmiaForm.valid).toBeFalsy ();
        component.pp2.setValue(3001);
        expect (component.arrhythmiaForm.valid).toBeFalsy ();
        component.pp2.setValue(199);
        expect (component.arrhythmiaForm.valid).toBeFalsy ();
        component.pp2.setValue('.');
        expect (component.arrhythmiaForm.valid).toBeFalsy ();
        component.pp2.setValue(1000);
        expect (component.arrhythmiaForm.valid).toBeTruthy ();
      });
    });
  });

  describe ('check methods', () => {
    describe ('getValue', () => {
      it ('should get difference between intervals in % when usePercentage property is true', () => {
        component.usePercentage = true;
        component.pp1.setValue (1200);
        component.pp2.setValue (1000);
        expect (component.getValue ()).toEqual (20);
        it ('should set isArrhythmia property to true, when intervals difference greater then coefficient', () => {
          expect (component.isArrhythmia).toBeTruthy ();
        });
        it ('should set isArrhythmia property to false, when intervals difference less then coefficient', () => {
          component.pp1.setValue (1000);
          expect (component.isArrhythmia).toBeFalsy ();
        });
      });

      it ('should get difference between intervals in milliseconds when usePercentage property is false', () => {
        component.usePercentage = false;
        component.pp1.setValue (1200);
        component.pp2.setValue (1000);
        expect (component.getValue ()).toEqual (200);
        it ('should set isArrhythmia property to true, when intervals difference greater then coefficient', () => {
          expect (component.isArrhythmia).toBeTruthy ();
        });
        it ('should set isArrhythmia property to false, when intervals difference less then coefficient', () => {
          component.pp1.setValue (1000);
          expect (component.isArrhythmia).toBeFalsy ();
        });
      });
    });

    describe('getHeartRate', () => {
      it ('should call getHeartRate method of service', () => {
        spyOn (service, 'getHeartRate');
        component.getHeartRate();
        expect (service.getHeartRate).toHaveBeenCalled ();
      });
    });

    describe ('displayValue', () => {
      it ('should output error when form is invalid', () => {
        component.pp1.setValue(3001);
        component.displayValue ();
        expect (component.output).toEqual ('ERROR');
      });

      it ('should output 20 % when all correct', () => {
        component.pp1.setValue (1200);
        component.pp2.setValue (1000);
        component.displayValue ();
        expect (component.output).toEqual ('20 %');
      });

      it ('should call getHeartRate method of component', () => {
        spyOn (component, 'getHeartRate');
        component.displayValue();
        expect (component.getHeartRate).toHaveBeenCalled ();
      });
    });

    describe ('ngOnInit', () => {
      it ('should get sessionStorage lastPP and set it as form value', () => {
        sessionStorage.setItem ('lastPP', JSON.stringify(formValue));
        spyOn (component, 'displayValue');
        component.ngOnInit ();
        expect (component.arrhythmiaForm.value.pp1).toEqual (formValue['pp1']);
        expect (component.arrhythmiaForm.value.pp2).toEqual (formValue['pp2']);
      });

      it ('ngOnInit call displayValue method', () => {
        spyOn (component, 'displayValue');
        component.ngOnInit ();
        expect (component.displayValue).toHaveBeenCalled ();
      });
    });

    describe ('ngOnDestroy', () => {
      it ('should set form value to sessionStorage as lastPP', () => {
        component.ngOnDestroy ();
        expect (component.arrhythmiaForm.value).toEqual (JSON.parse ( sessionStorage.getItem ('lastPP') ));
      });
    });

    describe ('reset', () => {
      it ('should reset pp1 and pp2 fields', () => {
        component.pp1.setValue (1200);
        component.pp2.setValue (1500);
        component.reset ();
        expect (component.pp1.value).toEqual (service.settings.interval.init);
        expect (component.pp2.value).toEqual (service.settings.interval.init);
      });
    });
  });
  describe ('check markup', () => {
    beforeEach (() => {
      element = fixture.debugElement.nativeElement;
      output = fixture.debugElement.query(By.css('.form-result strong')).nativeElement;
      reset = element.querySelector ('[type="reset"]');
    });

    it ('should on input change rewrite output', () => {
      component.pp1.setValue ('.');
      fixture.detectChanges();
      expect (output.innerHTML).toContain ('ERROR');
    });

    it ('should on reset click call reset method', () => {
      spyOn (component, 'reset');
      reset.dispatchEvent (new Event ('click'));
      fixture.detectChanges();
      expect (component.reset).toHaveBeenCalled ();
    });

    it ('should show arrhythmia sign when isArrhythmia property is true and form is valid', () => {
      component.pp1.setValue (800);
      component.isArrhythmia = true;
      fixture.detectChanges();
      expect (component.arrhythmiaForm.valid).toBeTruthy ();
      expect (element.querySelector ('.form-alert').innerHTML).toContain ('Аритмия - по данным значениям интервалов PP');
    });

    it ('should no arrhythmia sign when isArrhythmia property is false', () => {
      component.isArrhythmia = false;
      fixture.detectChanges();
      expect (element.querySelector ('.form-alert')).toBeNull ();
    });
  });
});