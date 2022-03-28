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
        await searchInput.sendKeys(process.env.SEARCH_USER);

        const select = await driver.wait(
            until.elementLocated(By.css('#menu-button'))
        );
        select.click();  
        await driver.sleep(500); 

        const selectUser = await driver.wait(
            until.elementLocated(By.css('#menu-item-user'))
        );
        selectUser.click();           

        const button = await driver.wait(
            until.elementLocated(By.css('#search-button'))
          );
        button.click();

        const card = await driver.wait(
            until.elementLocated(By.css('div.mt-3:nth-child(1) > a:nth-child(1)'))
          );
        card.click();

        const user = await driver.wait(
            until.elementLocated(By.xpath(
              '//*[@id="root"]/main/div/div/div[2]/div'
            ))
          );
        user.getText().then((text) => {
            assert(
                text.toLowerCase().includes(process.env.SEARCH_USER.toLowerCase()),
                "La recherche d'utilisateur ne s'est pas bien passée. -> KO"
            )
            console.log("La recherche d'utilisateur s'est bien passée. -> OK")
          }).finally(() => console.log("\nConsultation d'un profil utilisateur"))

        const name = await driver.wait(
          until.elementLocated(By.xpath(
            '//*[@id="root"]/main/H1'
          ))
        );
        name.getText().then((text) => {
            assert(
                text.toLowerCase().includes(process.env.USER_PROFIL_NAME.toLowerCase()),
                "La consultation d'un profil utilisateur ne s'est pas bien passée. -> KO"
            )
          })

        const firstname = await driver.wait(
          until.elementLocated(By.xpath(
            '//*[@id="root"]/main/H1[2]'
          ))
        );
        firstname.getText().then((text) => {
            assert(
                text.toLowerCase().includes(process.env.USER_PROFIL_FIRSTNAME.toLowerCase()),
                "La consultation d'un profil utilisateur ne s'est pas bien passée. -> KO"
            )
            console.log("La consultation d'un profil utilisateur s'est bien passée. -> OK")
          })
    } catch {
      console.log("Erreur lors du lancement du test de la recherche par utilisateur. -> KO")
    } finally {
        await driver.sleep(500);
        await driver.quit();
    }
})();