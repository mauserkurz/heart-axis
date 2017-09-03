// angular
import { Location } from '@angular/common';
import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
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
          { path: 'faq', component: FaqComponentMock },
          { path: 'heart-axis', component: FaqComponentMock }
        ]),
        BrowserAnimationsModule,
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

  it ('testUrls method check url matches with any value of matchUrls property', () => {
    expect (component.testUrls ('/faq')).toBeFalsy ();
    expect (component.testUrls ('/heart-axis')).toBeTruthy ();
  });

  it('should go to faq and wrapperIsActive is false', async(() => {
    router.navigate(['/faq']).then(() => {
      expect(location.path()).toBe('/faq');
      expect (component.wrapperIsActive).toBeFalsy ();
    });
  }));

  it('should go to calculator wrapper and wrapperIsActive is true', async(() => {
    router.navigate(['/heart-axis']).then(() => {
      expect(location.path()).toBe('/heart-axis');
      expect (component.wrapperIsActive).toBeTruthy ();
    });
  }));
});