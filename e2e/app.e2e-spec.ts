import { MainPage } from './app.po';

describe('App', () => {
  let page: MainPage;

  beforeEach(() => {
    page = new MainPage();
  });

  it('should find text', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toBeTruthy();
  });
});