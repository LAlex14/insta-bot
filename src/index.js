const puppeteer = require('puppeteer');
const login = require('./modules/login.js');
const comment = require('./modules/comment.js');
const { photo_link, users, acc_pause_min, start_pause_min } = require("./config");
const { sleep, logMessage } = require("./utils/utils");
const getUsernames = require("./modules/usernames");
require('events').EventEmitter.defaultMaxListeners = 50;

async function newInstance() {
    const browser = await puppeteer.launch({
        executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
        headless: false,
        defaultViewport: null,
        args: ['--window-size=770,720']
    })
    const page = await browser.newPage();
    return { browser, page };
}

async function loginAndGoToPhotoPage(page, loginData) {
    await login(page, loginData);
    logMessage(`\n<-- Logged in as [@${loginData.username}] -->\n`);
    await page.goto(photo_link);
}

async function collectUsernames() {
    const instance = await newInstance();
    await loginAndGoToPhotoPage(instance.page, users[0]);
    await getUsernames(instance.page);
    await instance.browser.close();
    logMessage(`<-- The collecting of usernames has ended -->`);
    logMessage(`<-- Session ended for [@${users[0].username}] -->`);
}

async function leaveComments() {
    if (start_pause_min) {
        logMessage(`Waiting [${start_pause_min} minutes] before starting...`);
        await sleep(start_pause_min * 60 * 1000);
    }

    for (const user of users) {
        if (user.skip) {
            logMessage(`Skipping [@${user.username}]`);
            continue;
        }

        const instance = await newInstance();
        await loginAndGoToPhotoPage(instance.page, user);

        await comment(instance.page);

        await instance.browser.close();

        logMessage(`<-- Session ended for [@${user.username}] -->`);

        if (user.username === users.at(-1).username) {
            logMessage(`<-- The commenting has ended -->`);
            break;
        }

        logMessage(`<-- Waiting [${acc_pause_min} minutes] before next account -->\n`);
        await sleep(acc_pause_min * 60 * 1000);
    }
}

(async () => {
    await leaveComments();
    // await collectUsernames();
})();