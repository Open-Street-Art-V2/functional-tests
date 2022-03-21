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
const { findSafariDriver } = require('selenium-webdriver/safari');
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
      until.elementLocated(By.css('button.inline-flex'))
    );
    loginButton.click();

    console.log("Le forrmulaire d'authentification s'affiche.");

    const email = await driver.wait(until.elementLocated(By.css('#email')));
    email.sendKeys('abcde');

    await driver.wait(until.elementLocated(By.css('#email-helper-text')));

    assert(
      (await driver.findElement(By.css('#email-helper-text')).getText()) ===
        'Email invalide',
      "Le message d'erreur d'email ne s'affiche pas."
    );

    console.log("Le message d'erreur d'email s'affiche.");

    await email.clear();
    await driver.sleep(500);
    
    email.sendKeys(process.env.USER_EMAIL);


    const password = await driver.wait(
      until.elementLocated(By.css('#password'))
    );
    await password.sendKeys(process.env.LESS_EIGHT_PASSWORD);

    // const l8c = await driver.wait(
    //   until.elementLocated(By.css('#password-helper-text'))
    // );
    // assert(
    //   (await l8c.getText()) === 'Minimum 8 caractères',
    //   'wrong password less then 8, not displayed !'
    // );

    // console.log('wrong password less then 8 displayed !');

    // await password.clear();
    // await password.sendKeys(process.env.NO_UPPER_PASSWORD);
    // const nup = await driver.wait(
    //   until.elementLocated(By.css('#password-helper-text'))
    // );
    // assert(
    //   (await nup.getText()) ===
    //     'Doit contenir au moins un caractère en majuscule',
    //   'wrong password no upper case letter, not displayed !'
    // );

    // console.log('wrong password no upper case letter displayed !');

    // await password.clear();
    // await password.sendKeys(process.env.NO_DIGITS_PASSWORD);
    // const ndp = await driver.wait(
    //   until.elementLocated(By.css('#password-helper-text'))
    // );
    // assert(
    //   (await ndp.getText()) === 'Doit contenir au moins un chiffre',
    //   'wrong password at least 1 digit, not displayed !'
    // );

    // console.log('wrong password at least 1 digit displayed !');

    // await password.clear();
    // await password.sendKeys(process.env.TOO_LONG_PASSWORD);
    // const tlp = await driver.wait(
    //   until.elementLocated(By.css('#password-helper-text'))
    // );
    // assert(
    //   (await tlp.getText()) === 'Maximum 25 caractères',
    //   'password too long not displayed !'
    // );

    // console.log('password too long displayed !');

    //#root > main > div > form > div:nth-child(2) > div > div.MuiAlert-message.css-acap47-MuiAlert-message
    //Coordonnées saisies incorrectes

    await password.clear();
    await password.sendKeys(process.env.WRONG_PASSWORD);
    await driver.sleep(500);
    const submit = await driver.findElement(By.xpath('//*[@id="mui-1"]'));
    await submit.click();

    const wp = await driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="root"]/main/div/form/div[2]/div/div/div[2]')
      ),
      500
    );
    assert(
      (await wp.getText()) === 'Coordonnées saisies incorrectes',
      "Le message d'erreur de coordonnées ne s'affiche pas."
    );

    console.log("Le message d'erreur de coordonnées s'affiche.");

    await password.clear();
    await password.sendKeys(process.env.PASSWORD);
    await driver.sleep(500);
    await submit.click();
    await driver.sleep(500);
    assert(
      (await driver.getCurrentUrl()) === 'http://localhost:3000/',
      "Pas de redirection vers la page d'accueil quand l'utilisateur est connecté."
    );
    console.log("Redirection vers la page d'accueil quand l'utilisateur est connecté.");
  } finally {
    await driver.sleep(1000);
    await driver.quit();
  }
})();
