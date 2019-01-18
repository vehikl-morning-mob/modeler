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
  }, timeout);

  it('Modeler Application Renders', async() => {
    let text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('ProcessMaker Modeler');
  });

  xit('Drags and drops node to graph', async() => {
    const element = await page.$('.tool');
    const { x, y, height, width } = await element.boundingBox();
    const paperContainer = await page.$('.paper-container');
    const paperContainerBox = await paperContainer.boundingBox();
    const html = await page.content();

    await page.mouse.move(x + width / 2, y + height / 2);
    await page.mouse.down();
    await page.mouse.move(x + 750, y + 400);
    await page.mouse.up();

  });

  it('exported process xml is a valid xml', async() => {
    let xml;
    const validXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_03dabax" targetNamespace="http://bpmn.io/schema/bpmn" exporter="ProcessMaker Modeler" exporterVersion="1.0">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="node_2" name="Start Event" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="node_2_di" bpmnElement="node_2">
        <dc:Bounds x="150" y="150" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    await page.waitForSelector('.downloadXml');
    await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './tempDownloads'});

    await page.click('.downloadXml');
    // await page.waitFor(10000);
    const fs = require('fs');
    fs.readFile('./tempDownloads/bpmnProcess.xml', 'utf8', (err,data) => {
      if (err) {
        throw err;
      }
      xml = data;
      expect(xml).toMatch(validXml);
    });

    // await expect(page).toClick('.downloadXml');
  });
},timeout);
