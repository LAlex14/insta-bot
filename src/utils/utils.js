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

const logsDir = './src/logs';

if (!fs.existsSync(logsDir)){
    fs.mkdirSync(logsDir);
}

const log_file = fs.createWriteStream(`./src/logs/${dateNow()}-log.txt`, { flags: 'a' });

module.exports = {
    clickOnElement: async (page, selector) => {
        await page.waitForSelector(selector);
        await page.click(selector);
    },

    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    logMessage: (message) => {
        message = `\n${timeNow()} -> ${message}`;
        log_file.write(message);
        console.log(message);
    },

    getUsersArr: () => {
        let data = fs.readFileSync(file_name, 'utf8');
        data = JSON.parse(data);
        return data || [];
    }
}