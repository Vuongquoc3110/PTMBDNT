const fs = require('fs');

const path = 'C:/Users/Admin/.gemini/antigravity-ide/brain/12ddfc0b-7e09-4aee-9a13-9c8aabd7400e/.system_generated/steps/25/content.md';
const content = fs.readFileSync(path, 'utf8');

// Find all products by splitting on col-inner or product-small
const productRegex = /<div class="col-inner">([\s\S]*?)<\/div>\s*<\/div>/gi;
// Better: regex for each product block
const matches = [...content.matchAll(/<div class="box-image"[\s\S]*?<div class="box-text[\s\S]*?<\/div>\s*<\/div>/gi)];

console.log('Matches length:', matches.length);

const items = [];
for (const m of matches) {
  const block = m[0];
  const titleM = block.match(/<p class="name product-title[^"]*"><a[^>]*>([\s\S]*?)<\/a>/i);
  const imgM = block.match(/<img[^>]+(?:data-src|src)="([^"]+)"/i);
  const priceM = block.match(/<span class="woocommerce-Price-amount amount">([\s\S]*?)<\/span>/i);
  
  if (titleM) {
    const title = titleM[1].replace(/<[^>]+>/g, '').trim().replace(/&#8211;/g, '-').replace(/&#8243;/g, '"').replace(/&#8221;/g, '"').replace(/&#215;/g, 'x');
    const img = imgM ? imgM[1] : '';
    let priceStr = priceM ? priceM[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim() : '';
    items.push({ title, img, priceStr });
  }
}

console.log('Parsed items:', items.length);
console.log(JSON.stringify(items.slice(0, 30), null, 2));
