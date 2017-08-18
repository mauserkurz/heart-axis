import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'btn-minus',
  templateUrl: './btn_minus.component.html'
})

export class BtnMinus {
  @Input() input: FormControl;
  private _loop: any = null;
  private _delayBeforeLoop: any = null;

  constructor () {}

  decrement (): void {
    this.input.patchValue (this.input.value - 1);
  }

  decrementStart (event: MouseEvent): void {
    event.preventDefault ();

    this.decrement ();

    if (this._delayBeforeLoop) {
      clearTimeout (this._delayBeforeLoop);
    }

    if (this._loop) {
      clearInterval (this._loop);
    }

    this._delayBeforeLoop = setTimeout (() => {
      this._loop = setInterval (() => {
        this.decrement ();
      }, 25);

    }, 250);
  }

  decrementStop (event: MouseEvent): void {
    event.preventDefault ();

    if (this._delayBeforeLoop) {
      clearTimeout (this._delayBeforeLoop);
    }

    if (this._loop) {
      clearInterval (this._loop);
    }
  }
}