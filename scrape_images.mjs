import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.rrgranites.co.uk/products', { waitUntil: 'networkidle2' });

  // Get all images
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt
    }));
  });

  console.log(JSON.stringify(images, null, 2));

  await browser.close();
})();
