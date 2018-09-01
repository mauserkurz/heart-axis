import { Component, ElementRef, HostBinding, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class.container-fluid') container: boolean = true;
  @HostBinding('class.p-0') padding: boolean = true;
  @ViewChild('dropDownLink') dropDownLink: ElementRef;
  @ViewChild('dropDownMenu') dropDownMenu: ElementRef;
  @ViewChild('mobileMenuButton') mobileMenuButton: ElementRef;
  @ViewChild('mobileMenuList') mobileMenuList: ElementRef;
  @ViewChild('mobileMenu') mobileMenu: ElementRef;
  private _mobileMenuAnimated: boolean = false;

  async toggleMenu(): Promise<void> {
    const nextState = !this._getAreaExpanded(this.mobileMenuButton);

    if ( this._mobileMenuAnimated ) {
      return;
    }
    this._mobileMenuAnimated = true;
    this._setAreaExpanded(this.mobileMenuButton, nextState);
    if ( nextState ) {
      await this._toggleMenuHeight(nextState);
      this._toggleClass(this.mobileMenu, 'show', nextState);
    } else {
      this._toggleClass(this.mobileMenu, 'show', nextState);
      await this._toggleMenuHeight(nextState);
    }
    this._mobileMenuAnimated = false;
  }

  closeDropDown(): void {
    this._setDropDown(false);
  }

  toggleDropDown(): void {
    this._setDropDown(!this._getAreaExpanded(this.dropDownLink));
  }

  private async _toggleMenuHeight(state: boolean): Promise<void> {
    const height = '120px';// TODO fetch from mobileMenuList

    this._toggleClass(this.mobileMenu, 'collapse', false);
    this._toggleClass(this.mobileMenu, 'collapsing', true);
    this.mobileMenu.nativeElement.style.height = state ? '0' : height;// TODO angular animation
    await new Promise(_ => setTimeout(_, 0));// TODO replace with nextTick analogue
    this.mobileMenu.nativeElement.style.height = state ? height : '0';
    await new Promise(_ => setTimeout(_, 350));// TODO replace setTimeout with transitionend event
    this.mobileMenu.nativeElement.style.height = '';
    this._toggleClass(this.mobileMenu, 'collapsing', false);
    this._toggleClass(this.mobileMenu, 'collapse', true);
  }

  private _setDropDown(nextState: boolean): void {
    this._setAreaExpanded(this.dropDownLink, nextState);
    this._toggleClass(this.dropDownMenu, 'show', nextState);
  }

  private _getAreaExpanded(elem: ElementRef): boolean {
    return elem.nativeElement.getAttribute('aria-expanded') === 'true';
  }

  private _setAreaExpanded(elem: ElementRef, state: boolean): void {
    elem.nativeElement.setAttribute('aria-expanded', state.toString() );// TODO replace with component property
  }

  private _toggleClass(elem: ElementRef, className: String, toContain: boolean ): void {
    const classList = elem.nativeElement.classList;

    toContain ? classList.add(className) : classList.remove(className);
  }
}
