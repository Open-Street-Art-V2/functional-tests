const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const assert = require('assert');
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
      .sendKeys(process.env.ADMIN_EMAIL);

    await driver
      .wait(until.elementLocated(By.css('#password')))
      .sendKeys(process.env.PASSWORD);

    await driver.wait(until.elementLocated(By.css('#mui-1'))).click();
    await driver.sleep(500);
    await driver.get(process.env.Host + 'admin/validateProposal');
    await driver.sleep(1000);

    await driver
      .wait(
        until.elementLocated(
          By.css(
            '#scrollableDiv > div > div > div:nth-child(1) > a > div > div.grow.h-20.overflow-hidden.ml-2 > div > div.grow.font-bold.text-slate-900.text-base.overflow-hidden.w-16'
          )
        )
      )
      .click();

    assert(
      (await driver
        .findElement(By.css('#root > main > div:nth-child(5) > div > div'))
        .getText()) ===
        'Titre : ' + process.env.TITLE + '1',
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
        process.env.DESCRIPTION + '1',
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
        .getText()) ===
        'Artiste : ' + process.env.ARTIST,
      "L'artiste de la contribution n'a pas été enregistré correctement -> KO"
    );
    console.log(
      "L'artiste de la contribution a été enregistré correctement -> OK"
    );
    console.log('Contribution enregistrée correctement -> OK');

    const validateButton = await driver.findElement(By.css('#mui-1'));
    assert(
      validateButton.isDisplayed(),
      "Le button accepter n'est pas affiché correctement -> KO"
    );
    console.log('Le button accepter est affiché correctement -> OK');
    const refuseButton = await driver.findElement(By.css('#mui-2'));
    assert(
      refuseButton.isDisplayed(),
      "Le button refuser n'est pas affiché correctement -> KO"
    );
    console.log('Le button refuser est affiché correctement -> OK');

    await validateButton.click();
    await driver.sleep(1000);
    const successMessage = await driver
      .findElement(
        By.css(
          '#root > main > div.MuiBox-root.css-19n8dai > div > div > div > div.MuiAlert-message.css-acap47-MuiAlert-message'
        )
      )
      .getText();
    assert(
      successMessage === 'Proposal successfully validated.',
      "Le message de success ne s'est pas affiché corectement -> KO"
    );

    console.log("Le message de success s'est affiché corectement -> OK");

    // PARTIE REFUS DE LA PROPOSITION

    await driver.get(process.env.Host + 'admin/validateProposal');
    await driver.sleep(1000);

    await driver
      .wait(
        until.elementLocated(
          By.css(
            '#scrollableDiv > div > div > div:nth-child(1) > a > div > div.grow.h-20.overflow-hidden.ml-2 > div > div.grow.font-bold.text-slate-900.text-base.overflow-hidden.w-16'
          )
        )
      )
      .click();

    await driver.sleep(1000);
    await driver.findElement(By.css('#mui-2')).click();
    await driver.sleep(1000);
    const deleteMessage = await driver
      .findElement(
        By.css(
          '#root > main > div.MuiBox-root.css-19n8dai > div > div > div > div.MuiAlert-message.css-acap47-MuiAlert-message'
        )
      )
      .getText();
    assert(
      deleteMessage === 'Proposal deleted successfully.',
      "Le message de suppression ne s'est pas affiché corectement -> KO"
    );

    console.log("Le message de suppression s'est affiché corectement -> OK");
  } catch {
    console.log(
      "Erreur lors du lancement du test de la contribution de l'utilsateur. -> KO"
    );
  } finally {
    await driver.sleep(500);
    await driver.quit();
  }
})();
