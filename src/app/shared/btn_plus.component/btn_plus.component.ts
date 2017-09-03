// angular
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

    this._delayBeforeLoop = setTimeout (() => {
      this._loop = setInterval (() => {
        this.increment ();
      }, 25);

    }, 250);
  }

  incrementStop (event: MouseEvent): void {
    event.preventDefault ();

    clearTimeout (this._delayBeforeLoop);
    clearInterval (this._loop);
  }
}