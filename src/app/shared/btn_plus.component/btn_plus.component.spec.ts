import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { BtnPlus } from './btn_plus.component';

describe ('BtnPlus', () => {
  let component: BtnPlus;
  let wrapper: ComponentWrapper;
  let fixture: ComponentFixture<ComponentWrapper>;
  let element: HTMLElement;

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
    element = fixture.debugElement.children[0].nativeElement;
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy();
  });

  it ('plus 1', () => {
    component.increment ();
    expect (wrapper.input.value).toEqual(1);
    expect (element.innerHTML).toContain ('+');
  });

  it ('minus 1', () => {
    wrapper.step = -1;
    fixture.detectChanges();
    component.increment ();
    expect (wrapper.input.value).toEqual(-1);
    expect (element.innerHTML).toContain ('-');
  });

  it ('adding while press LMB 1 sec', (done) => {
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
  template: '<btn-plus [input]="input" [step]="step"></btn-plus>'
})

class ComponentWrapper {
  input:FormControl = new FormControl();
  step: number = 1;

  constructor () {
    this.input.setValue (0);
  }
}