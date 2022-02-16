const {
  Builder,
  By,
  Key,
  until,
  WebElementCondition,
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const assert = require('assert');
require('dotenv').config();

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

(async function example() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    // go to app
    await driver.get('http://localhost:3000/');

    // wait for the page to load (center position)
    await driver.sleep(5000);

    const loginButton = await driver.wait(
      until.elementLocated(By.css('#login > a'))
    );
    loginButton.click();

    const email = await driver.wait(until.elementLocated(By.css('#email')));
    email.sendKeys('abcde');

    await driver.wait(until.elementLocated(By.css('#email-helper-text')));

    assert(
      (await driver.findElement(By.css('#email-helper-text')).getText()) ===
        'Email invalide',
      'wrong email message not displayed properly ! '
    );

    console.log('wrong email message displayed correctly !');

    email.clear();
    email.sendKeys('abcde');
    driver.sleep(5000);
    email.sendKeys('mail.com');

    const password = await driver.wait(
      until.elementLocated(By.css('#password'))
    );
    password.sendKeys(process.env.LESS_EIGHT_PASSWORD);

    const l8c = await driver.wait(
      until.elementLocated(By.css('#password-helper-text'))
    );
    assert(
      l8c.getText() === 'Minimum 8 caractères',
      'wrong password less then 8, not displayed !'
    );

    console.log('wrong password less then 8 displayed !');

    password.clear();
    password.sendKeys(process.env.NO_UPPER_PASSWORD);
    const nup = await driver.wait(
      until.elementLocated(By.css('#password-helper-text'))
    );
    assert(
      nup.getText() === 'Doit contenir au moins un caractère en majuscule',
      'wrong password no upper case letter, not displayed !'
    );

    console.log('wrong password no upper case letter displayed !');
  } finally {
    await driver.sleep(10000);
    await driver.quit();
  }
})();
