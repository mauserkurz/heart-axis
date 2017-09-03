import { Injectable } from '@angular/core';

export interface axisCalculatorParams {
  accuracy: {
    min: number,
    max: number,
    default: number,
  },

  maxSum: {
    min: number,
    max: number,
    default: {
      min: number,
      max: number,
    },
    initValue: number,
  },

  maxWave: {
    min: number,
    max: number,
    default: {
      min: number,
      max: number,
    },
    initR: number,
    initQS: number;
  },
}

@Injectable ()
export class AxisCalculator {
  readonly settings: axisCalculatorParams;

  accuracy: number;
  maxSum: {
    min: number,
    max: number,
  };
  maxWave: {
    min: number,
    max: number,
  };

  constructor ( settings: axisCalculatorParams ) {
    this.settings = settings;
    this.accuracy = settings.accuracy.default;
    this.maxSum = settings.maxSum.default;
    this.maxWave = settings.maxWave.default;
  }

  setAccuracy (accuracy: number): AxisCalculator {
    this.accuracy = accuracy;
    return this;
  }

  setMaxSum (min: number, max: number): AxisCalculator {
    this.maxSum = {
      min,
      max
    };
    return this;
  }

  setMaxWave (max: number): AxisCalculator {
    this.maxWave = {
      min: this.maxWave.min,
      max
    };
    return this;
  }

  countAngle (sumI: number, sumIII: number): number {
    let tanAlfa: number = ((sumIII / sumI) - Math.cos (120 * Math.PI / 180)) / Math.sin (120 * Math.PI / 180);
    let alfa: number = Math.atan (tanAlfa) * 180 / Math.PI;

    if (sumI < 0) {
      alfa = alfa + 180;
    }

    return Number (alfa.toFixed(this.accuracy));
  }

  countSumsThenAngle (rI: number, qsI: number, rIII: number, qsIII: number) {
    let sumI: number = rI + qsI;
    let sumIII: number = rIII + qsIII;

    return this.countAngle (sumI, sumIII);
  }
}