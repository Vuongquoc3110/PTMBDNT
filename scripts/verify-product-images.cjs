const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '..', 'data', 'products.ts');
const source = fs.readFileSync(sourceFile, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const loadedModule = { exports: {} };
new Function('require', 'module', 'exports', compiled)(require, loadedModule, loadedModule.exports);

const products = loadedModule.exports.products || [];
const fallbackProducts = products.filter((product) => product.image.includes('picsum.photos'));
const identities = products.map((product) => {
  const imageUrl = new URL(product.image);
  const lock = imageUrl.hostname === 'loremflickr.com' ? `?lock=${imageUrl.searchParams.get('lock')}` : '';
  return `${imageUrl.origin}${imageUrl.pathname}${lock}`;
});
const duplicates = identities.filter((identity, index) => identities.indexOf(identity) !== index);

console.log(`product_count ${products.length}`);
console.log(`duplicate_images ${duplicates.length}`);
console.log(`generic_fallbacks ${fallbackProducts.length}`);
for (const product of fallbackProducts.filter((item) => ['gaming-pc', 'accessories'].includes(item.category_id))) {
  console.log(`${product.id}\t${product.category_id}\t${product.name}`);
}
if (duplicates.length > 0) {
  console.error([...new Set(duplicates)].join('\n'));
  process.exitCode = 1;
}