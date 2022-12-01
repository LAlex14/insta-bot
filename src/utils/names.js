// const _ = require("lodash");
// const fs = require("fs");
// const {file_name} = require("../config.js");
//
// function uniqNames() {
//     const arr = await getUsersArr();
//     const newArr = _.uniq(arr);
//     fs.writeFileSync(file_name, JSON.stringify(newArr), 'utf8');
//     logMessage(newArr.length)
// }

import fs from "fs";
import {file_name} from "../config";

const names = ['alex', 'sebi', 'robert', 'vlad', 'andrei', 'edu', 'amalia', 'andreea', 'augustina', 'andrada', 'camelia', 'carina', 'dumitru', 'cristi', 'victor', 'vasile', 'diana', 'gabriela', 'georgiana', 'geanina', 'geta', 'ina', 'adam', 'daniel', 'filip', 'calin']
const names2 = ['bogdan', 'david', 'alexandru', 'stefan', 'ionut', 'mihai', 'cristian', 'darius', 'maria', 'elena', 'ioana', 'alexandra', 'ana', 'antonia', 'daria', 'gabriela', 'stefania']

async function getUsernames(page, name) {

    await clickOnCommArea(page);

    // const random2letters = Math.random().toString(36).substring(2, 4);
    const searchTag = `@${name}`;
    // logMessage(searchTag)
    await page.keyboard.type(searchTag);
    await new Promise(resolve => setTimeout(resolve, 5000));
    // await page.waitForSelector('._acmu');

    const tags = await page.$$('._acmu')

    const values = await Promise.all(tags.map(async tag => await page.evaluate(el => el.textContent, tag)))

    let data = getUsersArr();
    data = [...data, ...values];

    fs.writeFileSync(file_name, JSON.stringify(data), 'utf8');
}

//  const navigationPromise = page.waitForNavigation({timeout: 0});
//
//  await clickOnCommArea(page);
//
//  for (const name of names2) {
//      await page.reload();
//      await getUsernames(page, name);
// }