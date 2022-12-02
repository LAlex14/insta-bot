const fs = require('fs');
const { file_name } = require("../config");
const { uniq } = require("lodash/array");
const { clickOnElement, getUsersArr, logMessage, sleep } = require("../utils/utils");
const selectors = require("../utils/selectors");
const firstNames = require('../data/firstNames.json');

async function uniqNames() {
    const arr = await getUsersArr();
    const newArr = uniq(arr);
    fs.writeFileSync(file_name, JSON.stringify(newArr), 'utf8');
    logMessage(`<-- Unique usernames: ${newArr.length} -->`)
}

async function extractUsernames(page, name) {
    const searchTag = `@${name}`;

    logMessage(`<-- Searching for [${searchTag}] -->`)

    await page.keyboard.type(searchTag);
    await sleep(5000)

    const tags = await page.$$('._acmu')

    const values = await Promise.all(tags.map(async tag => await page.evaluate(el => el.textContent, tag)))

    let data = getUsersArr();
    data = [...data, ...values];

    fs.writeFileSync(file_name, JSON.stringify(data), 'utf8');
}

module.exports = async (page) => {
    await clickOnElement(page, selectors.comm_text_area);

    for (const name of firstNames) {
        await extractUsernames(page, name);
    }
    await uniqNames();
}
