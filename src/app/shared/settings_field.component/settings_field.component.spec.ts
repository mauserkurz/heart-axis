import { Component, CUSTOM_ELEMENTS_SCHEMA, Directive, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { SettingsFieldComponent } from './settings_field.component';
import { verifyNum, checkMinimum, checkMaximum } from "../../helpers/validators";
import { AxisCalculator, axisCalculatorParams } from "../../axis-heart/services/axis_calculator.service";

@Directive ({
  selector: 'btn-plus'
})
class MockBtnPlus {
  @Input ('input') public input: FormControl;
  @Input ('step') public step: number;
}

const valueMax: number = 20;
const valueMin: number = -20;

describe ('SumFieldComponent', () => {
  let axisCalculatorSettings: axisCalculatorParams;
  let axisCalculator: AxisCalculator;
  let component: SettingsFieldComponent;
  let wrapper: ComponentWrapper;
  let fixture: ComponentFixture<ComponentWrapper>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ],
      declarations: [
        ComponentWrapper,
        SettingsFieldComponent,
        MockBtnPlus
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentWrapper);
    wrapper = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    element = fixture.debugElement.nativeElement;
    axisCalculator = TestBed.get(AxisCalculator);
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });
  describe ('input show correct validation errors', () => {
    it ('return error when value less then minimum', () => {
      component.input.setValue(21);
      fixture.detectChanges();
      expect (element.querySelector ('.input-error').innerHTML).toContain (`Введите ${ valueMax } или меньше`);
    });
    it ('return error when value bigger then maximum', () => {
      component.input.setValue(-21);
      fixture.detectChanges();
      expect (element.querySelector ('.input-error').innerHTML).toContain (`Введите ${ valueMin } или больше`);
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
      component.input.setValue(4);
      fixture.detectChanges();
      expect (element.querySelector ('.input-error')).toBeNull ();
    });
  });
});

@Component({
  selector: 'component-wrapper',
  template: `
    <settings-field
      [input]="value"
      [value]="axisCalculatorModel.accuracy"
      [step]="1"
      [maximum]="valueMax"
      [minimum]="valueMin"
      [data]="{
        'name': 'value',
        'title': 'Точность - количество знаков после запятой.',
        'output': 'Точность - '
      }">
    </settings-field>`
})

class ComponentWrapper {
  value: FormControl = new FormControl();
  valueMax: number = valueMax;
  valueMin: number = valueMin;

  constructor ( public axisCalculatorModel: AxisCalculator ) {
    this.value
      .setValidators(Validators.compose(
        [
          Validators.required,
          verifyNum,
          checkMinimum (valueMin),
          checkMaximum (valueMax)
        ]
      ));
    this.value.setValue (2);
  }
}