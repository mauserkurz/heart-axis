// angular
import { Component, HostBinding, Input, ViewEncapsulation, } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
// services
import { fadeIn } from "./services/animations";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: [
   './app.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeIn
  ],
  host: { '[@fadeIn]': '' }
})

export class AppComponent {
  wrapperIsActive: boolean = false;
  matchUrls: string[] = ['/heart-axis', '/is-arrhythmia', '/qtc', ];
  @HostBinding('class.container') container: boolean = true;

  constructor (public router: Router) {
    router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((event: NavigationStart) => {
        this.wrapperIsActive = this.testUrls(event.url);
      });
    sessionStorage.clear();
  }

  testUrls (url: string): boolean {
    return this.matchUrls.some (value => url.indexOf(value) > -1);
  }
}