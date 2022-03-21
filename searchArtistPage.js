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
  
  (async function searchByCity() {
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
        await searchInput.sendKeys(process.env.SEARCH_ARTIST);

        const select = await driver.wait(
            until.elementLocated(By.css('#menu-button'))
        );
        select.click();  
        await driver.sleep(500); 

        const selectArtist = await driver.wait(
            until.elementLocated(By.css('#menu-item-2'))
        );
        selectArtist.click();           

        const button = await driver.wait(
            until.elementLocated(By.css('#search-button'))
          );
        button.click();

        const card = await driver.wait(
            until.elementLocated(By.css('div.mt-3:nth-child(1) > a:nth-child(1)'))
          );
        card.click();

        const artist = await driver.wait(
            until.elementLocated(By.css('.text-lg'))
          );
        artist.getText().then((text) => {
            assert(
                text.toLowerCase().includes(process.env.SEARCH_ARTIST.toLowerCase()),
                "La recherche par artiste ne s'est pas bien passée."
            )
            console.log("La recherche par artiste s'est bien passée.")
        })
        await driver.sleep(500);

        const returnButton = await driver.wait(
            until.elementLocated(By.css('#retBtn'))
          );
        returnButton.click(); 
    } finally {
        await driver.sleep(500);
        await driver.quit();
    }
})();