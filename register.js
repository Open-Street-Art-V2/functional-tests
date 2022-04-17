const {
    Builder,
    By,
    until,
    Key
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
        await driver.get('http://localhost:3000/login');

        // try to go on register page
        const registerLink = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div/main/div/div/a'))
        );
        registerLink.click();

        await driver.sleep(500);
        
        assert(
            (await driver.getCurrentUrl() === 'http://localhost:3000/sign-up'),
            "Lorsqu'on clique sur le bouton d'inscription, le formulaire ne s'affiche pas. -> KO"
        );
        console.log("Lorsqu'on clique sur le bouton d'inscription, le formulaire s'affiche. -> OK")
  

        // leave empty fields
        const firstname = await driver.wait(until.elementLocated(By.css('#firstname')));
        await firstname.sendKeys('abc');
        // to clear the firstname because clear() does not work
        await firstname.sendKeys(Key.chord(Key.CONTROL, "A", Key.BACK_SPACE));

        await driver.wait(until.elementLocated(By.css('#firstname-helper-text')));
        assert(
            (await driver.findElement(By.css('#firstname-helper-text')).getText()).includes('Le prénom est obligatoire'),
            "Lorsque un champs est laissé vide, aucun message d'erreur ne s'affiche. -> KO"
        );
        console.log("Lorsque un champs est laissé vide, un message d'erreur s'affiche. -> OK");

        await firstname.sendKeys("toto");


        // fill a wrong email
        const email = await driver.wait(until.elementLocated(By.css('#email')));
        await email.sendKeys('abc');
        // to clear the email because clear() does not work
        await email.sendKeys(Key.chord(Key.CONTROL, "A", Key.BACK_SPACE));

        await driver.wait(until.elementLocated(By.css('#email-helper-text')));
        assert(
            (await driver.findElement(By.css('#email-helper-text')).getText()).includes('L\'adresse mail est invalide'),
            "Lorsque un email avec un mauvais format est entré, aucun message d'erreur ne s'affiche. -> KO"
        );
        console.log("Lorsque un email avec un mauvais format est entré, un message d'erreur s'affiche. -> OK")

        await email.sendKeys("toto@test.fr");


        // fill other inputs
        //step 1
        await driver.wait(until.elementLocated(By.css('#name'))).sendKeys("titi");

        const date = await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/div/div[3]/main/div/form/div/div[4]/div/div/div/button')))
        await date.click();
        await date.click();
        const next = await driver.findElement(By.xpath('//*[@id="root"]/div/main/div/div[5]/div/button'));
        await next.click();

        // step 2
        await driver.wait(until.elementLocated(By.css('#password'))).sendKeys("Titi123.");
        await driver.wait(until.elementLocated(By.css('#confirmation-password'))).sendKeys("Titi123.");
        
        
        // validate the form with correct informations
        const submit = await driver.findElement(By.xpath('//*[@id="root"]/div/main/div/div[5]/div/button'));
        await submit.click();
        const wp = await driver.wait(
            until.elementLocated(
                By.xpath('//*[@id="root"]/div/main/div/div[2]/div/div/div')
            ),
            500
        );
        assert(
            (await wp.getText()).includes('Compte créé avec succès'),
            "Lorsque l'inscription réussi, aucun message de succès ne s'affiche. -> KO"
        );
    
        console.log("Lorsque l'inscription réussi, un message de succès s'affiche. -> OK"); 
    } catch {
        console.log("Erreur lors du lancement du test. -> KO")
    } finally {
        await driver.sleep(1000);
        await driver.quit();
    }
  })();
  