import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import lighthouseDesktopConfig from 'lighthouse/lighthouse-core/config/lr-desktop-config';
const { getToken } = require("../userToken");
const fs =require('fs');
const path = require('path');
const baseurl = `${process.env.npm_config_baseurl}`;
const urls = [ baseurl ];
const portarr = [9222,9221];
const date = Date.now().toString();
// const options = {
//     logLevel: "info",
// };
// const configs = {
//     extends: "lighthouse:default",
//     settings: {
//         onlyCategories: ["accessibility"],
//         onlyAudits: ["largest-contentful-paint",
//             "cumulative-layout-shift"],
//         skipAudits: ["performance"]
//     }
// }

test.use({ headless: false });
urls.forEach(async (url) => {
  test(`Un-Auth lighthouse: ${url}`, async ({ playwright }) => {
    for (const [index, browserType] of ['chromium'].entries()) {
      const browser = await playwright[browserType].launch({
        args: [`--remote-debugging-port=${portarr[index]}`]
      });
      const context = await browser.newContext();
      const page = await context.newPage();
      const token = await getToken();
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
    }
    
  });
});

function reportClean() {
  const file = `../lighthouse-report-desktop/lighthouse-report-${date}.json`;
  fs.readFile(path.resolve(__dirname, file), function(err, data) {
    if (err) throw err;
    // Converting to JSON
    const users = JSON.parse(data);
    let writedata = dataCleanup(users);
    fs.writeFile(path.resolve(__dirname, file), JSON.stringify(writedata), err => {
        // Checking for errors
        if (err) throw err; 
    });
});
}

const dataCleanup = (lightHouse) => {
  let auditData = lightHouse.audits;
  const data = {
    "first-contentful-paint": auditData['first-contentful-paint'],
    "largest-contentful-paint": auditData['largest-contentful-paint'],
    "first-meaningful-paint": auditData['first-meaningful-paint'],
    "speed-index": auditData['speed-index'],
    "cumulative-layout-shift": auditData['cumulative-layout-shift'],
    "total-blocking-time": auditData['total-blocking-time'],
    "interactive": auditData['interactive']
  }
  return data
}
