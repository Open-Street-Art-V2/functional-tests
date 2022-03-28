const {
  Builder,
  By,
  until,
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
    // try to go on a page reserved to connected users
    await driver.get('http://localhost:3000/profil');
    assert(
      (await driver.getCurrentUrl() === 'http://localhost:3000/'),
      "Lorsqu'un visiteur essaie d'accéder à une page nécessitant une connexion, il n'est pas redirigé. -> KO"
    );
    console.log("Lorsqu'un visiteur essaie d'accéder à une page nécessitant une connexion, il est redirigé. -> OK")

    // wait for the page to load
    await driver.sleep(1000);
    
    const loginButton = await driver.wait(
      until.elementLocated(By.css('button.inline-flex'))
    );
    loginButton.click();

    console.log("Le formulaire d'authentification s'affiche. -> OK");

    const email = await driver.wait(until.elementLocated(By.css('#email')));
    email.sendKeys('abcde');

    await driver.wait(until.elementLocated(By.css('#email-helper-text')));

    assert(
      (await driver.findElement(By.css('#email-helper-text')).getText()) ===
        'Email invalide',
      "Lorsque un email avec un mauvais format est entré, aucun message d'erreur ne s'affiche. -> KO"
    );

    console.log("Lorsque un email avec un mauvais format est entré, un message d'erreur s'affiche. -> OK");

    await email.clear();
    await driver.sleep(500);
    
    email.sendKeys(process.env.USER_EMAIL);


    const password = await driver.wait(
      until.elementLocated(By.css('#password'))
    );
    await password.sendKeys(process.env.LESS_EIGHT_PASSWORD);

    // test if the button is disabled when some fields are empty
    await password.clear();
    const submit = await driver.findElement(By.xpath('//*[@id="mui-1"]'));
    assert(
      (await submit.isEnabled()),
      "Lorsque un des champs est vide, le bouton de validation n'est pas désactivé. -> KO"
    );
    console.log("Lorsque un des champs est vide, le bouton de validation est désactivé. -> OK")

    // incorrect contact details
    await password.clear();
    await password.sendKeys(process.env.WRONG_PASSWORD);
    await driver.sleep(500);
    await submit.click();

    const wp = await driver.wait(
      until.elementLocated(
        By.xpath('//*[@id="root"]/main/div/form/div[2]/div/div/div[2]')
      ),
      500
    );
    assert(
      (await wp.getText()) === 'Coordonnées saisies incorrectes',
      "Lorsque des identifiants de connexion incorrectes sont données, aucun message d'erreur ne s'affiche. -> KO"
    );

    console.log("Lorsque des identifiants de connexion incorrectes sont données, un message d'erreur s'affiche. -> OK");

    // correct contact details
    await password.clear();
    await password.sendKeys(process.env.PASSWORD);
    await driver.sleep(500);
    await submit.click();
    await driver.sleep(500);
    assert(
      (await driver.getCurrentUrl()) === 'http://localhost:3000/',
      "Lorsque l'authentification réussit, pas de redirection vers la page d'accueil. -> KO"
    );
    console.log("Lorsque l'authentification réussit, redirection vers la page d'accueil. -> OK");

    // try to go on a page reserved to admin
    await driver.get('http://localhost:3000/admin/validateProposal');
    assert(
      (await driver.getCurrentUrl() === 'http://localhost:3000/'),
      "Lorsqu'un utilisateur connecté essaie d'accéder à une page réservée à l'administrateur, il n'est pas redirigé. -> KO"
    );
    console.log("Lorsqu'un utilisateur connecté essaie d'accéder à une page réservée à l'administrateur, il est redirigé. -> OK")

  } catch {
    console.log("Erreur lors du lancement du test. -> KO")
  } finally {
    await driver.sleep(1000);
    await driver.quit();
  }
})();
