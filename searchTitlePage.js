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

(async function searchByTitle() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
        // go to app
        await driver.get('http://localhost:3000/');

        // wait for the page to load (center position)
        await driver.sleep(1000);

        // go the search page
        const searchButtonMenu = await driver.wait(
            until.elementLocated(By.css('.fixed > a:nth-child(2)'))
          );
        searchButtonMenu.click();

        const searchInput = await driver.wait(
            until.elementLocated(By.css('#search-input'))
        );
        await searchInput.sendKeys(process.env.SEARCH_TITLE);

        const select = await driver.wait(
            until.elementLocated(By.css('#menu-button'))
        );
        select.click();  
        await driver.sleep(500); 

        const selectTitle = await driver.wait(
            until.elementLocated(By.css('#menu-item-title'))
        );
        selectTitle.click();           

        const button = await driver.wait(
            until.elementLocated(By.css('#search-button'))
          );
        button.click();

        const card = await driver.wait(
            until.elementLocated(By.css('div.mt-3:nth-child(1) > a:nth-child(1)'))
          );
        card.click();
        await driver.sleep(500); 

        const title = await driver.wait(
            until.elementLocated(By.xpath(
                '//*[@id="root"]/div/main/div/div[2]/div'
            ))
        );
        title.getText().then((text) => {
            assert(
                text.toLowerCase().includes(process.env.SEARCH_TITLE.toLowerCase()),
                "La recherche par titre ne s'est pas bien passée. -> KO"
            )
            console.log("La recherche par titre s'est bien passée. -> OK")
        })
        await driver.sleep(500);
    } catch {
        console.log("Erreur lors du lancement du test de la recherche par titre. -> KO")
    } finally {
        await driver.sleep(500);
        await driver.quit();
    }
})();
