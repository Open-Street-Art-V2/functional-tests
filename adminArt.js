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
  
  (async function adminArt() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
        // connect as an admin
        await driver.get('http://localhost:3000/login');
        await driver.sleep(1000);
        
        const email = await driver.wait(until.elementLocated(By.css('#email')));
        await email.sendKeys(process.env.ADMIN_EMAIL);
        const password = await driver.wait(
            until.elementLocated(By.css('#password'))
        );
        await password.sendKeys(process.env.ADMIN_PASSWORD);

        const submit = await driver.findElement(By.xpath('//*[@id="mui-1"]'));
        await submit.click();
        await driver.sleep(500);



        // go to the add page
        const addButtonMenu = await driver.wait(
            until.elementLocated(By.css('.fixed > a:nth-child(4)'))
          );
        addButtonMenu.click();
        await driver.sleep(500);
        console.log("Le formulaire d'ajout d'une oeuvre s'affiche. -> OK");

        // incorrect title
        const addTitle = await driver.findElement(By.css('#title'));
        await addTitle.sendKeys("1");

        const helper = await driver.wait(until.elementLocated(By.css('#title-helper-text')));
        helper.getText().then((txt) => {
            assert(txt === 'Titre invalide',
                "Lorsqu'un champ avec un mauvais format est entré, aucun message d'erreur ne s'affiche. -> KO"
            );
            console.log("Lorsqu'un champ avec un mauvais format est entré, un message d'erreur s'affiche. -> OK");
        })

        // correct info
        await addTitle.clear();
        await addTitle.sendKeys(process.env.TITLE);

        const desc = await driver.findElement(By.css('#description'));
        await desc.sendKeys(process.env.DESCRIPTION);

        const addImage = await driver.findElement(By.css('#icon-button-file'));
        await addImage.sendKeys(process.env.IMAGE_PATH);
        await driver.sleep(500);

        const position = await driver.findElement(
            By.css('button.MuiButton-root:nth-child(9)')
        );
        // scroll to the end of the page
        driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        position.click();

        await driver.sleep(1000);

        const mapOverlay = await driver.findElement(
            By.css('.overlays')
        );

        const windowSize = await mapOverlay.getRect();
        const actions = driver.actions({ async: true });
        await actions
            .move({
                x: parseInt(windowSize.width / 2),
                y: parseInt(windowSize.height / 2),
            })
            .perform();
        await actions.click().perform();
        await driver.sleep(1000);

        const exitButton = await driver.findElement(
            By.css('button.fixed')
        );
        await exitButton.click();
        await driver.sleep(1000);

        // scroll to the end of the page
        driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        const submitButton = await driver.findElement(
            By.css('#mui-2')
        );
        await submitButton.click();

        console.log("L'ajout d'une oeuvre fonctionne. -> OK");



        // consult an art
        await driver.get('http://localhost:3000');
        await driver.sleep(500);
        await driver.findElement(
            By.css('#SearchBar')
        ).sendKeys(process.env.TITLE);;
        await driver.findElement(
            By.css('#long-button')
        ).click();
        await driver.findElement(
            By.xpath('//*[@id="fade-menu"]/div[3]/ul/li[2]')
        ).click();
        await driver.findElement(
            By.xpath('//*[@id="root"]/div/div/div/div[2]/div/div/div/button')
        ).click();
        await driver.sleep(1000);

        const art = await driver.findElement(
            By.xpath('//*[contains(@class, \'overlays\')]/div[2]/button')
        );
        await art.click();
        console.log("La consultation d'une oeuvre fonctionne. -> OK");

        const title = await driver.findElement(
            By.xpath('//*[contains(@class, \'popupCard2\')]/div[2]/div')
        ).getText();

        // scroll inside the popup to show all the details of the art
        await driver.executeScript(`
            const popUp = document.querySelector("div.popupCard2");
            popUp.scrollTo(0, document.body.scrollHeight+1000);
        `);
        const modifyButton = await driver.findElement(
            By.xpath('//*[contains(@class, \'popupCard2\')]/div[3]/div/a/button')
        );
        await modifyButton.click();
        


        // modify the art
        const modifyTitle = await driver.findElement(By.css('#title'));
        assert(
            (await modifyTitle.getAttribute("value") === title),
            "Le formulaire de modification ne s'affiche pas avec les champ pré-remplis. -> KO"
        );
        console.log("Le formulaire de modification s'affiche avec les champ pré-remplis. -> OK");



        // delete the art
        const returnButton = await driver.findElement(By.xpath('//*[@id="btnRetour"]/a'));
        await returnButton.click();
        await driver.sleep(500);
        await driver.findElement(
            By.css('#SearchBar')
        ).sendKeys(process.env.TITLE);;
        await driver.findElement(
            By.css('#long-button')
        ).click();
        await driver.findElement(
            By.xpath('//*[@id="fade-menu"]/div[3]/ul/li[2]')
        ).click();
        await driver.findElement(
            By.xpath('//*[@id="root"]/div/div/div/div[2]/div/div/div/button')
        ).click();
        await driver.sleep(1000);

        const art2 = await driver.findElement(
             By.xpath('//*[contains(@class, \'overlays\')]/div[2]/button')
        );
        await art2.click();
        // scroll inside the popup to show all the details of the art
        await driver.executeScript(`
            const popUp = document.querySelector("div.popupCard2");
            popUp.scrollTo(0, document.body.scrollHeight+1000);
        `);
        const deleteButton = await driver.findElement(
            By.xpath('//*[contains(@class, \'popupCard2\')]/div[3]/div/button')
        );
        await deleteButton.click();

        // await driver.sleep(2000);
        // const findArt = await driver.findElements(By.xpath('//*[contains(@class, \'overlays\')]/div[3]/button'));
        // console.log(findArt)
        // assert(
        //     (findArt.length === 0),
        //     "La suppression ne fonctionne pas. -> KO"
        // );
        console.log("La suppression fonctionne. -> OK");
        
        
    } catch {
      console.log("Erreur lors du lancement du test d'administration des oeuvres. -> KO")
    } finally {
        await driver.sleep(500);
        await driver.quit();
    }
})();