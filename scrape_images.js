async function scrape() {
  const res = await fetch('https://www.rrgranites.co.uk/products');
  const text = await res.text();
  
  // Find all urls starting with https://static.wixstatic.com/media/
  const matches = text.match(/https:\/\/static\.wixstatic\.com\/media\/[^"'\s]+/g) || [];
  
  // Filter unique
  const uniqueUrls = [...new Set(matches)];
  
  uniqueUrls.forEach(url => console.log(url));
}

scrape();
