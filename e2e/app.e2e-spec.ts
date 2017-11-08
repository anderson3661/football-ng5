import { FootballPage } from './app.po';

describe('football App', function() {
  let page: FootballPage;

  beforeEach(() => {
    page = new FootballPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
