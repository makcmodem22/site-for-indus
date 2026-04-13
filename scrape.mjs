import https from 'https';

https.get('https://unsplash.com/s/photos/luxury-kitchen-island', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const urls = new Set();
    const regex = /"(https:\/\/(?:images|plus)\.unsplash\.com\/[^\"]+?w=800\b[^\"]*)"/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      urls.add(match[1]);
    }
    console.log(Array.from(urls).slice(0, 10).join('\n'));
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
