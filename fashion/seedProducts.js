import fs from 'fs';
import path from 'path';
import { sequelize, createDatabase } from './.vscode/src/config/db.js';
import Product from './.vscode/src/modules/product/product.model.js';

/**
 * Sequelize Seed Script
 * Scans the current directory for 80+ images and inserts them into the Products table.
 */
async function seedProducts() {
  try {
    console.log("-----------------------------------------");
    console.log("🚀 INITIALIZING SEEDING PROCESS");
    console.log("-----------------------------------------");

    // 1. Ensure the PostgreSQL database exists
    await createDatabase();

    // 2. Authenticate the connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // 3. Sync Models (Ensures table exists before seeding)
    // This satisfies the requirement to run after sequelize.sync()
    console.log("🔄 Syncing Product model with the database...");
    await sequelize.sync(); 
    console.log("✅ Models synced. Products table is ready.");

    // 4. Scan for images in the current directory (D:\fashion)
    const currentDir = process.cwd(); 
    const files = fs.readdirSync(currentDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    
    const imageFiles = files.filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));

    if (imageFiles.length === 0) {
      console.log("⚠️ No image files found in the root directory. Process aborted.");
      process.exit(0);
    }

    console.log(`📦 Found ${imageFiles.length} images. Preparing data for bulk insertion...`);

    // 5. Map files to Product objects
    const productsData = imageFiles.map((file, index) => {
      const fileName = path.parse(file).name;
      
      // Formatting name: "skinny_jeans" -> "Skinny Jeans"
      const formattedName = fileName
        .split(/[-_ ]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      // Randomizing attributes for variety
      const brands = ["F@shionc@rt", "UrbanStyle", "LuxeWear", "Arito", "Nexa"];
      const categories = ["Men", "Women", "Kids", "Accessories", "Footwear"];

      // Logic to assign categories based on filenames
      let category = "General";
      const lowerName = fileName.toLowerCase();
      if (lowerName.includes('kid')) category = "Kids";
      else if (lowerName.includes('soap')) category = "Body Care";
      else if (lowerName.includes('saree') || lowerName.includes('kurt') || lowerName.includes('gown')) category = "Women Ethnic";
      else if (lowerName.includes('shirt') || lowerName.includes('top') || lowerName.includes('blazer')) category = "Tops";
      else if (lowerName.includes('jeans') || lowerName.includes('deni') || lowerName.includes('trouser')) category = "Bottoms";
      else if (lowerName.includes('heel') || lowerName.includes('boot') || lowerName.includes('loaf')) category = "Footwear";

      return {
        name: formattedName,
        brand: brands[index % brands.length],
        originalPrice: Math.floor(Math.random() * (5000 - 500 + 1)) + 500, // Random price between 500 and 5000
        discount: Math.floor(Math.random() * 30), // Random discount 0-30%
        rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)), // Rating 3.5 - 5.0
        reviews: Math.floor(Math.random() * 500),
        description: `Premium quality ${formattedName}. This ${category} product is designed for comfort and style. Ideal for all-day wear.`,
        image: file, // Store the filename directly
        category: category,
        stock: Math.floor(Math.random() * 100) + 15, // Stock between 15 and 115
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // 6. Bulk Create products
    console.log(`💾 Inserting ${productsData.length} products into the database using bulkCreate...`);
    await Product.bulkCreate(productsData);

    console.log("-----------------------------------------");
    console.log(`✨ SUCCESS: Seeding completed!`);
    console.log(`✅ ${productsData.length} records added to the Products table.`);
    console.log("-----------------------------------------");

  } catch (error) {
    console.error("\n❌ ERROR OCCURRED DURING SEEDING:");
    console.error(error.message);
  } finally {
    // 7. Cleanup
    await sequelize.close();
    console.log("🔌 Database connection closed.");
    process.exit();
  }
}

// Start the seeder
seedProducts();
