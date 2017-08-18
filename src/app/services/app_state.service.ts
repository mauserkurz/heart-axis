import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface isUsed {
  [type: string]: boolean,
}

@Injectable ()
export class AppState {
  private useSums: BehaviorSubject <isUsed> = new BehaviorSubject <isUsed>(null);

  constructor () {
    this.useSums.next ({ useSums: true });
  }

  toggleSums (direction?: boolean): AppState {
    let value: isUsed;
    if (typeof direction !== 'undefined') {
      value = {
        useSums: direction,
      };
    } else {
      value = {
        useSums: !this.useSumsCurrent ().useSums,
      };
    }
    this.useSums.next (value);
    return this;
  }

  useSumsCurrent (): isUsed {
    return this.useSums.getValue ();
  }

  useSumsStream (): Observable<isUsed> {
    return this.useSums.asObservable ();
  }
}