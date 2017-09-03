import { QTcService, Range, qtcServiceSettings, borderArrayItem, viewArrayItem } from "./qtc.service";

describe('Range', () => {
  const newDataArray: borderArrayItem[] = [
        {
          border: 300,
          name: 'Норма',
          colorClass: 'info',
        },
        {
          border: 350,
          name: 'Пограничное',
          colorClass: 'warning',
        },
      ];
  const initialViewArray: viewArrayItem[] = [
        {
          min: 100,
          max: 430,
          name: 'Норма',
          colorClass: 'info',
        },
        {
          min: 431,
          max: 450,
          name: 'Пограничное',
          colorClass: 'warning',
        },
        {
          min: 451,
          max: 1000,
          name: 'Удлинение',
          colorClass: 'danger',
        },
      ];
  const expectedNewViewArray: viewArrayItem[] = [
        {
          min: 100,
          max: 300,
          name: 'Норма',
          colorClass: 'info',
        },
        {
          min: 301,
          max: 350,
          name: 'Пограничное',
          colorClass: 'warning',
        },
        {
          min: 351,
          max: 1000,
          name: 'Удлинение',
          colorClass: 'danger',
        },
      ];
  let range: Range;

  beforeEach(() => {
    range = new Range (
      [
        {
          border: 430,
          name: 'Норма',
          colorClass: 'info',
        },
        {
          border: 450,
          name: 'Пограничное',
          colorClass: 'warning',
        },
      ],
      100,
      1000,
      'Удлинение',
      'danger',
      0
    );
  });

  describe('updateAccuracy method', () => {
    it ('should set accuracy property', () => {
      range.updateAccuracy(2);
      expect(range.accuracy).toEqual(2);
    });

    it ('should rewrite currentViewArray', () => {
      range.updateAccuracy(2);
      expect(range.currentViewArray[1].min).toEqual(430.01);
    });
  });

  describe('setValue method', () => {
    beforeEach(() => {
      range.setValue(newDataArray);
    });

    it ('setValue should set accepted array to currentDataObserver as value', () => {
      expect(range.currentDataObserver.value).toEqual(newDataArray);
    });

    it ('setValue should create view array and set viewArrayObserver as value', () => {
      expect(range.currentViewArray).toEqual(expectedNewViewArray);
    });
  });

  describe('resetValue method', () => {
    beforeEach(() => {
      range.setValue(newDataArray);
      range.resetValue();
    });

    it ('setValue should set initial array from init property to currentDataObserver as value', () => {
      expect(range.currentDataObserver.value).toEqual(range.init);
    });

    it ('setValue should create view array using init property, then set viewArrayObserver as value', () => {
      expect(range.currentViewArray).toEqual(initialViewArray);
    });
  });

  describe('addItem method', () => {
    beforeEach(() => {
      range.addItem(
        {
          border: 440,
          name: 'foo',
          colorClass: 'bar',
        }
      );
    });

    it ('addItem should add item object to currentDataObserver data array', () => {
      expect(range.currentDataObserver.value).toEqual([
        {
          border: 430,
          name: 'Норма',
          colorClass: 'info',
        },
        {
          border: 440,
          name: 'foo',
          colorClass: 'bar',
        },
        {
          border: 450,
          name: 'Пограничное',
          colorClass: 'warning',
        },
      ]);
    });

    it ('addItem should then generate viewArrayObserver data with new borders', () => {
      expect(range.currentViewArray).toEqual([
        {
          min: 100,
          max: 430,
          name: 'Норма',
          colorClass: 'info',
        },
        {
          min: 431,
          max: 440,
          name: 'foo',
          colorClass: 'bar',
        },
        {
          min: 441,
          max: 450,
          name: 'Пограничное',
          colorClass: 'warning',
        },
        {
          min: 451,
          max: 1000,
          name: 'Удлинение',
          colorClass: 'danger',
        },
      ]);
    });
  });

  describe('removeItem method', () => {
    beforeEach(() => {
      range.removeItem (1);
    });

    it ('removeItem should remove item object from currentDataObserver data array', () => {
      expect(range.currentDataObserver.value).toEqual([
        {
          border: 430,
          name: 'Норма',
          colorClass: 'info',
        },
      ]);
    });

    it ('removeItem should then generate viewArrayObserver data with new borders', () => {
      expect(range.currentViewArray).toEqual([
        {
          min: 100,
          max: 430,
          name: 'Норма',
          colorClass: 'info',
        },
        {
          min: 431,
          max: 1000,
          name: 'Удлинение',
          colorClass: 'danger',
        },
      ]);
    });
  });

  it ('compareValue should compare given value and return object which describe closest min and max borders', () => {
    expect(range.compareValue(440)).toEqual({
      min: 431,
      max: 450,
      name: "Пограничное",
      colorClass: "warning",
    });
  });
});

describe('QTcService', () => {
  const settings: qtcServiceSettings = {
    accuracy: {
      min: 0,
      max: 10,
      init: 0
    },
    interval: {
      min: 100,
      max: 1000,
      initQT: 400,
      initRR: 750,
    },
    isMale: true,
    ranges: {
      male: new Range(
        [
          {
            border: 430,
            name: 'Норма',
            colorClass: 'info',
          },
          {
            border: 450,
            name: 'Пограничное',
            colorClass: 'warning',
          },
        ],
        100,
        1000,
        'Удлинение',
        'danger',
        0
      ),
      female: new Range(
        [
          {
            border: 450,
            name: 'Норма',
            colorClass: 'info',
          },
          {
            border: 470,
            name: 'Пограничное',
            colorClass: 'warning',
          },
        ],
        100,
        1000,
        'Удлинение',
        'danger',
        0
      ),
    },
  };

  let service: QTcService;

  beforeEach(() => {
    service = new QTcService (settings);
  });

  it ('getByBazett method should count QTc Bazett`s formula', () => {
    expect(service.getByBazett (400, 750)).toEqual(462);
  });

  it ('getByFredericia method should count QTc Fredericia`s formula', () => {
    expect(service.getByFredericia (400, 750)).toEqual(440);
  });

  it ('getByFramingham method should count QTc Framingham`s formula', () => {
    expect(service.getByFramingham (400, 750)).toEqual(439);
  });

  it ('getByHodges method should count QTc Hodges`s formula', () => {
    expect(service.getByHodges (400, 750)).toEqual(435);
  });
});