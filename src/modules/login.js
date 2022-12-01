const { login_url } = require('../config.js');
const selectors = require('../utils/selectors');
const { clickOnElement } = require("../utils/utils");

module.exports = async (page, loginData) => {
  await page.goto(login_url);

  await clickOnElement(page, selectors.username_input);
  await page.type(selectors.username_input, loginData.username);

  await clickOnElement(page, selectors.password_input);
  await page.type(selectors.password_input, loginData.password);

  await clickOnElement(page, selectors.login_btn);
  await page.waitForNavigation();
}