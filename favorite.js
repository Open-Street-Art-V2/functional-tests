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
  
  (async function favorite() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
        // connect as a user
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

        // go to the search page and search for an art
        await driver.get('http://localhost:3000/search');
        const searchInput = await driver.wait(
            until.elementLocated(By.css('#search-input'))
        );
        await searchInput.sendKeys(process.env.SEARCH_CITY);

        const button = await driver.wait(
            until.elementLocated(By.css('#search-button'))
          );
        button.click();

        const card = await driver.wait(
            until.elementLocated(By.css('div.mt-3:nth-child(1) > a:nth-child(1)'))
          );
        card.click();
        await driver.sleep(500); 

        // add art to favorite
        const addStar = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div/main/div/div/button'))
        );

        const starType = await driver.wait(
            until.elementLocated(By.css('.css-g5hgac-MuiSvgIcon-root'))
        ).getAttribute("data-testid");
        const isFavorite = starType === "StarIcon";

        addStar.click();
        if (isFavorite) {
            // if the art was already in favorites, we put it again
            await driver.sleep(500); 
            addStar.click();
        }

        const titleFavoriteArt = await driver.wait(
            until.elementLocated(By.xpath(
                '//*[@id="root"]/div/main/div/div[2]/div'
            ))
        ).getText();

        // go to the list of favorites
        await driver.get('http://localhost:3000/profil');
        await driver.wait(
            until.elementLocated(By.xpath(
                '//*[@id="root"]/div/div[3]/a[2]/div'
            ))
        ).click();

        // check if the art we add is present
        const favorites = await driver.wait(
            until.elementLocated(By.css('#scrollableDiv'))
        ).getText();

        assert(
            favorites.includes(titleFavoriteArt),
            "L'ajout d'une oeuvre à nos favoris ne fonctionne pas. -> KO"
        );
        console.log("L'ajout d'une oeuvre à nos favoris fonctionne. -> OK");
        console.log("La liste des oeuvres favorites s'affiche. -> OK");

        // delete an art form favorites
        await driver.wait(
            until.elementLocated(By.xpath(
                '//*[@id="root"]/div/div[2]/div/div/div/a'
            ))
        ).click();

        const deleteStar = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/main/div/div/button'))
        );
        deleteStar.click();

        const titleNotFavoriteArt = await driver.wait(
            until.elementLocated(By.xpath(
                '//*[@id="root"]/main/div/div[2]/div'
            ))
        ).getText();

        // go back to the list to check that the art is not displayed
        await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div[2]/button'))
        ).click();

        const favorites2 = await driver.wait(
            until.elementLocated(By.css('#scrollableDiv'))
        ).getText();

        assert(
            !favorites2.includes(titleNotFavoriteArt),
            "La suppression d'une oeuvre aux favoris ne fonctionne pas. -> KO"
        );
        console.log("La suppression d'une oeuvre aux favoris fonctionne. -> OK");

    } catch {
      console.log("Erreur lors du lancement du test des favoris. -> KO")
    } finally {
        await driver.sleep(500);
        await driver.quit();
    }
})();