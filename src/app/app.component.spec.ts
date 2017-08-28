import { Location } from '@angular/common';
import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
// components
import { AppComponent } from './app.component';

@Component ({
  selector: 'faq',
  template: ''
})
class FaqComponentMock {}

describe ('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'faq', component: FaqComponentMock }
        ]),
      ],
      declarations: [
        AppComponent,
        FaqComponentMock
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([Router, Location], (_router: Router, _location: Location) => {
    location = _location;
    router = _router;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });

  it('should go to faq', async(() => {
    router.navigate(['/faq']).then(() => {
      expect(location.path()).toBe('/faq');
    });
  }));
});