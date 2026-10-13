require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const { searchLiveProducts } = require('../services/quickCommerceService');
const Product = require('../models/Product');

async function syncAndStore() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI in environment.');
    return;
  }

  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || 'product_search_automation'
  });
  console.log('[DB] MongoDB Atlas connected successfully.');

  const queries = ['popular', 'milk', 'smartphones', 'headphones', 'tea', 'chocolate'];
  let totalSaved = 0;

  for (const q of queries) {
    console.log(`[API] Fetching live products for: "${q}"...`);
    try {
      const result = await searchLiveProducts({ query: q });
      const prods = result?.products || [];
      console.log(`[API] Retrieved ${prods.length} live products for "${q}".`);

      for (const p of prods) {
        const title = p.name || p.title;
        if (!title) continue;

        let comp = [];
        if (Array.isArray(p.comparison) && p.comparison.length > 0) {
          comp = p.comparison.map(c => ({
            name: c.store || 'BlinkIt',
            price: c.price || p.price || 0,
            originalPrice: c.originalPrice || 0,
            inStock: c.availability !== 'Out of Stock',
            url: c.deeplink || c.url || c.link || '',
            deeplink: c.deeplink || c.url || c.link || '',
            link: c.deeplink || c.url || c.link || '',
            product_link: c.deeplink || c.url || c.link || '',
            rating: (Number.isFinite(c.rating) && c.rating > 0) ? c.rating : null
          }));
        } else {
          comp = [{
            name: p.store || 'BlinkIt',
            price: p.price || 0,
            originalPrice: p.originalPrice || 0,
            inStock: true,
            url: p.deeplink || p.url || p.link || '',
            deeplink: p.deeplink || p.url || p.link || '',
            link: p.deeplink || p.url || p.link || '',
            product_link: p.deeplink || p.url || p.link || ''
          }];
        }

        await Product.findOneAndUpdate(
          { title },
          {
            $set: {
              title,
              category: p.category || 'General',
              brand: p.brand || '',
              image: p.image || '',
              currentPrice: p.price || 0,
              originalPrice: p.originalPrice || 0,
              discount: p.discount || '',
              rating: (Number.isFinite(p.rating) && p.rating > 0) ? p.rating : null,
              reviewsCount: (Number.isFinite(p.reviews) && p.reviews > 0) ? p.reviews : null,
              availability: 'In Stock',
              platforms: comp,
              source: 'Quick Commerce API',
              searchQuery: q
            }
          },
          { upsert: true }
        );
        totalSaved++;
      }
    } catch (err) {
      console.error(`[API Error] for "${q}":`, err.message);
    }
  }

  const dbCount = await Product.countDocuments();
  console.log(`[DONE] Total live products upserted: ${totalSaved}. Current MongoDB catalog size: ${dbCount}.`);
  await mongoose.connection.close();
}

syncAndStore().catch(console.error);

