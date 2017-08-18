import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';
import { AppState, isUsed } from './app_state.service';

describe ('AppState', () => {
  let state: AppState;

  beforeEach(async(() => {
    state = new AppState;
  }));

  it ('after creation service return default state', () => {
    expect (state.useSumsCurrent ()).toEqual ({ useSums: true });
  });

  it ('return inverted state after toggle', () => {
    expect (state.toggleSums ().useSumsCurrent ()).toEqual ({ useSums: false });
  });

  it ('return false state after toggle with false argument', () => {
    expect (state.toggleSums (false).useSumsCurrent ()).toEqual ({ useSums: false });
  });

  it ('return true state after toggle with true argument', () => {
    expect (state.toggleSums (true).useSumsCurrent ()).toEqual ({ useSums: true });
  });

  it ('return observable stream which returns state object on toggle', () => {
    let stream: Observable<isUsed> = state.useSumsStream ();
    let recivedValue;

    stream.subscribe (value => recivedValue = value);
    state.toggleSums (false);
    expect (recivedValue).toEqual ({ useSums: false });
  });
});