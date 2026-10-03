const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const result = [];
  for (let page = 1; page <= 5; page++) {
    try {
      const data = await fetch(`https://gearvn.com/collections/laptop/products.json?limit=50&page=${page}`);
      if (data && data.products) {
        for (const p of data.products) {
          if (p.images && p.images[0]) {
            result.push({
              title: p.title,
              handle: p.handle,
              image: p.images[0].src
            });
          }
        }
      }
    } catch (e) {
      console.error('Page ' + page + ' error:', e.message);
    }
  }
  fs.writeFileSync('scripts/gearvn-laptops.json', JSON.stringify(result, null, 2));
  console.log('Fetched ' + result.length + ' laptops from GearVN!');
}

run();
