import { INITIAL_PRODUCTS } from './src/productData.js';

const ids = new Set();
const duplicates = [];

INITIAL_PRODUCTS.forEach(p => {
    if (ids.has(p.id)) {
        duplicates.push(p.id);
    }
    ids.add(p.id);
});

if (duplicates.length > 0) {
    console.log('Duplicate IDs found:', duplicates);
} else {
    console.log('No duplicate IDs found.');
}
