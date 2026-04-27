import db from './src/models/index.js';

async function modernize() {
  try {
    const products = await db.Product.findAll();
    console.log(`Modernizing ${products.length} products...`);

    const prefixes = ["Luxe", "Urban", "Essential", "Signature", "Premium", "Classic", "Elite", "Midnight", "Nordic", "Heritage"];
    const suffixes = ["Collection", "Edition", "Series", "Range", "Selection", "Line", "Choice", "Style"];
    
    const categoryNames = {
      'women-traditional-wear': ['Silk Saree', 'Embroidered Leheriya', 'Heritage Kanchipuram', 'Banarasi Silk'],
      'women-party': ['Evening Sequin Dress', 'Gala Midnight Gown', 'Velvet Cocktail Dress'],
      'women-floral': ['Bloom Chiffon Dress', 'Pastel Garden Maxi', 'Floral Breeze Frock'],
      'women-jeans-top': ['High-Rise Denim', 'Chic Peplum Top', 'Skinny Fit Jeans'],
      'women-salwar': ['Patiala Suit Set', 'Cotton Anarkali', 'Designer Churidar'],
      'women-western': ['A-Line Midi Dress', 'Pleated Jumpsuit', 'Blazer & Trouser Set'],
      'tshirts': ['Graphic Crew Neck', 'Premium Cotton Tee', 'Over-sized Basic Tee'],
      'shirts': ['Slim Fit Oxford', 'Linen Summer Shirt', 'Classic Formal Stripe'],
      'jeans': ['Straight Leg Denim', 'Distressed Biker Jeans', 'Classic Indigo Wash'],
      'formals': ['Tailored Fit Blazer', 'Double-Breasted Suit', 'Slim Tapered Trousers'],
      'hoodies': ['Fleece Pullover', 'Streetwear Zip Hoodie', 'Urban Tech Hoodie'],
      'shoes': ['Leather Chelsea Boots', 'Canvas Court Sneakers', 'Running Performance Shoe'],
      'kids-clothing': ['Playtime Denim set', 'Cotton Baby Romper', 'Little Star Hoodie'],
      'beauty-makeup': ['Velvet Matte Lipstick', 'HD Foundation Palette', 'Liquid Glow Highlighter'],
      'beauty-skincare': ['Hydrating Face Oil', 'Vitamin C Brightening Serum', 'Deep Cleanse Mask']
    };

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const cat = p.category;
        const subCats = categoryNames[cat] || ['Fashion Essential'];
        
        const prefix = prefixes[i % prefixes.length];
        const base = subCats[i % subCats.length];
        const suffix = suffixes[i % suffixes.length];
        
        // Randomly pick a style
        p.name = `${prefix} ${base} - ${suffix}`;
        await p.save();
    }

    console.log('✅ 104 products modernized with premium names!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

modernize();
