import { async } from '@angular/core/testing';
import { AxisCalculator, axisCalculatorParams } from './axis_calculator.service';

describe ('AxisCalculator', () => {
  const settings: axisCalculatorParams = {
    accuracy: {
      min: 0,
      max: 15,
      default: 2,
    },

    maxSum: {
      min: 0,
      max: 1000,
      default: {
        min: -20,
        max: 20,
      },
      initValue: 1,
    },

    maxWave: {
      min: 0,
      max: 1000,
      default: {
        min: 0,
        max: 20,
      },
      initR: 1,
      initQS: 0,
    },
  };

  let service: AxisCalculator;

  beforeEach(async(() => {
    service = new AxisCalculator (settings);
  }));

  it ('setting accuracy', () => {
    service.setAccuracy (10);
    expect (service.accuracy).toEqual (10);
  });

  it ('setting maximal sum of amplitudes', () => {
    service.setMaxSum (-15, 15);
    expect (service.maxSum).toEqual ({ min: -15, max: 15});
  });

  it ('setting maximal size of single amplitudes', () => {
    service.setMaxWave (5);
    expect (service.maxWave).toEqual ({ min: 0, max: 5});
  });

  describe ('couning alfa angle using sum of amplitudes', () => {
    it ('counting negative SumI and positive SumIII', () => {
      expect (service.countAngle (-1, 1)).toEqual (150);
    });
    it ('counting positive SumI and negative SumIII', () => {
      expect (service.countAngle (1, -1)).toEqual (-30);
    });
    it ('counting positive SumI and positive SumIII', () => {
      expect (service.countAngle (1, 1)).toEqual (60);
    });
    it ('return Nan when 0 SumI and 0 SumIII', () => {
      expect (service.countAngle (0, 0)).toEqual (NaN);
    });
  });

  it ('accuracy set amount numbers after comma', () => {
    service.setAccuracy (2);
    expect (service.countAngle (1.1, 1)).toEqual (58.43);
    service.setAccuracy (4);
    expect (service.countAngle (1.1, 1)).toEqual (58.4252);
  });

  it ('counting alfa angle using waves', () => {
    expect (service.countSumsThenAngle (6, -4, 3, -3)).toEqual(30);
  });
});