// angular
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// components
import { IndexComponent } from './index.component';

describe ('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      declarations: [ IndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });
});