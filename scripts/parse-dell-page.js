const fs = require('fs');

const path = 'C:/Users/Admin/.gemini/antigravity-ide/brain/12ddfc0b-7e09-4aee-9a13-9c8aabd7400e/.system_generated/steps/145/content.md';
const content = fs.readFileSync(path, 'utf8');

const matches = [...content.matchAll(/<div class="box-image"[\s\S]*?<div class="box-text[\s\S]*?<\/div>\s*<\/div>/gi)];

console.log('Matches on /laptop-dell/:', matches.length);

const items = [];
for (const m of matches) {
  const block = m[0];
  const titleM = block.match(/<p class="name product-title[^"]*"><a[^>]*>([\s\S]*?)<\/a>/i);
  const imgM = block.match(/<img[^>]+(?:data-src|src)="([^"]+)"/i);
  const priceM = block.match(/<span class="woocommerce-Price-amount amount">([\s\S]*?)<\/span>/i);
  
  if (titleM) {
    let title = titleM[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&#8211;/g, '-')
      .replace(/&#8243;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#215;/g, 'x')
      .trim();
    const img = imgM ? imgM[1] : '';
    let priceStr = priceM ? priceM[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').replace(/&#8363;/g, '').replace(/[^\d]/g, '').trim() : '';
    let price = priceStr ? parseInt(priceStr, 10) : 0;
    items.push({ title, img, price });
  }
}

console.log('Total parsed items:', items.length);
items.forEach((it, idx) => console.log(`${idx+1}. ${it.title} | ${it.price} đ`));
