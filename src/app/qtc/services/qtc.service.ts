import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

export interface qtcServiceSettings {
  accuracy: {
    min: number,
    max: number,
    init: number
  },
  interval: {
    min: number,
    max: number,
    initQT: number,
    initRR: number
  },
  isMale: boolean,
  ranges: {
    [key: string]: Range;
  }
}

export interface borderArrayItem {
  border: number,
  name: string,
  colorClass: string,
}
export interface viewArrayItem {
  min: number,
  max: number,
  name: string,
  colorClass: string,
}

export class Range {
  currentDataObserver: BehaviorSubject <any>;
  viewArrayObserver: Observable <any>;
  currentViewArray: viewArrayItem[];

  constructor (
    public init: borderArrayItem[],
    public min: number,
    public max: number,
    public maxName: string,
    public maxClass: string,
    public accuracy: number
  ) {
    this.currentDataObserver = new BehaviorSubject (this.init.slice(0));
    this.viewArrayObserver = this.currentDataObserver
      .map (this.addMinAndMax(this.min, this.max, this.maxName, this.maxClass))
      .map (this.createViewArray(this));

    this.viewArrayObserver.subscribe(value => this.currentViewArray = value);
  }

  private addMinAndMax (
    min: number,
    max: number,
    maxName: string,
    colorClass: string
  ): (value: borderArrayItem[])=>borderArrayItem[] {
    return (value) => {
      let currentValue = [...value];

      let minItem: borderArrayItem = {
        border: min,
        name: 'min',
        colorClass: '',
      };
      let maxItem: borderArrayItem = {
        border: max,
        name: maxName,
        colorClass: colorClass,
      };

      currentValue.unshift (minItem);
      currentValue.push (maxItem);

      return currentValue;
    }
  }

  private createViewArray (
    that: Range
  ): (value: borderArrayItem[]) => viewArrayItem[] {
    return (value) => {
      let result = value.map ((value: borderArrayItem, index: number, array: borderArrayItem[]): viewArrayItem => {
        let min: number;
        let max: number = value.border;

        if (index === 0) {
          min = 0;
        }
        else if (index === 1) {
          min = array[index-1].border;
        }
        else {
          min = array[index-1].border + Math.pow(10, -1 * that.accuracy);
        }

        return {
          min: min,
          max: max,
          name: value.name,
          colorClass: value.colorClass,
        };
      });
      result.splice(0, 1);

      return result;
    }
  }

  updateAccuracy (accuracy: number): Range {
    this.accuracy = accuracy;
    this.currentDataObserver.next (this.currentDataObserver.value);

    return this;
  }

  setValue (data: borderArrayItem[]): Range {
    this.currentDataObserver.next (data);

    return this;
  }

  resetValue (): Range {
    this.currentDataObserver.next (this.init.slice(0));

    return this;
  }

  addItem (item: borderArrayItem): Range {
    let result: borderArrayItem[] = this.currentDataObserver.value.slice(0);

    result.push (item);
    result.sort ((prev: borderArrayItem, next: borderArrayItem): number => {
      return prev.border - next.border;
    });
    this.currentDataObserver.next (result);

    return this;
  }

  removeItem (index: number): Range {
    let clearedArray = this.currentDataObserver.value.slice(0);

    clearedArray.splice (index, 1);
    this.currentDataObserver.next (clearedArray);

    return this;
  }

  compareValue (value: number): viewArrayItem | undefined {
    let result: viewArrayItem;

    this.currentViewArray
      .forEach ((elem: viewArrayItem, index: number, array: viewArrayItem[]): void => {
        if ( value >= elem.min && value <= elem.max ) {
          result = elem;
        }
      });
    return result;
  }
}

export class QTcService {
  settings: qtcServiceSettings;
  accuracy: number;

  constructor (data: qtcServiceSettings) {
    this.settings = data;
    this.accuracy = this.settings.accuracy.init;
  }

  getByBazett (qt: number, rr: number): number {
    let result = this.msecToSec (qt) / Math.pow(this.msecToSec (rr), 1/2);

    return this.secToMsecAndRound (result);
  }

  getByFredericia (qt: number, rr: number): number {
    let result = this.msecToSec (qt) / Math.pow(this.msecToSec (rr), 1/3);

    return this.secToMsecAndRound (result);
  }

  getByHodges (qt: number, rr: number): number {
    let result = this.msecToSec (qt) + 0.00175 * (this.rrToHeartRate (rr) - 60);

    return this.secToMsecAndRound (result);
  }

  getByFramingham (qt: number, rr: number): number {
    let result = this.msecToSec (qt) + 0.154 * (1 - this.msecToSec (rr));

    return this.secToMsecAndRound (result);
  }

  private rrToHeartRate (rr: number): number {
    return 60000 / rr;
  }

  private msecToSec (interval: number): number {
    return interval / 1000;
  }

  private secToMsecAndRound (interval: number): number {
    return Number((interval * 1000).toFixed(this.accuracy));
  }
}