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
    await driver.sleep(1000);

    const loginButton = await driver.wait(
      until.elementLocated(By.css('#login > a'))
    );
    loginButton.click();

    const email = await driver.wait(until.elementLocated(By.css('#email')));

    await email.clear();
    await email.sendKeys('admin');
    await driver.sleep(5000);
    await email.sendKeys('mail.com');

    const password = await driver.wait(
      until.elementLocated(By.css('#password'))
    );

    // await password.clear();
    await password.sendKeys(process.env.ADMIN_PASSWORD);
    await driver.sleep(500);
    const submit = await driver.findElement(By.xpath('//*[@id="mui-1"]'));
    await submit.click();
    await driver.sleep(500);
    assert(
      (await driver.getCurrentUrl()) === 'http://localhost:3000/map/admin',
      'FAILED : not redirected to the correct url when logged in as admin'
    );
    console.log('PASSED : redirected to the admin map when logged in !');

    await driver.sleep(1000);

    //wait for the art to show on screen
    await driver.wait(
      until.elementLocated(
        By.css(
          '#root > div > div:nth-child(1) > div > div.overlays > div:nth-child(10) > svg'
        )
      ),
      5000
    );

    // click on art
    await driver
      .findElement(
        By.css(
          '#root > div > div:nth-child(1) > div > div.overlays > div:nth-child(10) > svg'
        )
      )
      .click();

    await driver.sleep(1000);
    // scroll inside the popup to show all the details of the art
    await driver.executeScript(`
          const popUp = document.querySelector("div.popupCard2");
          popUp.scrollTo(0, document.body.scrollHeight+1000);
          `);
    await driver.sleep(1000);
    assert(
      (await driver
        .findElement(
          By.xpath('//*[@id="root"]/div/div[3]/div[3]/div/button[1]')
        )
        .isDisplayed()) === true,
      'FAILED : No modification button for admin in art popup'
    );
    console.log(
      'PASSED : Modfication button is displayed for admin in art popup'
    );

    assert(
      (await driver
        .findElement(
          By.css(
            '#root > div > div.popupCard2 > div.px-6.pt-2.pb-5 > div > button.bg-red-500.text-white.font-bold.py-2.px-4.rounded-full.focus:outline-none.focus:shadow-outline'
          )
        )
        .isDisplayed()) === true,
      'FAILED : No delete button for admin in art popup'
    );
    console.log('PASSED : Delete button is displayed for admin in art popup');

    await driver.findElement(By.css('#addBtn')).click();
    assert(
      (await driver
        .findElement(By.css('#root > div > div > div > div.text-center > p'))
        .getText()) === 'Ajouter une oeuvre',
      'FAILED : when clicked the add button not redirected to add page for admin'
    );
    console.log(
      'PASSED : when clicked the add button redirected to add page for admin'
    );
  } finally {
    // await driver.sleep(1000);
    // await driver.quit();
  }
})();
