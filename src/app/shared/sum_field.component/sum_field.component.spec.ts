// angular
import { Component, CUSTOM_ELEMENTS_SCHEMA, Directive, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
// services and helpers
import { verifyNum, checkMinimum, checkMaximum } from "../../helpers/validators";
// components
import { SumFieldComponent } from './sum_field.component';
import { JqHelper } from "../../helpers/jqHelper";

@Directive ({
  selector: 'btn-plus'
})
class MockBtnPlus {
  @Input ('input') public input: FormControl;
  @Input ('step') public step: number;
}

const sumMax: number = 20;
const sumMin: number = -20;

describe ('SumFieldComponent', () => {
  let component: SumFieldComponent;
  let wrapper: ComponentWrapper;
  let fixture: ComponentFixture<ComponentWrapper>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ],
      declarations: [
        ComponentWrapper,
        SumFieldComponent,
        MockBtnPlus
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentWrapper);
    wrapper = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });
  describe ('input show correct validation errors', () => {
    it ('return error when value less then minimum', () => {
      component.input.setValue(21);
      fixture.detectChanges();
      expect (element.querySelector ('.input-error').innerHTML).toContain (`Введите ${ sumMax } или меньше`);
    });
    it ('return error when value bigger then maximum', () => {
      component.input.setValue(-21);
      fixture.detectChanges();
      expect (element.querySelector ('.input-error').innerHTML).toContain (`Введите ${ sumMin } или больше`);
    });
    it ('return error when value is not a number', () => {
      component.input.setValue('.');
      fixture.detectChanges();
      expect (element.querySelector ('.input-error').innerHTML).toContain (`Введите число`);
    });
    it ('return error when value is empty', () => {
      component.input.setValue(undefined);
      fixture.detectChanges();
      expect (element.querySelector ('.input-error').innerHTML).toContain (`Поле не заполено`);
    });
    it ('no errors when value is correct', () => {
      component.input.setValue(10);
      fixture.detectChanges();
      expect (element.querySelector ('.input-error')).toBeNull ();
    });
  });
  describe('check methods', () => {
    it('on initialization start popover of Popper.js', () => {
      spyOn (JqHelper, 'popoverStart');
      component.ngAfterViewInit();
      expect (JqHelper.popoverStart).toHaveBeenCalled ();
    });
    it('on destruction hide popover of Popper.js', () => {
      spyOn (JqHelper, 'popoverHide');
      component.ngOnDestroy();
      expect (JqHelper.popoverHide).toHaveBeenCalled ();
    });
  });
});

@Component({
  selector: 'component-wrapper',
  template: `
    <sum-field
      [input]="sum"
      [step]="step"
      [maximum]="sumMax"
      [minimum]="sumMin"
      [data]="{'name':'sumI', 'title': 'Вектор QRS I', 'popover':'Алгебраическая сумма зубцов QRS I отведения.'}">
    </sum-field>`
})

class ComponentWrapper {
  sum: FormControl = new FormControl();
  step: number = 1;
  sumMax: number = sumMax;
  sumMin: number = sumMin;

  constructor () {
    this.sum
      .setValidators(Validators.compose(
        [
          Validators.required,
          verifyNum,
          checkMinimum (sumMin),
          checkMaximum (sumMax)
        ]
      ));
    this.sum.setValue (1);
  }
}
