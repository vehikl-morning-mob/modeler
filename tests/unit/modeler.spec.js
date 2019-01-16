const timeout = 5000;

describe(
  'Modeler',
  () => {
    let page;
    beforeAll(async() => {
      page = await global.__BROWSER__.newPage();
      await page.goto('http://localhost:8080/');
    }, timeout);

    afterAll(async() => {
      await page.close();
    });

    it('Modeler Application Renders', async() => {
      let text = await page.evaluate(() => document.body.textContent);
      expect(text).toContain('ProcessMaker Modeler');
    });
  },
  timeout
);
