import { ArrhythmiaService, arrhythmiaServiceSettings } from './arrhythmia.service';

describe ('ArrhythmiaService', () => {
  const settings: arrhythmiaServiceSettings = {
    coefficient: {
      min: 1,
      max: 100,
      init: 15
    },
    difference: {
      min: 1,
      max: 1000,
      init: 120
    },
    accuracy: {
      min: 0,
      max: 15,
      init: 2
    },
    interval: {
      min: 200,
      max: 3000,
      init: 1000
    },
    moreThenOnly: true
  };

  let service: ArrhythmiaService;

  beforeEach(() => {
    service = new ArrhythmiaService (settings);
  });

  it ('should count difference between pp1 and pp2 intervals in %', () => {
    expect (service.countProportion (1000, 1200)).toEqual(20);
  });

  it ('should count difference between pp1 and pp2 intervals in milliseconds', () => {
    expect (service.countDifferenceTime (1000, 1200)).toEqual(200);
  });

  describe ('isArrhythmia method', () => {
    it ('should return false when delta less then reference value', () => {
      expect (service.isArrhythmia (100, 120)).toBeFalsy();
    });

    it ('should return true when delta greater then reference value', () => {
      expect (service.isArrhythmia (150, 120)).toBeTruthy();
    });

    it ('should return false when delta equal reference value and moreThenOnly property is true', () => {
      expect (service.isArrhythmia (120, 120)).toBeFalsy();
    });

    it ('should return true when delta equal reference value and moreThenOnly property is false', () => {
      service.moreThenOnly = false;
      expect (service.isArrhythmia (120, 120)).toBeTruthy();
    });
  });
});