import { XbmsPage } from './app.po';

describe('xbms App', () => {
  let page: XbmsPage;

  beforeEach(() => {
    page = new XbmsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
