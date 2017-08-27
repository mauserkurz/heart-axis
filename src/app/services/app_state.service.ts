import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface isUsed {
  [type: string]: boolean,
}

@Injectable ()
export class AppState {
  private useSums: BehaviorSubject <isUsed> = new BehaviorSubject <isUsed>(null);
  private usePercentage: BehaviorSubject <isUsed> = new BehaviorSubject <isUsed>(null);
  private calcWrapperData: BehaviorSubject <object> = new BehaviorSubject <object>(null);
  private faqData: BehaviorSubject <object> = new BehaviorSubject <object>(null);

  constructor () {
    this.usePercentage.next ({ use: true });
    this.useSums.next ({ use: true });
    this.calcWrapperData.next ({
      'heart-axis': { title: 'Расчет электрической оси сердца.' },
      'is-arrhythmia': { title: 'Расчет соотношения интервалов PP' }
    });
    this.faqData.next ({
      'heart-axis': { data: 'heart-axis FAQ' },
      'is-arrhythmia': { data: 'is-arrhythmia FAQ' }
    });
  }

  toggle (data: string, direction?: boolean): AppState {
    let value: isUsed;
    if (typeof direction !== 'undefined') {
      value = {
        use: direction,
      };
    } else {
      value = {
        use: !this.getValue (data).use,
      };
    }
    this[data].next (value);
    return this;
  }

  getValue (data: string): isUsed {
    return this[data].getValue ();
  }

  getStream (data: string): Observable<isUsed> {
    return this[data].asObservable ();
  }

  getDataStream (data: string): Observable<object> {
    return this[data].asObservable ();
  }
}