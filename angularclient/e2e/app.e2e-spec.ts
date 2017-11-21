import { AngularclientPage } from './app.po';

describe('angularclient App', function() {
  let page: AngularclientPage;

  beforeEach(() => {
    page = new AngularclientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
