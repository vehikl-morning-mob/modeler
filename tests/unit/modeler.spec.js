const timeout = 5000;
const puppeteer = require('puppeteer');

describe('Modeler', () => {
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

  it('Drag a node to the paper', async() => {
    const element = await page.$('.tool');
    const { x, y, height, width } = await element.boundingBox();

    const paperContainer = await page.$('.paper-container');
    const paperContainerBox = await paperContainer.boundingBox();

    const downloadXMLSelector = await page.$$('.download-xml');

    const html = await page.content();

    await page.mouse.move(x + width / 2, y + height / 2);
    await page.mouse.down();
    await page.mouse.move(x + 1000, y + 1000);
    await page.mouse.up();

    await page.click(downloadXMLSelector);

    console.log(html);
  });
},
timeout
);
