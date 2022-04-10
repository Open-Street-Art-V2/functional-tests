const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const assert = require('assert');
const { Dirent } = require('fs');
require('dotenv').config();

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

(async function searchByCity() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    // go to app
    await driver.get(process.env.Host + 'login');

    // wait for the page to load (center position)
    await driver.sleep(1000);
    await driver
      .wait(until.elementLocated(By.css('#email')))
      .sendKeys(process.env.USER_EMAIL);

    await driver
      .wait(until.elementLocated(By.css('#password')))
      .sendKeys(process.env.PASSWORD);

    await driver.wait(until.elementLocated(By.css('#mui-1'))).click();

    await driver
      .wait(
        until.elementLocated(
          By.css(
            '#root > div > div.fixed.flex.w-screen.py-3.px-3.bottom-0.bg-white.items-center.justify-between.rounded-t-2xl.shadow-center > a:nth-child(3) > div > span > svg'
          )
        )
      )
      .click();

    await driver
      .wait(until.elementLocated(By.css('#title')))
      .sendKeys(process.env.TITLE + process.argv[2]);
    await driver
      .wait(until.elementLocated(By.css('#artist')))
      .sendKeys(process.env.ARTIST);
    await driver
      .wait(until.elementLocated(By.css('#description')))
      .sendKeys(process.env.DESCRIPTION + process.argv[2]);

    await driver
      .wait(until.elementLocated(By.css('#icon-button-file')))
      .sendKeys(process.env.IMAGE_PATH);

    await driver.executeScript('window.scrollBy(0,1000)');

    await driver
      .findElement(By.css('#root > div > main > div > form > div > button'))
      .click();
    await driver.sleep(1000);
    const actions = driver.actions({ async: true });
    const mapOverlay = await driver.findElement(By.css('.overlays'));
    const windowSize = await mapOverlay.getRect();
    await actions
      .move({
        x: parseInt(windowSize.width / 2),
        y: parseInt(windowSize.height / 2),
      })
      // .pause(3000)
      .perform();
    await actions.click().perform();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.css('#closeMap'))).click();
    await driver.wait(until.elementLocated(By.css('#mui-2'))).click();
    await driver.get(process.env.Host + 'contribution');
    await driver.sleep(1000);
    await driver
      .findElement(By.css('#scrollableDiv > div > div > div > a'))
      .click();

    assert(
      (await driver
        .findElement(By.css('#root > main > div:nth-child(5) > div > div'))
        .getText()) ===
        'Titre : ' + process.env.TITLE + process.argv[2],
      "Le titre de la contribution n'a pas été enregistré correctement -> KO"
    );
    console.log(
      'Le titre de la contribution a été enregistré correctement -> OK'
    );
    assert(
      (await driver
        .findElement(
          By.css('#root > main > div:nth-child(5) > div > blockquote > p')
        )
        .getText()) ===
        process.env.DESCRIPTION + process.argv[2],
      "La description de la contribution n'a pas été enregistré correctement -> KO"
    );
    console.log(
      'La description de la contribution a été enregistré correctement -> OK'
    );
    assert(
      (await driver
        .findElement(
          By.css(
            '#root > main > div:nth-child(5) > div > figcaption > div.text-lg.mt-3.mb-2'
          )
        )
        .getText()) === process.env.ARTIST,
      "L'artiste de la contribution n'a pas été enregistré correctement -> KO"
    );
    console.log(
      "L'artiste de la contribution a été enregistré correctement -> OK"
    );
    console.log('Contribution enregistrée correctement -> OK');
  } catch {
    console.log(
      "Erreur lors du lancement du test de la contribution de l'utilsateur. -> KO"
    );
  } finally {
    await driver.sleep(500);
    await driver.quit();
  }
})();
