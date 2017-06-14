import { UnitTestsPage } from './app.po';

describe('unit-tests App', () => {
  let page: UnitTestsPage;

  beforeEach(() => {
    page = new UnitTestsPage();
  });

  it('should display message saying app works', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
