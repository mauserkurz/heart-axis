import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { BtnPlus } from './btn_plus.component';

describe ('BtnPlus', () => {
  let component: BtnPlus;
  let wrapper: ComponentWrapper;
  let fixture: ComponentFixture<ComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ComponentWrapper, 
        BtnPlus,
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

  it ('incremention on 1 work', () => {
    component.increment ();
    expect (wrapper.input.value).toEqual(1);
  });

  it ('incremention while press LMB 1 sec', (done) => {
    component.incrementStart (new MouseEvent('mousedown'));
    setTimeout (() => {
      component.incrementStop (new MouseEvent('mouseup'));
      expect (wrapper.input.value).toBeGreaterThan (20);
      done ();
    }, 1000);
  });
});

@Component({
  selector: 'component-wrapper',
  template: '<btn-plus [input]="input"></btn-plus>'
})

class ComponentWrapper {
  input:FormControl = new FormControl();

  constructor () {
    this.input.setValue (0);
  }
}