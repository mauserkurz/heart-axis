// angular
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// components
import { FAQListComponent } from './faq_list.component';

describe ('FAQListComponent', () => {
  let component: FAQListComponent;
  let fixture: ComponentFixture<FAQListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, BrowserAnimationsModule, ],
      declarations: [ FAQListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FAQListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });
});