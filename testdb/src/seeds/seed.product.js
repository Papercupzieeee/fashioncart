import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/models/index.js';

/**
 * Sequelize Seed Script for D:\testdb
 * FIXED CATEGORIES: uses the exact keys expected by the frontend logic.
 */
async function seedProducts() {
  try {
    console.log("-----------------------------------------");
    console.log("🚀 STARTING CATEGORY-FIXED SEEDING");
    console.log("-----------------------------------------");

    await db.sequelize.authenticate();
    console.log("✅ Database connection established.");

    // Syncing models
    await db.sequelize.sync({ alter: true }); 
    console.log("✅ Models synced.");

    // TRUNCATE EXISTING PRODUCTS
    console.log("🧹 Clearing existing products...");
    await db.Product.destroy({ where: {}, truncate: { cascade: true }, restartIdentity: true });

    // Path setup
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const uploadDir = path.join(scriptDir, 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
        console.log("❌ Error: 'uploads' folder not found.");
        process.exit(1);
    }

    const files = fs.readdirSync(uploadDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    const imageFiles = files.filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));

    console.log(`📦 Found ${imageFiles.length} images. Mapping to subcategories...`);

    const productsData = imageFiles.map((file, index) => {
      const fileName = path.parse(file).name;
      const lowerName = fileName.toLowerCase();
      
      // Formatting name
      const formattedName = fileName
        .split(/[-_ ]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      // 🎯 SUB-CATEGORY LOGIC MAPPED TO FRONTEND FILTERING
      let category = "shirts"; 
      
      if (lowerName.includes('kid')) {
        const kidCats = ['kids-clothing', 'kids-footwear', 'kids-accessories', 'kids-outfits', 'kids-sports', 'kids-toys'];
        category = kidCats[index % kidCats.length];
      } else if (lowerName.includes('soap')) {
        const beautyCats = ['beauty-makeup', 'beauty-skincare', 'beauty-haircare', 'beauty-fragrance', 'beauty-tools', 'beauty-bath'];
        category = beautyCats[index % beautyCats.length];
      } else if (
        lowerName.includes('saree') || lowerName.includes('kurt') || 
        lowerName.includes('chudi') || lowerName.includes('salwar') || 
        lowerName.includes('gown') || lowerName.includes('floral') || 
        lowerName.includes('crop') || lowerName.includes('maxi') || 
        lowerName.includes('pink') || lowerName.includes('frock') ||
        lowerName.includes('mu') || lowerName.includes('anar') ||
        lowerName.includes('silk') || lowerName.includes('partwear')
      ) {
        // Women subcategories
        if (lowerName.includes('saree') || lowerName.includes('kurt') || lowerName.includes('anar') || lowerName.includes('mu')) {
          category = "women-traditional-wear";
        } else if (lowerName.includes('maxi') || lowerName.includes('gown') || lowerName.includes('evening') || lowerName.includes('party')) {
          category = "women-party";
        } else if (lowerName.includes('floral')) {
          category = "women-floral";
        } else if (lowerName.includes('top') || lowerName.includes('jean')) {
          category = "women-jeans-top";
        } else if (lowerName.includes('salwar') || lowerName.includes('chudi')) {
          category = "women-salwar";
        } else {
          category = "women-western";
        }
      } else {
        // Men subcategories
        if (lowerName.includes('tshirt') || lowerName.includes('round') || lowerName.includes('neck')) {
          category = "tshirts";
        } else if (lowerName.includes('shirt')) {
          category = "shirts";
        } else if (lowerName.includes('jeans') || lowerName.includes('denim')) {
          category = "jeans";
        } else if (lowerName.includes('blazer') || lowerName.includes('trouser') || lowerName.includes('formal')) {
          category = "formals";
        } else if (lowerName.includes('hoodie') || lowerName.includes('zip') || lowerName.includes('wh') || lowerName.includes('st') || lowerName.includes('ic')) {
          category = "hoodies";
        } else if (lowerName.includes('shoe') || lowerName.includes('loaf') || lowerName.includes('boots') || lowerName.includes('br')) {
          category = "shoes";
        } else {
          category = "shirts";
        }
      }

      const brands = ["FashionCart", "UrbanStyle", "LuxeWear", "StyleHub", "Arito"];

      return {
        name: formattedName,
        brand: brands[index % brands.length],
        originalPrice: Math.floor(Math.random() * (4500 - 800) + 800),
        discount: Math.floor(Math.random() * 50), // 0-50%
        rating: parseFloat((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
        reviews: Math.floor(Math.random() * 500),
        description: `Premium quality ${formattedName}. Designed for ultimate style and comfort. A must-have for the new season.`,
        image: file,
        category: category,
        stock: Math.floor(Math.random() * 100) + 20,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    console.log(`💾 Inserting ${productsData.length} records into database...`);
    await db.Product.bulkCreate(productsData);

    console.log("-----------------------------------------");
    console.log("✨ SUCCESS: Seeding completed!");
    console.log(`✅ All ${productsData.length} products mapped to correct sub-categories.`);
    console.log("-----------------------------------------");

  } catch (error) {
    console.error("❌ ERROR:", error.message);
  } finally {
    await db.sequelize.close();
    process.exit();
  }
}

seedProducts();
