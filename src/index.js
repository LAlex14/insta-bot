const puppeteer = require('puppeteer');
const login = require('./modules/login.js');
const comment = require('./modules/comment.js');
const { photo_link, users, acc_pause_min, start_pause_min } = require("./config");
const { sleep, logMessage } = require("./utils/utils");

require('events').EventEmitter.defaultMaxListeners = 50;

(async () => {

  await sleep(start_pause_min * 60 * 1000);
  logMessage(`Waiting ${start_pause_min} minutes before starting...`);

  for(let i = 0; i < users.length; i++) {
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
      headless: false,
      defaultViewport: null,
      args: ['--window-size=770,720']
    })
    const page = await browser.newPage();

    await login(page, users[i]);

    logMessage(`\n<-- Logged in as [@${users[i].username}] -->\n`);

    await page.goto(photo_link);

    await comment(page);

    await browser.close();

    logMessage(`\n<-- Session ended for [@${users[i].username}] -->`);
    logMessage(`<-- Waiting [${acc_pause_min} minutes] before next account -->\n`);

    await sleep(acc_pause_min * 60 * 1000);
  }
})();