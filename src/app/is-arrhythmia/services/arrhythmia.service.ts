import { Injectable } from '@angular/core';

export interface arrhythmiaServiceSettings {
  coefficient: {
    min: number,
    max: number,
    init: number
  },
  difference: {
    min: number,
    max: number,
    init: number
  },
  accuracy: {
    min: number,
    max: number,
    init: number
  },
  interval: {
    min: number,
    max: number,
    init: number
  }
  moreThenOnly: boolean
}

@Injectable ()
export class ArrhythmiaService {
  settings: arrhythmiaServiceSettings;
  coefficient: number;
  difference: number;
  accuracy: number;
  moreThenOnly: boolean;

  constructor (data: arrhythmiaServiceSettings) {
    this.settings = data;
    this.coefficient = this.settings.coefficient.init;
    this.difference = this.settings.difference.init;
    this.accuracy = this.settings.accuracy.init;
    this.moreThenOnly = this.settings.moreThenOnly;
  }

  countProportion (pp1: number, pp2: number): number {
    let maxPP: number = pp1 >= pp2 ? pp1 : pp2;
    let minPP: number = pp1 < pp2 ? pp1 : pp2;
    let delta: number = (maxPP - minPP) / minPP * 100;

    return Number (delta.toFixed(this.accuracy));
  }

  countDifferenceTime (pp1: number, pp2: number): number {
    let maxPP: number = pp1 >= pp2 ? pp1 : pp2;
    let minPP: number = pp1 < pp2 ? pp1 : pp2;
    let delta: number = maxPP - minPP;

    return Number (delta.toFixed(this.accuracy));
  }

  isArrhythmia (delta: number, baseDelta: number): boolean {
    let result: boolean;

    if (this.moreThenOnly) {
      result = delta > baseDelta
    } else {
      result = delta >= baseDelta
    }

    return result;
  }
}