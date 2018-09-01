import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  // TODO replace to test utils
  // event creator in case ie11 use document.createEvent in other ways use Event constructor
  const createEvent = name => {
    let event = null;

    if(typeof(Event) === 'function') {
      event = new Event(name);
    } else {
      event = document.createEvent('Event');
      event.initEvent(name, true, true);
    }

    return event;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  describe('rendering =>', () => {
    it('should create the app', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;

      expect(app).toBeTruthy();
    }));

    describe('should render footer link', () => {
      it(`should have footer link with href as 'mailto:mauserkurz98@gmail.com'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const compiled = fixture.debugElement.nativeElement;

        expect(compiled.querySelector('.footer__content a').getAttribute('href')).toEqual('mailto:mauserkurz98@gmail.com');
      }));

      it('should render footer link with text - Mauserkurz', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const compiled = fixture.debugElement.nativeElement;

        expect(compiled.querySelector('.footer__content a').textContent).toContain('Mauserkurz');
      }));
    });
  });

  describe('methods =>', () => {
    describe('toggleDropDown should open/close drop-down', () => {
      it('should after click on drop-down link change area expended accordingly', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const compiled = fixture.debugElement.nativeElement;
        const dropDown = compiled.querySelector('.dropdown');
        const link = dropDown.querySelector('.dropdown-toggle');

        // initial state is close drop-down
        expect(link.getAttribute('aria-expanded')).toBe('false');
        // then on first click open drop-down
        dropDown.click();
        fixture.detectChanges();
        expect(link.getAttribute('aria-expanded')).toBe('true');
        // after second click close drop-down
        dropDown.click();
        fixture.detectChanges();
        expect(link.getAttribute('aria-expanded')).toBe('false');
      }));

      it('should after click on drop-down link add class show for opening drop-down menu', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const compiled = fixture.debugElement.nativeElement;
        const dropDown = compiled.querySelector('.dropdown');
        const dropDownMenu = dropDown.querySelector('.dropdown-menu');

        // initial state is close drop-down
        expect(dropDownMenu.classList.contains('show')).toBeFalsy();
        // then on first click open drop-down
        dropDown.click();
        fixture.detectChanges();
        expect(dropDownMenu.classList.contains('show')).toBeTruthy();
        // after second click close drop-down
        dropDown.click();
        fixture.detectChanges();
        expect(dropDownMenu.classList.contains('show')).toBeFalsy();
      }));
    });

    describe('closeDropDown should close drop-down', () => {
      it('should after click outside of drop-down set aria-expanded as false', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const compiled = fixture.debugElement.nativeElement;
        const dropDown = compiled.querySelector('.dropdown');
        const link = dropDown.querySelector('.dropdown-toggle');
        const dropDownMenu = dropDown.querySelector('.dropdown-menu');

        // open drop-down before test
        link.setAttribute('aria-expanded', 'true');
        dropDownMenu.classList.add('show');
        // after click outside click close drop-down
        // clickOutside event of ng-click-outside directive
        dropDown.dispatchEvent(createEvent('clickOutside'));
        fixture.detectChanges();
        expect(link.getAttribute('aria-expanded')).toBe('false');
      }));

      it('should after click outside of drop-down close menu by removing class show', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const compiled = fixture.debugElement.nativeElement;
        const dropDown = compiled.querySelector('.dropdown');
        const link = dropDown.querySelector('.dropdown-toggle');
        const dropDownMenu = dropDown.querySelector('.dropdown-menu');

        // open drop-down before test
        link.setAttribute('aria-expanded', 'true');
        dropDownMenu.classList.add('show');
        // after click outside close drop-down
        // clickOutside event of ng-click-outside directive
        dropDown.dispatchEvent(createEvent('clickOutside'));
        fixture.detectChanges();
        expect(dropDownMenu.classList.contains('show')).toBeFalsy();
        // after second click outside drop-down steel cosed
        dropDown.dispatchEvent(createEvent('clickOutside'));
        expect(dropDownMenu.classList.contains('show')).toBeFalsy();
      }));
    });

    describe('toggleMenu should open/close mobile menu', () => {
      it('after click on hamburger button should toggle menu close class', fakeAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const compiled = fixture.debugElement.nativeElement;
        const menu = compiled.querySelector('.navbar-collapse');
        const hamburger = compiled.querySelector('.navbar-toggler');

        // initial state when menu closed
        expect(menu.classList.contains('show')).toBeFalsy();
        // add show for opening mobile menu after click
        hamburger.click();
        fixture.detectChanges();
        tick(400);
        expect(menu.classList.contains('show')).toBeTruthy(); // TODO opening animation test
        // remove show for closing mobile menu after second click
        hamburger.click();
        fixture.detectChanges();
        tick(400);
        expect(menu.classList.contains('show')).toBeFalsy(); // TODO closing animation test
      }));
    });
  });
});
