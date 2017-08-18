import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { BtnMinus } from './btn_minus.component';

describe ('BtnMinus', () => {
  let component: BtnMinus;
  let wrapper: ComponentWrapper;
  let fixture: ComponentFixture<ComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ComponentWrapper, 
        BtnMinus,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentWrapper);
    wrapper = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy();
  });

  it ('decremention on 1 work', () => {
    component.decrement ();
    expect (wrapper.input.value).toEqual(-1);
  });

  it ('decremention while press LMB 1 sec', (done) => {
    component.decrementStart (new MouseEvent('mousedown'));
    setTimeout (() => {
      component.decrementStop (new MouseEvent('mouseup'));
      expect (wrapper.input.value).toBeLessThan (-20);
      done ();
    }, 1000);
  });
});

@Component({
  selector: 'component-wrapper',
  template: '<btn-minus [input]="input"></btn-minus>'
})

class ComponentWrapper {
  input:FormControl = new FormControl();

  constructor () {
    this.input.setValue (0);
  }
}