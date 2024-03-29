const puppeteer = require('puppeteer');
const login = require('./modules/login.js');
const comment = require('./modules/comment.js');
const { photo_link, users, acc_pause_min, start_pause_min, action, repeat_times } = require("./config");
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
    logMessage(`<-- Logged in as [@${loginData.username}] -->\n`);
    await page.goto(photo_link);
}

async function collectUsernames() {
    const instance = await newInstance();
    await loginAndGoToPhotoPage(instance.page, users[0]);
    await getUsernames(instance.page);
    await instance.browser.close();
    logMessage(`<-- The collecting of usernames has ended -->`);
}

async function leaveComments() {
    let passedUsers = 0;

    if (start_pause_min) {
        logMessage(`Waiting [${start_pause_min} minutes] before starting...`);
        await sleep(start_pause_min * 60 * 1000);
    }

    for (const user of users) {
        if (user.skip) {
            logMessage(`Skipping [@${user.username}]\n`);
            continue;
        }

        if (passedUsers) {
            logMessage(`<-- Waiting [${acc_pause_min} minutes] before next account -->\n`);
            await sleep(acc_pause_min * 60 * 1000);
        }

        const instance = await newInstance();
        await loginAndGoToPhotoPage(instance.page, user);

        await comment(instance.page);

        await instance.browser.close();

        logMessage(`<-- Session ended for [@${user.username}] -->`);
        passedUsers++;
    }
    logMessage(`<-- All sessions ended -->`);
}

(async () => {
    for (let i = 0; i < repeat_times || 1; i++) {
        switch (action) {
            case 'collect':
                await collectUsernames();
                break;
            case 'comment':
                await leaveComments();
                break;
            default:
                logMessage('Please provide a valid action');
        }
    }
    process.exit();
})();