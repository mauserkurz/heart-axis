import { MainPage } from './app.po';

describe('App', () => {
  let page: MainPage;

  beforeEach(() => {
    page = new MainPage();
  });

  it('should find text of main title', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Добро пожаловать в ФД-формула.');
  });
});