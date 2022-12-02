const fs = require('fs');
const { file_name } = require("../config");

const timeNow = () => new Date().toLocaleString('ro-Ro', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
})
const dateNow = () => new Date().toLocaleString('ro-Ro', {
    hour12: false,
    month: 'numeric',
    year: 'numeric',
    day: 'numeric'
});

const log_file = fs.createWriteStream(`./src/logs/${dateNow()}-log.txt`, { flags: 'a' });

module.exports = {
    clickOnElement: async (page, selector) => {
        await page.waitForSelector(selector);
        await page.click(selector);
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    logMessage: (message) => {
        message = `${timeNow()} -> ${message}`;
        log_file.write(message + '\n');
        console.log(message);
    },

    getUsersArr: () => {
        let data = fs.readFileSync(file_name, 'utf8');
        data = JSON.parse(data);
        return data || [];
    }
}