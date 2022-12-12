const { test } = require('@playwright/test');
const { playAudit } = require('playwright-lighthouse');
const lighthouseDesktopConfig = require('lighthouse/lighthouse-core/config/lr-desktop-config');
const fs =require('fs');
const path = require('path');

const config = require('../config');
const { sendEmail } = require('../mailsend');
const urls = [ config.BASE_URL ];
const portarr = [9222,9221];
const date = Date.now().toString();

test.use({ headless: false });
urls.forEach(async (url) => {
  test(`Un-Auth lighthouse: ${url}`, async ({ playwright }) => {
    for (const [index, browserType] of ['chromium'].entries()) {
      const browser = await playwright[browserType].launch({
        args: [`--remote-debugging-port=${portarr[index]}`]
      });
      const context = await browser.newContext();
      const page = await context.newPage();
      // const token = await getToken();
      const token = process.env.npm_config_token;
      await page.goto(`${url}?token=${token}`);
      await playAudit({
      //   opts: options,
        config: lighthouseDesktopConfig,
        // thresholds: {
        //   performance: 50,
        //   accessibility: 50,
        //   'best-practices': 50,
        //   seo: 50,
        //   pwa: 50
        // },
        ignoreError: true,
        port: portarr[index],
        page,
        reports:
              {
                formats: {
                  html: true, json: true
                },
                name: `lighthouse-report-${date}`,
                directory: 'lighthouse-report-desktop'
              }
  
      });
      await page.close();
      await context.close();
      await browser.close();
      await reportClean();
      await sendPerformanceMetric();
    }
    
  });
});

function reportClean() {
  const file = `../lighthouse-report-desktop/lighthouse-report-${date}.json`;
  fs.readFile(path.resolve(__dirname, file), function(err, data) {
    if (err) throw err;
    // Converting to JSON
    const metrics = JSON.parse(data);
    let writedata = dataCleanup(metrics);
    fs.writeFile(path.resolve(__dirname, file), JSON.stringify(writedata,null,4), err => {
        // Checking for errors
        if (err) throw err; 
    });
});
}

const dataCleanup = (lightHouse) => {
  let auditData = lightHouse.audits;
  const data = {
    "first-contentful-paint": auditData['first-contentful-paint']['displayValue'],
    "largest-contentful-paint": auditData['largest-contentful-paint']['displayValue'],
    "first-meaningful-paint": auditData['first-meaningful-paint']['displayValue'],
    "speed-index": auditData['speed-index']['displayValue'],
    "cumulative-layout-shift": auditData['cumulative-layout-shift']['displayValue'],
    "total-blocking-time": auditData['total-blocking-time']['displayValue'],
    "interactive": auditData['interactive']['displayValue']
  }
  return data
}

const sendPerformanceMetric = async() => {
  const file = `../lighthouse-report-desktop/lighthouse-report-${date}.json`;
  var mailOptions = {
    from: 'jainnyashi@gmail.com',
    to: 'yashi.jain@comprotechnologies.com',
    subject: 'Ecom QA environment performance test result',
    html: '<b>Ecom QA environment performance metric</b>',
    attachments: [
      {
          filename: 'performance.json',
          path: `${path.resolve(__dirname, file)}` // stream this file
      }
    ]
  };
  await sendEmail(mailOptions);
}
