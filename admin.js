const { Builder, By, until } = require('selenium-webdriver');
const faker = require('faker');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const assert = require('assert');
require('dotenv').config();

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

(async function example() {
  const driver = await new Builder().forBrowser('chrome').build();
  try {
    //resize
    // await driver.executeScript('window.resizeTo(1024, 768);');

    // go to app
    await driver.get('http://localhost:3000/');

    // wait for the page to load (center position)
    await driver.sleep(1000);

    const loginButton = await driver.wait(
      until.elementLocated(By.css('#login > a'))
    );
    loginButton.click();

    const email = await driver.wait(until.elementLocated(By.css('#email')));

    await email.clear();
    await email.sendKeys('admin');
    await driver.sleep(5000);
    await email.sendKeys('mail.com');

    const password = await driver.wait(
      until.elementLocated(By.css('#password'))
    );

    // await password.clear();
    await password.sendKeys(process.env.ADMIN_PASSWORD);
    await driver.sleep(500);
    const submit = await driver.findElement(By.xpath('//*[@id="mui-1"]'));
    await submit.click();
    await driver.sleep(500);
    assert(
      (await driver.getCurrentUrl()) === 'http://localhost:3000/map/admin',
      'FAILED : not redirected to the correct url when logged in as admin'
    );
    console.log('PASSED : redirected to the admin map when logged in !');

    await driver.sleep(1000);

    //wait for the art to show on screen
    await driver.wait(
      until.elementLocated(
        By.css(
          '#root > div > div:nth-child(1) > div > div.overlays > div:nth-child(10) > svg'
        )
      ),
      5000
    );

    // click on art
    await driver
      .findElement(
        By.css(
          '#root > div > div:nth-child(1) > div > div.overlays > div:nth-child(10) > svg'
        )
      )
      .click();

    await driver.sleep(1000);
    // scroll inside the popup to show all the details of the art
    await driver.executeScript(`
          const popUp = document.querySelector("div.popupCard2");
          popUp.scrollTo(0, document.body.scrollHeight+1000);
          `);
    await driver.sleep(1000);
    await driver
      .findElement(
        By.css('#root > div > div.popupCard2 > div.px-6.pt-2.pb-5 > div > a')
      )
      .click();

    const title = await driver.findElement(By.css('#title'));
    await title.clear();
    await title.sendKeys(faker.lorem.words(26));

    const titleError = await driver.findElement(By.css('#title-helper-text'));
    assert(
      (await titleError.isDisplayed()) === true &&
        (await titleError.getText()) === 'Titre invalide',
      'FAILED : message title error not displayed !'
    );
    console.log('PASSED : message title error displayed !');

    await title.clear();
    await title.sendKeys(faker.lorem.word(10));

    const artist = await driver.findElement(By.css('#artist'));
    await artist.clear();
    await artist.sendKeys(faker.name.findName());

    const description = await driver.findElement(By.css('#description'));

    await description.clear();
    await description.sendKeys('a');

    const descriptionError = await driver.findElement(
      By.css('#description-helper-text')
    );

    assert(
      (await descriptionError.isDisplayed()) === true &&
        (await descriptionError.getText()) ===
          'Description doit contenir entre 2 et 250 caractéres',
      'FAILED : message description error not displayed !'
    );
    console.log('PASSED : message description error displayed !');

    await description.clear();
    await description.sendKeys(faker.lorem.sentences(25, ' '));
    assert(
      (await descriptionError.isDisplayed()) === true &&
        (await descriptionError.getText()) ===
          'Description doit contenir entre 2 et 250 caractéres',
      'FAILED : message description error not displayed !'
    );
    console.log('PASSED : message description error displayed !');

    await description.clear();
    await description.sendKeys(faker.lorem.sentences(4, ' '));

    const addImage = await driver.findElement(By.css('#icon-button-file1'));
    await addImage.sendKeys(process.env.IMAGE_PATH);

    //click on change position
    await driver
      .findElement(By.css('#root > div > main > div > form > div > button'))
      .click();

    // const windowSize = await driver.manage().window().getSize();
    const mapOverlay = await driver.findElement(
      By.css(
        'body > div.MuiModal-root.blure.css-bvyw50 > div.MuiBox-root.css-1p6yjsm > div > div > div.overlays'
      )
    );
    const windowSize = await mapOverlay.getRect();
    const actions = driver.actions({ async: true });
    await actions
      .move({
        x: parseInt(windowSize.width / 2),
        y: parseInt(windowSize.height / 2),
      })
      // .pause(3000)
      .perform();
    await actions.click().perform();

    // await driver.findElement(By.css('#mui-2')).click();

    // const modifiedSuccess = await driver.findElement(
    //   By.css('.MuiAlert-message.css-acap47-MuiAlert-message')
    // );
    // assert(
    //   await modifiedSuccess.isDisplayed() === true &&
    //     await modifiedSuccess.getText() === 'Oeuvre modifier avec succès',
    //   'FAILED : no message displayed when art is modified !'
    // );
    // console.log('PASSED : message displayed when art is modified !');
    // assert(
    //   (await driver
    //     .findElement(
    //       By.xpath('//*[@id="root"]/div/div[3]/div[3]/div/button[1]')
    //     )
    //     .isDisplayed()) === true,
    //   'FAILED : No modification button for admin in art popup'
    // );
    // console.log(
    //   'PASSED : Modfication button is displayed for admin in art popup'
    // );

    // assert(
    //   (await driver
    //     .findElement(
    //       By.css(
    //         '#root > div > div.popupCard2 > div.px-6.pt-2.pb-5 > div > button.bg-red-500.text-white.font-bold.py-2.px-4.rounded-full.focus:outline-none.focus:shadow-outline'
    //       )
    //     )
    //     .isDisplayed()) === true,
    //   'FAILED : No delete button for admin in art popup'
    // );
    // console.log('PASSED : Delete button is displayed for admin in art popup');

    // await driver.findElement(By.css('#addBtn')).click();
    // assert(
    //   (await driver
    //     .findElement(By.css('#root > div > div > div > div.text-center > p'))
    //     .getText()) === 'Ajouter une oeuvre',
    //   'FAILED : when clicked the add button not redirected to add page for admin'
    // );
    // console.log(
    //   'PASSED : when clicked the add button redirected to add page for admin'
    // );
  } finally {
    await driver.sleep(8000);
    await driver.quit();
  }
})();
