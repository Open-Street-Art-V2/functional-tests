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

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

(async function example() {
  // const options = new chrome.Options().setUserPreferences (
  //   'profile.default_content_settings.geolocation',
  //   2
  // );

  const driver = await new Builder()
    .forBrowser('chrome')
    // .setChromeOptions(options)
    .build();
  try {
    await driver.get('http://localhost:3000/');
    // await driver.wait();
    // await driver.manage().setTimeouts({ implicit: 10000 });

    // wait for the page to load (center position)
    await driver.sleep(10000);

    // wait until zoom button is ready
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[@id="root"]/div/div[1]/div/div[2]/div[1]/div/button[2]/span'
        )
      ),
      10000
    );

    //click on zoom button
    await driver
      .findElement(
        By.xpath(
          '//*[@id="root"]/div/div[1]/div/div[2]/div[1]/div/button[2]/span'
        )
      )
      .click();

    //click a second time on the zoom butotn (to display an art on the map)
    await driver
      .findElement(
        By.xpath(
          '//*[@id="root"]/div/div[1]/div/div[2]/div[1]/div/button[2]/span'
        )
      )
      .click();

    //wait for the art to show on screen
    await driver.wait(
      until.elementLocated(
        By.css(
          '#root > div > div:nth-child(1) > div > div.overlays > div.mapboxgl-marker > svg'
        )
      ),
      5000
    );

    // click on art
    await driver
      .findElement(
        By.css(
          '#root > div > div:nth-child(1) > div > div.overlays > div.mapboxgl-marker > svg'
        )
      )
      .click();

    // scroll inside the popup to show all the details of the art
    await driver.executeScript(`
        const popUp = document.querySelector("#root > div > div.popupCard2");
        popUp.scrollTo(0, document.body.scrollHeight);
        `);

    // verify that the image is displayed
    assert(
      (await driver
        .findElement(
          By.css(
            '#carouselExampleCaptions > div.carousel-inner.relative.w-full.overflow-hidden > div > div > img'
          )
        )
        .isDisplayed()) === true,
      'image of art is not displayed'
    );

    console.log('image displayed correctly');

    assert(
      (await driver
        .findElement(
          By.css('#root > div > div.popupCard2 > div.px-6.py-4 > div')
        )
        .isDisplayed()) === true,
      'title of artwork is not displayed'
    );

    console.log('title is displayed correctly');

    assert(
      (await driver
        .findElement(
          By.css(
            '#root > div > div.popupCard2 > div.px-6.py-4 > blockquote > p'
          )
        )
        .isDisplayed()) === true,
      'description of artwork is not displayed'
    );

    console.log('description is displayed correctly !');

    assert(
      (await driver
        .findElement(
          By.xpath('//*[@id="root"]/div/div[3]/div[2]/figcaption/div[1]')
        )
        .isDisplayed()) === true,
      'artist name is not displayed'
    );

    console.log('artist name displayed correctly !');

    assert(
      (await driver
        .findElement(
          By.xpath('//*[@id="root"]/div/div[3]/div[2]/figcaption/div[2]')
        )
        .isDisplayed()) === true,
      'Location is not displayed'
    );
    console.log('location is displayed properly !');
  } finally {
    await driver.sleep(2000);
    await driver.quit();
  }
})();
