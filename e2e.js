const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080"],
      executablePath: '/usr/bin/google-chrome',  // Replace with your Chrome path
    //   slowMo:100
    });

    const page = await browser.newPage();
    await page.goto("http://localhost:3000/");


    const buttonToClick = ".viewBtn"
    
    await page.waitForSelector(buttonToClick)
    await page.click(buttonToClick)
    const cartBtn = ".cart"
    await page.waitForSelector(cartBtn)
    await page.click(cartBtn)
    // Don't forget to close the browser when you're done
    // await browser.close();
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();