import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { Observable } from "rxjs/Observable";
import { FaqComponent } from './faq.component';
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";
import { AppState } from "../../services/app_state.service";

class ActivatedRouteMock {
  parent: any;
  snapshot: object;

  constructor (options) {
    this.parent = {
      url: Observable.of( options.url )
    };
    this.snapshot = {
      _lastPathIndex: 1,
    };
  }
}

describe ('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ FaqComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteMock (
            {
              url: [
                { path: 'heart-axis' }
              ]
            }
          )
        },
        AppState
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it ('component exist', () => {
    expect (component).toBeTruthy ();
  });

  it ('should get data and calculatorType from state', () => {
    expect (component.data).toBeDefined();
    expect (component.calculatorType).toBeDefined();
  });
});