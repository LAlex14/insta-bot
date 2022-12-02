const selectors = require('../utils/selectors');
const { comm_delay_sec, comm_per_run, run_pause_min, comm_total, tags_nr } = require('../config.js');
const { clickOnElement, sleep, logMessage, getUsersArr } = require("../utils/utils");

const users = getUsersArr();
const comm_delay = comm_delay_sec * 1000;
const comm_pause = run_pause_min * 60 * 1000;
let page, commIndex = 1;

async function createComment() {
    const usersToTag = [];
    for (let i = 0; i < tags_nr; i++) {
        const index = Math.floor(Math.random() * users.length);
        usersToTag.push(users[index]);
    }
    return '@' + usersToTag.join(' @');
}

async function leaveComment(comment) {
    await page.keyboard.type(comment);
    await clickOnElement(page, selectors.comm_submit_btn);
}

async function wasCommentPosted(comment) {
    await sleep(5000);

    const firstComment = await page.$(selectors.first_comm);
    const firstCommentText = await page.evaluate(el => el.textContent, firstComment);
    const wasPosted = firstCommentText === comment;

    if (wasPosted) {
        logMessage(`${commIndex++} comment: ${comment}`);
        return;
    }

    page.reload();
    await clickOnElement(page, selectors.comm_text_area);
    await postComment();
}

async function postComment() {
    const comment = await createComment();
    await leaveComment(comment);
    await wasCommentPosted(comment);
}

module.exports = async (pageData) => {
    page = pageData;
    await clickOnElement(page, selectors.comm_text_area);

    for (let i = 1; i <= comm_total; i++) {
        await postComment();
        const endedRun = i % comm_per_run === 0;
        let awaitTime = i === comm_total ? 0 : endedRun ? comm_pause : comm_delay;
        if (endedRun) {
            logMessage(`Pause for [${run_pause_min} minutes]\n`);
        }
        if (i === comm_total) {
            logMessage('All comments posted');
        }
        await sleep(awaitTime);
    }
}
