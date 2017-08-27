import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';
import { AppState, isUsed } from './app_state.service';

describe ('AppState', () => {
  let state: AppState;

  beforeEach(async(() => {
    state = new AppState;
  }));

  it ('after creation service return default useSums', () => {
    expect (state.getValue ('useSums')).toEqual ({ use: true });
  });

  it ('after creation service return default usePercentage', () => {
    expect (state.getValue ('usePercentage')).toEqual ({ use: true });
  });

  it ('return inverted state after toggle', () => {
    expect (state.toggle ('useSums').getValue ('useSums')).toEqual ({ use: false });
  });

  it ('return false state after toggle with false argument', () => {
    expect (state.toggle ('useSums', false).getValue ('useSums')).toEqual ({ use: false });
  });

  it ('return true state after toggle with true argument', () => {
    expect (state.toggle ('useSums', true).getValue ('useSums')).toEqual ({ use: true });
  });

  it ('return observable stream which returns state object on toggle', () => {
    let stream: Observable<isUsed> = state.getStream ('useSums');
    let receivedValue: isUsed;

    stream.subscribe (value => receivedValue = value);
    state.toggle ('useSums', false);
    expect (receivedValue).toEqual ({ use: false });
  });

  it ('return observable stream which returns data', () => {
    let stream: Observable<object> = state.getDataStream ('calcWrapperData');
    let receivedValue: object;

    stream.subscribe (value => receivedValue = value);
    expect (receivedValue).toBeDefined();
  });
});