import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'btn-plus',
  templateUrl: './btn_plus.component.html'
})

export class BtnPlus {
  @Input() input: FormControl;
  @Input() step: number;
  private _loop: any = null;
  private _delayBeforeLoop: any = null;

  constructor () {}

  increment (): void {
    this.input.patchValue (this.input.value + this.step);
  }

  incrementStart (event: MouseEvent): void {
    event.preventDefault ();

    this.increment ();

    if (this._delayBeforeLoop) {
      clearTimeout (this._delayBeforeLoop);
    }

    if (this._loop) {
      clearInterval (this._loop);
    }

    this._delayBeforeLoop = setTimeout (() => {
      this._loop = setInterval (() => {
        this.increment ();
      }, 25);

    }, 250);
  }

  incrementStop (event: MouseEvent): void {
    event.preventDefault ();

    if (this._delayBeforeLoop) {
      clearTimeout (this._delayBeforeLoop);
    }

    if (this._loop) {
      clearInterval (this._loop);
    }
  }
}