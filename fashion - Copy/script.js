/* ============================================
   F@shionc@rt-INSPIRED E-COMMERCE WEBSITE
   Main JavaScript File
   ============================================ */

// Global products array - will be loaded from backend
let PRODUCTS = [];
const BACKEND_BASE = 'http://localhost:5000';
const BACKEND_IMAGE_BASE = `${BACKEND_BASE}/uploads/`;

async function loadProducts() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    // Rule 7 Fix: Context-aware fetch if category is set
    let fetchUrl = `${BACKEND_BASE}/api/products`;
    if (category && category !== 'all' && document.body.id !== 'home-page') {
      fetchUrl += `?category=${category}`;
    }

    const response = await fetch(fetchUrl);

    console.log('[loadProducts] HTTP status:', response.status, response.statusText); // ✅ now works

    if (response.ok) {
      const result = await response.json();

      console.log('[loadProducts] Raw API response:', result);

      let fetched = [];

      if (Array.isArray(result)) {
        fetched = result;
      } else if (result && Array.isArray(result.data)) {
        fetched = result.data;
      } else if (result && Array.isArray(result.products)) {
        fetched = result.products;
      } else {
        console.warn('[loadProducts] Unexpected response shape:', result);
        fetched = [];
      }

      console.log('[loadProducts] Products extracted:', fetched.length);

      if (!fetched.length) {
        console.warn('[loadProducts] Empty API products; using fallback product catalog');
        PRODUCTS = [...products];
        return PRODUCTS;
      }

      PRODUCTS = fetched;
      return PRODUCTS;
    } else {
      console.error('[loadProducts] ❌ HTTP error:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('[loadProducts] ❌ Fetch failed:', error.message);
  }

  console.warn('[loadProducts] ⚠️ Using fallback products');
  PRODUCTS = [...products];
  return PRODUCTS;
}
// Sample product data with realistic attributes (removed - now loaded from backend)

const MEN_SUBCATEGORIES = ['shirts', 'tshirts', 'jeans', 'formals', 'hoodies', 'shoes'];
const WOMEN_SUBCATEGORIES = ['women-shirts', 'women-tshirts', 'women-jeans', 'women-formals', 'women-shoes', 'women-accessories', 'women-beauty', 'women-traditional-wear', 'women-western', 'women-salwar', 'women-floral', 'women-jeans-top', 'women-party'];
const KIDS_SUBCATEGORIES = ['kids-clothing', 'kids-footwear', 'kids-accessories', 'kids-outfits', 'kids-sports', 'kids-toys'];
const BEAUTY_SUBCATEGORIES = ['beauty-makeup', 'beauty-skincare', 'beauty-haircare', 'beauty-fragrance', 'beauty-tools', 'beauty-bath'];
const products = [
  {

    id: 3,
    name : "Summer Floral Dress",
    brand: "FOREVER 21",
    price: 1899,
    originalPrice: 3499,
    discount: 46,
    rating: 4.4,
    reviews: 287,
    image: "floral.jpg",
    category: "women-fashion",
    description: "Beautiful summer floral dress perfect for any occasion. Light and breathable fabric.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 4,
    name: "Black Sneakers",
    brand: "NIKE",
    price: 4999,
    originalPrice: 7499,
    discount: 33,
    rating: 4.7,
    reviews: 891,
    image: "flared.jpg",
    category: "shirts",
    description: "Comfortable black sneakers with modern design. Perfect for casual and sports wear.",
    sizes: ["6", "7", "8", "9", "10", "11", "12"]
  },
  {
    id: 5,
    name: "Striped Polo Shirt",
    brand: "TOMMY HILFIGER",
    price: 2199,
    originalPrice: 4399,
    discount: 50,
    rating: 4.5,
    reviews: 445,
    image: "blazer.jpg",
    category: "shirts",
    description: "Classic striped polo shirt in premium quality. Great for both casual and formal wear.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  
  {
    id: 7,
    name: "Casual Chinos",
    brand: "PETER ENGLAND",
    price: 1799,
    originalPrice: 3599,
    discount: 50,
    rating: 4.4,
    reviews: 378,
    image: "co.jpg",
    category: "formals",
    description: "Smart casual chinos perfect for everyday wear. Comfortable and stylish.",
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 8,
    name: "Sports Backpack",
    brand: "DECATHLON",
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    rating: 4.6,
    reviews: 534,
    image: "s.jpg",
    category: "Accessories",
    description: "Durable sports backpack with multiple compartments. Perfect for gym and travel.",
    sizes: ["One Size"]
  },
  {
    id: 9,
    name: "Beauty Essentials Kit",
    brand: "MAC",
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    rating: 4.7,
    reviews: 456,
    image: "soap24.jpg",
    category: "beauty-makeup",
    description: "Complete beauty essentials kit with premium quality products.",
    sizes: ["One Size"]
  },
  {
    id: 10,
    name: "Kids Adventure Jacket",
    brand: "MOTHERCARE",
    price: 899,
    originalPrice: 1799,
    discount: 50,
    rating: 4.5,
    reviews: 267,
    image: "kid1.jpg",
    category: "kids-clothing",
    description: "Colorful and comfortable jacket for kids. Perfect for outdoor adventures.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 61,
    name: "Kids Sport Sneakers",
    brand: "PUMA",
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    rating: 4.4,
    reviews: 210,
    image: "kid2.jpg",
    category: "kids-footwear",
    description: "Comfortable sneakers for kids to run and play.",
    sizes: ["10", "11", "12", "13"]
  },
  {
    id: 62,
    name: "Kids Cartoon Hoodie",
    brand: "MINISO",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.2,
    reviews: 145,
    image: "kid3.jpg",
    category: "kids-clothing",
    description: "Warm cartoon hoodie for playful kids.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 63,
    name: "Kids Party Dress",
    brand: "BABY HUG",
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    rating: 4.6,
    reviews: 182,
    image: "kid4.jpg",
    category: "kids-outfits",
    description: "Cute party dress for special celebrations.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 64,
    name: "Kids Fun Backpack",
    brand: "DECATHLON",
    price: 799,
    originalPrice: 1599,
    discount: 50,
    rating: 4.3,
    reviews: 120,
    image: "kid5.jpg",
    category: "kids-accessories",
    description: "Durable backpack perfect for school and trips.",
    sizes: ["One Size"]
  },
  {
    id: 65,
    name: "Kids Soccer Tee",
    brand: "ADIDAS",
    price: 1099,
    originalPrice: 2199,
    discount: 50,
    rating: 4.4,
    reviews: 154,
    image: "kid6.jpg",
    category: "kids-sports",
    description: "Breathable sports tee for active kids.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 66,
    name: "Kids Toy Set",
    brand: "TOY STORY",
    price: 499,
    originalPrice: 999,
    discount: 50,
    rating: 4.5,
    reviews: 93,
    image: "kid7.jpg",
    category: "kids-toys",
    description: "Fun playset to keep kids entertained for hours.",
    sizes: ["One Size"]
  },
  {
    id: 67,
    name: "Glow Serum",
    brand: "Olay",
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    rating: 4.6,
    reviews: 275,
    image: "soap23.jpg",
    category: "beauty-skincare",
    description: "Hydrating glow serum for radiant skin.",
    sizes: ["One Size"]
  },
  {
    id: 68,
    name: "Perfume Mist",
    brand: "Dior",
    price: 3799,
    originalPrice: 7599,
    discount: 50,
    rating: 4.7,
    reviews: 215,
    image: "soap22.jpg",
    category: "beauty-fragrance",
    description: "Light and elegant fragrance mist for everyday use.",
    sizes: ["One Size"]
  },
  {
    id: 69,
    name: "Makeup Brush Set",
    brand: "Sephora",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.5,
    reviews: 198,
    image: "soap21.jpg",
    category: "beauty-tools",
    description: "Premium brush set for flawless makeup application.",
    sizes: ["One Size"]
  },
  {
    id: 70,
    name: "Bath Bomb Box",
    brand: "LUSH",
    price: 699,
    originalPrice: 1399,
    discount: 50,
    rating: 4.6,
    reviews: 133,
    image: "soap20.jpg",
    category: "beauty-bath",
    description: "Relaxing bath bomb set for soothing spa-like baths.",
    sizes: ["One Size"]
  },
  {
    id: 71,
    name: "Hair Repair Oil",
    brand: "Matrix",
    price: 1599,
    originalPrice: 3199,
    discount: 50,
    rating: 4.4,
    reviews: 186,
    image: "soap19.jpg",
    category: "beauty-haircare",
    description: "Nourishing hair oil for shine and strength.",
    sizes: ["One Size"]
  },
  {
    id: 72,
    name: "Lipstick Palette",
    brand: "MAC",
    price: 2199,
    originalPrice: 4399,
    discount: 50,
    rating: 4.7,
    reviews: 252,
    image: "soap18.jpg",
    category: "beauty-makeup",
    description: "Vibrant lipstick palette for every mood.",
    sizes: ["One Size"]
  },
  {
    id: 73,
    name: "Kids Denim Jacket",
    brand: "US POLO",
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    rating: 4.5,
    reviews: 190,
    image: "kid8.jpg",
    category: "kids-clothing",
    description: "Durable denim jacket for cool kids on chilly days.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 74,
    name: "Kids Cotton Tee",
    brand: "GAP",
    price: 699,
    originalPrice: 1399,
    discount: 50,
    rating: 4.3,
    reviews: 145,
    image: "kid9.jpg",
    category: "kids-clothing",
    description: "Soft cotton tee for everyday comfort.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 75,
    name: "Kids Running Shoes",
    brand: "PUMA",
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    rating: 4.6,
    reviews: 205,
    image: "kid10.jpg",
    category: "kids-footwear",
    description: "Lightweight running shoes built for active kids.",
    sizes: ["10", "11", "12", "13"]
  },
  {
    id: 76,
    name: "Kids Casual Sandals",
    brand: "CROCS",
    price: 799,
    originalPrice: 1599,
    discount: 50,
    rating: 4.2,
    reviews: 132,
    image: "kid11.jpg",
    category: "kids-footwear",
    description: "Easy-wear sandals for summer fun.",
    sizes: ["10", "11", "12", "13"]
  },
  {
    id: 77,
    name: "Kids School Sneakers",
    brand: "NIKE",
    price: 1399,
    originalPrice: 2799,
    discount: 50,
    rating: 4.5,
    reviews: 170,
    image: "kid12.jpg",
    category: "kids-footwear",
    description: "Durable school sneakers designed for comfort.",
    sizes: ["10", "11", "12", "13"]
  },
  {
    id: 78,
    name: "Kids Sun Hat",
    brand: "F&F",
    price: 499,
    originalPrice: 999,
    discount: 50,
    rating: 4.3,
    reviews: 98,
    image: "kid13.jpg",
    category: "kids-accessories",
    description: "Cute and protective sun hat for outdoor play.",
    sizes: ["One Size"]
  },
  {
    id: 79,
    name: "Kids Wristwatch",
    brand: "TIMEX",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.4,
    reviews: 88,
    image: "kid14.jpg",
    category: "kids-accessories",
    description: "Fun digital watch for everyday wear.",
    sizes: ["One Size"]
  },
  {
    id: 80,
    name: "Kids Sunglasses",
    brand: "SUNGLAM",
    price: 799,
    originalPrice: 1599,
    discount: 50,
    rating: 4.5,
    reviews: 110,
    image: "kid15.jpg",
    category: "kids-accessories",
    description: "Stylish sunglasses made for little explorers.",
    sizes: ["One Size"]
  },
  {
    id: 81,
    name: "Kids Pajama Set",
    brand: "CARTER'S",
    price: 899,
    originalPrice: 1799,
    discount: 50,
    rating: 4.6,
    reviews: 130,
    image: "kid16.jpg",
    category: "kids-outfits",
    description: "Soft pajama set for a cozy bedtime.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 82,
    name: "Kids School Uniform",
    brand: "LITTLECHAMPS",
    price: 1099,
    originalPrice: 2199,
    discount: 50,
    rating: 4.4,
    reviews: 145,
    image: "kid17.jpg",
    category: "kids-outfits",
    description: "Comfortable school uniform for everyday wear.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 83,
    name: "Kids Swim Set",
    brand: "ARENA",
    price: 1199,
    originalPrice: 2399,
    discount: 50,
    rating: 4.3,
    reviews: 95,
    image: "kid18.jpg",
    category: "kids-outfits",
    description: "Vibrant swim set perfect for pool days.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 84,
    name: "Kids Training Shorts",
    brand: "ADIDAS",
    price: 799,
    originalPrice: 1599,
    discount: 50,
    rating: 4.5,
    reviews: 120,
    image: "kid19.jpg",
    category: "kids-sports",
    description: "Breathable training shorts for active kids.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 85,
    name: "Kids Baseball Cap",
    brand: "PUMA",
    price: 499,
    originalPrice: 999,
    discount: 50,
    rating: 4.2,
    reviews: 102,
    image: "kid20.jpg",
    category: "kids-sports",
    description: "Sporty cap ideal for outdoor games.",
    sizes: ["One Size"]
  },
  {
    id: 86,
    name: "Kids Sports Jersey",
    brand: "NIKE",
    price: 1099,
    originalPrice: 2199,
    discount: 50,
    rating: 4.4,
    reviews: 110,
    image: "kid21.jpg",
    category: "kids-sports",
    description: "Team-style jersey for kids who love sports.",
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"]
  },
  {
    id: 87,
    name: "Kids Puzzle Game",
    brand: "LEGO",
    price: 699,
    originalPrice: 1399,
    discount: 50,
    rating: 4.7,
    reviews: 98,
    image: "kid22.jpg",
    category: "kids-toys",
    description: "Fun puzzle game for building creativity.",
    sizes: ["One Size"]
  },
  {
    id: 88,
    name: "Kids Building Blocks",
    brand: "MEGA BLOKS",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.6,
    reviews: 105,
    image: "kid23.jpg",
    category: "kids-toys",
    description: "Colorful blocks for imaginative play.",
    sizes: ["One Size"]
  },
  {
    id: 89,
    name: "Kids Plush Toy",
    brand: "TY",
    price: 499,
    originalPrice: 999,
    discount: 50,
    rating: 4.5,
    reviews: 89,
    image: "kid24.jpg",
    category: "kids-toys",
    description: "Soft plush toy for bedtime cuddles.",
    sizes: ["One Size"]
  },
  {
    id: 90,
    name: "Eyeshadow Palette",
    brand: "NYX",
    price: 1599,
    originalPrice: 3199,
    discount: 50,
    rating: 4.5,
    reviews: 210,
    image: "soap17.jpg",
    category: "beauty-makeup",
    description: "Multi-shade palette for day and night looks.",
    sizes: ["One Size"]
  },
  {
    id: 91,
    name: "Liquid Lipstick",
    brand: "MAYBELLINE",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.4,
    reviews: 190,
    image: "soap16.jpg",
    category: "beauty-makeup",
    description: "Long-wear liquid lipstick with vibrant color.",
    sizes: ["One Size"]
  },
  {
    id: 92,
    name: "Moisturizing Cream",
    brand: "NIVEA",
    price: 899,
    originalPrice: 1799,
    discount: 50,
    rating: 4.6,
    reviews: 220,
    image: "soap15.jpg",
    category: "beauty-skincare",
    description: "Daily moisturiser for smooth, hydrated skin.",
    sizes: ["One Size"]
  },
  {
    id: 93,
    name: "Charcoal Face Wash",
    brand: "BIOTIQUE",
    price: 699,
    originalPrice: 1399,
    discount: 50,
    rating: 4.3,
    reviews: 150,
    image: "soap14.jpg",
    category: "beauty-skincare",
    description: "Purifying face wash for refreshed skin.",
    sizes: ["One Size"]
  },
  {
    id: 94,
    name: "Sheet Mask Pack",
    brand: "TONYMOLY",
    price: 799,
    originalPrice: 1599,
    discount: 50,
    rating: 4.5,
    reviews: 138,
    image: "soap13.jpg",
    category: "beauty-skincare",
    description: "Hydrating sheet masks for glowing skin.",
    sizes: ["One Size"]
  },
  {
    id: 95,
    name: "Eau de Parfum",
    brand: "CHANEL",
    price: 4999,
    originalPrice: 9999,
    discount: 50,
    rating: 4.8,
    reviews: 175,
    image: "soap12.jpg",
    category: "beauty-fragrance",
    description: "Sophisticated fragrance for day and evening.",
    sizes: ["One Size"]
  },
  {
    id: 96,
    name: "Body Mist",
    brand: "VICTORIA'S SECRET",
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    rating: 4.6,
    reviews: 160,
    image: "soap11.jpg",
    category: "beauty-fragrance",
    description: "Fresh body mist for everyday fragrance.",
    sizes: ["One Size"]
  },
  {
    id: 97,
    name: "Aromatic Roller",
    brand: "THE BODY SHOP",
    price: 899,
    originalPrice: 1799,
    discount: 50,
    rating: 4.3,
    reviews: 130,
    image: "soap10.jpg",
    category: "beauty-fragrance",
    description: "Portable roller for a quick scent refresh.",
    sizes: ["One Size"]
  },
  {
    id: 98,
    name: "Makeup Sponge Set",
    brand: "REAL TECHNIQUES",
    price: 699,
    originalPrice: 1399,
    discount: 50,
    rating: 4.4,
    reviews: 145,
    image: "soap9.jpg",
    category: "beauty-tools",
    description: "Soft sponges for flawless foundation application.",
    sizes: ["One Size"]
  },
  {
    id: 99,
    name: "Hair Straightener",
    brand: "CONAIR",
    price: 2799,
    originalPrice: 5599,
    discount: 50,
    rating: 4.5,
    reviews: 170,
    image: "soap8.jpg",
    category: "beauty-tools",
    description: "Fast-heating straightener for sleek styling.",
    sizes: ["One Size"]
  },
  {
    id: 100,
    name: "Facial Cleansing Brush",
    brand: "FOREO",
    price: 3499,
    originalPrice: 6999,
    discount: 50,
    rating: 4.6,
    reviews: 184,
    image: "soap7.jpg",
    category: "beauty-tools",
    description: "Gentle brush for deep cleansing and glow.",
    sizes: ["One Size"]
  },
  {
    id: 101,
    name: "Shower Gel Set",
    brand: "THE BODY SHOP",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.5,
    reviews: 142,
    image: "soap6.jpg",
    category: "beauty-bath",
    description: "Refreshing shower gels for daily use.",
    sizes: ["One Size"]
  },
  {
    id: 102,
    name: "Luxury Soap Bars",
    brand: "LUSH",
    price: 799,
    originalPrice: 1599,
    discount: 50,
    rating: 4.4,
    reviews: 118,
    image: "soap5.jpg",
    category: "beauty-bath",
    description: "Aromatic soap bars for pampering showers.",
    sizes: ["One Size"]
  },
  {
    id: 103,
    name: "Body Lotion",
    brand: "NEUTROGENA",
    price: 799,
    originalPrice: 1599,
    discount: 50,
    rating: 4.3,
    reviews: 135,
    image: "soap4.jpg",
    category: "beauty-bath",
    description: "Nourishing lotion for silky smooth skin.",
    sizes: ["One Size"]
  },
  {
    id: 104,
    name: "Nourishing Shampoo",
    brand: "HERBAL ESSENCES",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.6,
    reviews: 160,
    image: "soap3.jpg",
    category: "beauty-haircare",
    description: "Hydrating shampoo for soft, shiny hair.",
    sizes: ["One Size"]
  },
  {
    id: 105,
    name: "Conditioner Set",
    brand: "SUNDARPAHARI",
    price: 1199,
    originalPrice: 2399,
    discount: 50,
    rating: 4.5,
    reviews: 142,
    image: "soap2.jpg",
    category: "beauty-haircare",
    description: "Smoothing conditioner set for manageable hair.",
    sizes: ["One Size"]
  },
  {
    id: 106,
    name: "Hair Mask Treatment",
    brand: "L'OREAL",
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    rating: 4.7,
    reviews: 176,
    image: "soap1.jpg",
    category: "beauty-haircare",
    description: "Deep repair mask for healthier hair.",
    sizes: ["One Size"]
  },
  {
    id: 11,
    name: "Printed Kurti",
    brand: "GLOBAL DESI",
    price: 1599,
    originalPrice: 3199,
    discount: 50,
    rating: 4.6,
    reviews: 389,
    image: "korrr.jpg",
    category: "women-formals",
    description: "Beautiful printed kurti perfect for festivals and casual wear.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 12,
    name: "Running Shoes",
    brand: "PUMA",
    price: 3999,
    originalPrice: 7999,
    discount: 50,
    rating: 4.5,
    reviews: 678,
    image: "br.jpg",
    category: "shoes",
    description: "High-performance running shoes with advanced cushioning technology.",
    sizes: ["6", "7", "8", "9", "10", "11", "12"]
  },
  {
    id: 13,
    name: "Handbag Tote",
    brand: "FOSSIL",
    price: 3499,
    originalPrice: 6999,
    discount: 50,
    rating: 4.7,
    reviews: 445,
    image: "ski.jpg",
    category: "women-accessories",
    description: "Stylish tote handbag perfect for daily use. Premium quality material.",
    sizes: ["One Size"]
  },
  {
    id: 14,
    name: "Graphic T-Shirt",
    brand: "UNIQLO",
    price: 999,
    originalPrice: 1999,
    discount: 50,
    rating: 4.4,
    reviews: 523,
    image: "swel.jpg",
    category: "tshirts",
    description: "Cool graphic t-shirt with unique designs. Made from soft cotton.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 15,
    name: "Saree with Blouse",
    brand: "BHAMA KADAM",
    price: 2899,
    originalPrice: 5799,
    discount: 50,
    rating: 4.6,
    reviews: 312,
    image: "y.jpg",
    category: "women-formals",
    description: "Traditional saree with matching blouse. Perfect for festivals and celebrations.",
    sizes: ["Free Size"]
  },
  {
    id: 16,
    name: "Cotton Shorts",
    brand: "DECATHLON",
    price: 599,
    originalPrice: 1199,
    discount: 50,
    rating: 4.3,
    reviews: 234,
    image: "cot.jpg",
    category: "formals",
    description: "Comfortable cotton shorts perfect for summer. Lightweight and breathable.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 17,
    name: "Formal Shirt",
    brand: "VAN HEUSEN",
    price: 1899,
    originalPrice: 3799,
    discount: 50,
    rating: 4.5,
    reviews: 200,
    image: "d.jpg",
    category: "shirts",
    description: "Classic formal shirt for office wear.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 18,
    name: "Casual Shirt",
    brand: "ALLEN SOLLY",
    price: 1599,
    originalPrice: 3199,
    discount: 50,
    rating: 4.3,
    reviews: 150,
    image: "casual.jpg",
    category: "shirts",
    description: "Comfortable casual shirt.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 19,
    name: "Denim Shirt",
    brand: "LEE",
    price: 2199,
    originalPrice: 4399,
    discount: 50,
    rating: 4.6,
    reviews: 180,
    image: "red.jpg",
    category: "shirts",
    description: "Stylish denim shirt.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 20,
    name: "V Neck T-Shirt",
    brand: "LEVIS",
    price: 1099,
    originalPrice: 2199,
    discount: 50,
    rating: 4.4,
    reviews: 120,
    image: "grey.jpg",
    category: "tshirts",
    description: "V neck t-shirt.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 21,
    name: "Round Neck T-Shirt",
    brand: "ADIDAS",
    price: 1299,
    originalPrice: 2599,
    discount: 50,
    rating: 4.5,
    reviews: 140,
    image: "round.jpg",
    category: "tshirts",
    description: "Round neck t-shirt.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 22,
    name: "Slim Fit Jeans",
    brand: "PEPE JEANS",
    price: 2799,
    originalPrice: 5599,
    discount: 50,
    rating: 4.7,
    reviews: 250,
    image: "slim.jpg",
    category: "jeans",
    description: "Slim fit jeans.",
    sizes: ["28", "30", "32", "34"]
  },
  {
    id: 23,
    name: "Straight Fit Jeans",
    brand: "LEE COOPER",
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    rating: 4.5,
    reviews: 200,
    image: "jeans.jpg",
    category: "jeans",
    description: "Straight fit jeans.",
    sizes: ["28", "30", "32", "34"]
  },
  {
    id: 24,
    name: "Skinny Jeans",
    brand: "SPYKAR",
    price: 2299,
    originalPrice: 4599,
    discount: 50,
    rating: 4.4,
    reviews: 180,
    image: "skinny.jpg",
    category: "jeans",
    description: "Skinny fit jeans.",
    sizes: ["28", "30", "32", "34"]
  },
  {
    id: 25,
    name: "Formal Trousers",
    brand: "RAYMOND",
    price: 2999,
    originalPrice: 5999,
    discount: 50,
    rating: 4.6,
    reviews: 160,
    image: "trouser.jpg",
    category: "formals",
    description: "Formal trousers.",
    sizes: ["28", "30", "32", "34"]
  },
  {
    id: 26,
    name: "Blazer",
    brand: "BLACKBERRY'S",
    price: 4999,
    originalPrice: 9999,
    discount: 50,
    rating: 4.8,
    reviews: 100,
    image: "blazer.jpg",
    category: "formals",
    description: "Formal blazer.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 27,
    name: "Cotton Hoodie",
    brand: "NIKE",
    price: 3499,
    originalPrice: 6999,
    discount: 50,
    rating: 4.7,
    reviews: 300,
    image: "wh.jpg",
    category: "hoodies",
    description: "Cotton hoodie.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 28,
    name: "Zip Hoodie",
    brand: "PUMA",
    price: 2999,
    originalPrice: 5999,
    discount: 50,
    rating: 4.5,
    reviews: 250,
    image: "zip.jpg",
    category: "hoodies",
    description: "Zip hoodie.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 29,
    name: "Graphic Hoodie",
    brand: "ADIDAS",
    price: 3799,
    originalPrice: 7599,
    discount: 50,
    rating: 4.6,
    reviews: 220,
    image: "ic.jpg",
    category: "hoodies",
    description: "Graphic hoodie.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 30,
    name: "Pullover Hoodie",
    brand: "REEBOK",
    price: 3199,
    originalPrice: 6399,
    discount: 50,
    rating: 4.4,
    reviews: 180,
    image: "st.jpg",
    category: "hoodies",
    description: "Pullover hoodie.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 31,
    name: "Loafers",
    brand: "WOODLAND",
    price: 3999,
    originalPrice: 7999,
    discount: 50,
    rating: 4.5,
    reviews: 150,
    image: "loaf.jpg",
    category: "shoes",
    description: "Formal loafers.",
    sizes: ["6", "7", "8", "9", "10"]
  },
  {
    id: 32,
    name: "Boots",
    brand: "RED TAPE",
    price: 4499,
    originalPrice: 8999,
    discount: 50,
    rating: 4.6,
    reviews: 200,
    image: "boots.jpg",
    category: "shoes",
    description: "Stylish boots.",
    sizes: ["6", "7", "8", "9", "10"]
  },
  {
    id: 33,
    name: "Silk Shirt",
    brand: "ZARA",
    price: 2599,
    originalPrice: 4999,
    discount: 48,
    rating: 4.5,
    reviews: 220,
    image: "silk.jpg",
    category: "women-shirts",
    description: "Lightweight silk shirt designed for women.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 34,
    name: "Graphic Tee",
    brand: "H&M",
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    rating: 4.4,
    reviews: 175,
    image: "z.jpg",
    category: "women-tshirts",
    description: "Comfortable graphic t-shirt for women.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 35,
    name: "Skinny Jeans",
    brand: "LEVI'S",
    price: 2899,
    originalPrice: 5799,
    discount: 50,
    rating: 4.4,
    reviews: 190,
    image: "skinny.jpg",
    category: "women-jeans",
    description: "Slim-fit skinny jeans for women.",
    sizes: ["26", "28", "30", "32"]
  },
  {
    id: 36,
    name: "Heeled Boots",
    brand: "CLARKS",
    price: 3999,
    originalPrice: 7999,
    discount: 50,
    rating: 4.6,
    reviews: 210,
    image: "heels.jpg",
    category: "women-shoes",
    description: "Elegant heeled boots for women.",
    sizes: ["5", "6", "7", "8"]
  },
  {
    id: 37,
    name: "Silk Embroidered Saree",
    brand: "SAREE HOUSE",
    price: 5299,
    originalPrice: 10599,
    discount: 50,
    rating: 4.7,
    reviews: 180,
    image: "saree.jpg",
    category: "women-traditional-wear",
    description: "Rich silk saree with embroidered motifs for festive occasions.",
    sizes: ["Free Size"]
  },
  {
    id: 38,
    name: "Banarasi Lehenga Set",
    brand: "ETHNIC WEAR",
    price: 6999,
    originalPrice: 13999,
    discount: 50,
    rating: 4.8,
    reviews: 130,
    image: "mu.jpg",
    category: "women-traditional-wear",
    description: "Traditional Banarasi lehenga set with rich zari detailing.",
    sizes: ["S", "M", "L"]
  },
  {
    id: 39,
    name: "Anarkali Suit",
    brand: "MELANGE",
    price: 3999,
    originalPrice: 7999,
    discount: 50,
    rating: 4.6,
    reviews: 210,
    image: "anar.jpg",
    category: "women-traditional-wear",
    description: "Flowing Anarkali suit with golden embroidery.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 40,
    name: "Festive Kurta Set",
    brand: "BIBA",
    price: 2899,
    originalPrice: 5799,
    discount: 50,
    rating: 4.4,
    reviews: 160,
    image: "kurt.jpg",
    category: "women-traditional-wear",
    description: "Elegant kurta set with matching palazzos for traditional celebrations.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 41,
    name: "Denim Jacket Dress",
    brand: "FOREVER 21",
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    rating: 4.5,
    reviews: 145,
    image: "maxi.jpg",
    category: "women-western",
    description: "Casual denim jacket dress for a chic western look.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 42,
    name: "Sleeveless Jumpsuit",
    brand: "ZARA",
    price: 3299,
    originalPrice: 6599,
    discount: 50,
    rating: 4.6,
    reviews: 120,
    image: "sleeve.jpg",
    category: "women-western",
    description: "Stylish sleeveless jumpsuit for evening outings.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 43,
    name: "Flared Top",
    brand: "H&M",
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    rating: 4.4,
    reviews: 155,
    image: "flared.jpg",
    category: "women-western",
    description: "Chic flared top for casual western styling.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 44,
    name: "Tailored Trousers",
    brand: "MANGO",
    price: 2699,
    originalPrice: 5399,
    discount: 50,
    rating: 4.7,
    reviews: 170,
    image: "trouser.jpg",
    category: "women-western",
    description: "Smart tailored trousers for everyday western wear.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 45,
    name: "Chiffon Salwar Set",
    brand: "BIBA",
    price: 3299,
    originalPrice: 6599,
    discount: 50,
    rating: 4.5,
    reviews: 210,
    image: "black.jpg",
    category: "women-salwar",
    description: "Elegant chiffon salwar set with delicate embroidery.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 46,
    name: "Embroidered Salwar Suit",
    brand: "GLOBAL DESI",
    price: 2799,
    originalPrice: 5599,
    discount: 50,
    rating: 4.6,
    reviews: 180,
    image: "salwar.jpg",
    category: "women-salwar",
    description: "Traditional salwar suit with intricate embroidery.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 47,
    name: "Printed Salwar Kameez",
    brand: "W",
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    rating: 4.4,
    reviews: 165,
    image: "print.jpg",
    category: "women-salwar",
    description: "Comfortable printed salwar kameez for daily wear.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 48,
    name: "Designer Salwar Set",
    brand: "AVON",
    price: 3499,
    originalPrice: 6999,
    discount: 50,
    rating: 4.7,
    reviews: 190,
    image: "set.jpg",
    category: "women-salwar",
    description: "Designer salwar suit with modern print and fit.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 49,
    name: "Floral Maxi Dress",
    brand: "FOREVER 21",
    price: 2199,
    originalPrice: 4399,
    discount: 50,
    rating: 4.6,
    reviews: 175,
    image: "floral.jpg",
    category: "women-floral",
    description: "Soft floral maxi dress ideal for spring outings.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 50,
    name: "Floral Co-ord Set",
    brand: "H&M",
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    rating: 4.5,
    reviews: 160,
    image: "chudi.jpg",
    category: "women-floral",
    description: "Floral top and skirt co-ord set for a fresh look.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 51,
    name: "Floral Wrap Top",
    brand: "ZARA",
    price: 1599,
    originalPrice: 3199,
    discount: 50,
    rating: 4.4,
    reviews: 145,
    image: "crop.jpg",
    category: "women-floral",
    description: "Wrap top with delicate floral print.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 52,
    name: "Floral Midi Skirt",
    brand: "H&M",
    price: 1399,
    originalPrice: 2799,
    discount: 50,
    rating: 4.3,
    reviews: 150,
    image: "gown.jpg",
    category: "women-floral",
    description: "Lightweight midi skirt in bright floral print.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 53,
    name: "Jeans with Crop Top",
    brand: "LEVIS",
    price: 2599,
    originalPrice: 5199,
    discount: 50,
    rating: 4.6,
    reviews: 170,
    image: "top.jpg",
    category: "women-jeans-top",
    description: "High-waist jeans paired with a fitted crop top.",
    sizes: ["26", "28", "30", "32"]
  },
  {
    id: 54,
    name: "Denim Top and Jeans",
    brand: "MANGO",
    price: 2799,
    originalPrice: 5599,
    discount: 50,
    rating: 4.5,
    reviews: 155,
    image: "deni.jpg",
    category: "women-jeans-top",
    description: "Denim top paired with skinny jeans for a coordinated look.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 55,
    name: "Ripped Jeans with Tank",
    brand: "H&M",
    price: 2299,
    originalPrice: 4599,
    discount: 50,
    rating: 4.4,
    reviews: 140,
    image: "jtop.jpg",
    category: "women-jeans-top",
    description: "Ripped jeans styled with a casual tank top.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 56,
    name: "Printed Jeans Top Set",
    brand: "FOREVER 21",
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    rating: 4.5,
    reviews: 160,
    image: "jeanstop.jpg",
    category: "women-jeans-top",
    description: "Printed top paired with matching jeans.",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 57,
    name: "Sequin Party Dress",
    brand: "ZARA",
    price: 4199,
    originalPrice: 8399,
    discount: 50,
    rating: 4.7,
    reviews: 195,
    image: "partwear.jpg",
    category: "women-party",
    description: "Shimmering sequin dress for evening parties.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 58,
    name: "Satin Party Gown",
    brand: "FOREVER 21",
    price: 4599,
    originalPrice: 9199,
    discount: 50,
    rating: 4.6,
    reviews: 180,
    image: "pink.jpg",
    category: "women-party",
    description: "Elegant satin gown ideal for special occasions.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 59,
    name: "Glitter Skirt Set",
    brand: "H&M",
    price: 3399,
    originalPrice: 6799,
    discount: 50,
    rating: 4.5,
    reviews: 165,
    image: "glitter.jpg",
    category: "women-party",
    description: "Glitter skirt and top set for a glam night out.",
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 60,
    name: "Evening Jumpsuit",
    brand: "ZARA",
    price: 3799,
    originalPrice: 7599,
    discount: 50,
    rating: 4.6,
    reviews: 170,
    image: "jump.jpg",
    category: "women-party",
    description: "Sophisticated evening jumpsuit for a refined look.",
    sizes: ["XS", "S", "M", "L"]
  }
];



const CATEGORY_CONFIGS = {
  Men: {
    title: "MEN'S COLLECTION",
    categories: [
      { key: 'shirts', label: 'Shirts |' },
      { key: 'tshirts', label: 'T-Shirts |' },
      { key: 'jeans', label: 'Jeans |' },
      { key: 'formals', label: 'Formals |' },
      { key: 'hoodies', label: 'Hoodies |' },
      { key: 'shoes', label: 'Shoes |' }
    ]
  },
  Women: {
    title: "WOMEN'S COLLECTION",
    categories: [
      { key: 'women-traditional-wear', label: 'Traditional Wear |' },
      { key: 'women-western', label: 'Western |' },
      { key: 'women-salwar', label: 'Salwar |' },
      { key: 'women-floral', label: 'Floral |' },
      { key: 'women-jeans-top', label: 'Jeans With Top |' },
      { key: 'women-party', label: 'Partywear |' }
    ]
  },
  Kids: {
    title: "KIDS COLLECTION",
    categories: [
      { key: 'kids-clothing', label: 'Clothing |' },
      { key: 'kids-footwear', label: 'Footwear |' },
      { key: 'kids-accessories', label: 'Accessories |' },
      { key: 'kids-outfits', label: 'Outfits |' },
      { key: 'kids-sports', label: 'Sports |' },
      { key: 'kids-toys', label: 'Toys |' }
    ]
  },
  Beauty: {
    title: "BEAUTY COLLECTION",
    categories: [
      { key: 'beauty-makeup', label: 'Makeup |' },
      { key: 'beauty-skincare', label: 'Skincare |' },
      { key: 'beauty-haircare', label: 'Haircare |' },
      { key: 'beauty-fragrance', label: 'Fragrance |' },
      { key: 'beauty-tools', label: 'Beauty Tools |' },
      { key: 'beauty-bath', label: 'Bath & Body |' }
    ]
  }
};



function getPageContext(category) {
  if (!category || category === 'null') return { pageType: 'Men', selectedCategory: null };
  const lowerCat = category.toLowerCase();

  // Top level categories
  if (lowerCat === 'men') return { pageType: 'Men', selectedCategory: null };
  if (lowerCat === 'women') return { pageType: 'Women', selectedCategory: null };
  if (lowerCat === 'kids') return { pageType: 'Kids', selectedCategory: null };
  if (lowerCat === 'beauty') return { pageType: 'Beauty', selectedCategory: null };

  if (KIDS_SUBCATEGORIES.includes(category) || category.startsWith('kids-')) {
    return { pageType: 'Kids', selectedCategory: category };
  }
  if (BEAUTY_SUBCATEGORIES.includes(category) || category.startsWith('beauty-')) {
    return { pageType: 'Beauty', selectedCategory: category };
  }
  if (WOMEN_SUBCATEGORIES.includes(category) || category.startsWith('women-')) {
    return { pageType: 'Women', selectedCategory: category };
  }
  if (MEN_SUBCATEGORIES.includes(category) || category.startsWith('men-')) {
    return { pageType: 'Men', selectedCategory: category };
  }
  
  return { pageType: 'Men', selectedCategory: null };
}

function getPageProducts(pageContext) {
  let filtered = [];
  if (pageContext.pageType === 'Women') {
    if (pageContext.selectedCategory) {
      filtered = PRODUCTS.filter(product => product.category === pageContext.selectedCategory).slice(0, 4);
    } else {
      filtered = PRODUCTS.filter(product => product.category && product.category.toLowerCase().startsWith('women-'));
    }
  } else if (pageContext.pageType === 'Men') {
    if (pageContext.selectedCategory) {
      filtered = PRODUCTS.filter(product => product.category === pageContext.selectedCategory).slice(0, 4);
    } else {
      filtered = PRODUCTS.filter(product => {
        const cat = (product.category || '').toLowerCase();
        return MEN_SUBCATEGORIES.includes(cat) || (cat.startsWith('men-') && !cat.startsWith('women-'));
      });
    }
  } else if (pageContext.pageType === 'Kids') {
    if (pageContext.selectedCategory) {
      filtered = PRODUCTS.filter(product => product.category === pageContext.selectedCategory).slice(0, 4);
    } else {
      filtered = PRODUCTS.filter(product => product.category && product.category.toLowerCase().includes('kids'));
    }
  } else if (pageContext.pageType === 'Beauty') {
    if (pageContext.selectedCategory) {
      filtered = PRODUCTS.filter(product => product.category === pageContext.selectedCategory).slice(0, 4);
    } else {
      filtered = PRODUCTS.filter(product => product.category && product.category.toLowerCase().includes('beauty'));
    }
  } else {
    filtered = [...PRODUCTS];
  }

  // Ensure 24 products for top-level pages (borrowing logic)
  if (!pageContext.selectedCategory && filtered.length > 0) {
    if (filtered.length < 24) {
      const others = PRODUCTS.filter(p => !filtered.find(f => f.id === p.id));
      filtered = [...filtered, ...others.slice(0, 24 - filtered.length)];
    } else {
      filtered = filtered.slice(0, 24);
    }
  }

  return filtered;
}

function renderCategoryNav(pageContext) {
  const navContainer = document.getElementById('categoryNav');
  if (!navContainer) return;

  const config = CATEGORY_CONFIGS[pageContext.pageType];
  if (!config || !config.categories.length) {
    navContainer.innerHTML = '';
    return;
  }

  navContainer.innerHTML = config.categories.map(category => {
    const activeClass = pageContext.selectedCategory === category.key ? ' active' : '';

    return `
      <a href="products.html?category=${category.key}"
         class="category-link${activeClass}"
         data-category="${category.key}">
        ${category.label}
      </a>
    `;
  }).join('');
}

function updateProductsPageHeader(pageContext) {
  const titleElement = document.querySelector('.section-title');
  if (titleElement) {
    titleElement.textContent = CATEGORY_CONFIGS[pageContext.pageType]
      ? CATEGORY_CONFIGS[pageContext.pageType].title
      : `${pageContext.pageType.toUpperCase()} COLLECTION`;
  }

  document.title = `${titleElement ? titleElement.textContent : 'Products'} - F@shionc@rt`;
}

// ============================================
// STATE MANAGEMENT
// ============================================

let CART = [];
let WISHLIST = [];
const CURRENT_USER_ID = 1;

function getCurrentUserId() {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return CURRENT_USER_ID;
    const user = JSON.parse(userStr);
    const id = Number(user?.id);
    return Number.isInteger(id) && id > 0 ? id : CURRENT_USER_ID;
  } catch (_error) {
    return CURRENT_USER_ID;
  }
}

function getCart() { return CART; }
function getWishlist() { return WISHLIST; }
function setCart(items) { CART = items; }
function setWishlist(items) { WISHLIST = items; }

async function fetchCart() {
  try {
    const res = await fetch('http://localhost:5000/api/cart/' + CURRENT_USER_ID);
    if (!res.ok) throw new Error("Failed to fetch cart");
    const result = await res.json();
    const items = result.data || result;
    if (Array.isArray(items)) {
      CART = items.map(item => ({
        cartItemId: item.id,
        id: item.productId,
        name: item.Product?.name || 'Product',
        price: item.Product?.price || item.Product?.originalPrice || 0,
        image: item.Product?.image || '',
        quantity: item.quantity
      }));
      updateCartCount();
    }
  } catch(e) { console.warn('fetchCart error:', e); }
}

async function fetchWishlist() {
  try {
    const res = await fetch('http://localhost:5000/api/wishlist/' + CURRENT_USER_ID);
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    const result = await res.json();
    const items = result.data || result;
    if (Array.isArray(items)) {
      WISHLIST = items.map(item => ({
        wishlistItemId: item.id,
        id: item.productId,
        name: item.Product?.name || 'Product',
        price: item.Product?.price || item.Product?.originalPrice || 0,
        image: item.Product?.image || ''
      }));
      updateWishlistCount();
      updateWishlistUI();
    }
  } catch(e) { console.warn('fetchWishlist error:', e); }
}

function renderStars(rating) {
  const fullStars = Math.floor(rating || 5);
  const halfStar = (rating % 1 >= 0.5) ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  let starsHtml = '';
  // Solid gold stars (HD look)
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="bx bxs-star" style="color: #ff9900; font-size: 16px; text-shadow: 0 0 2px rgba(0,0,0,0.1);"></i>';
  }
  // Half star
  if (halfStar) {
    starsHtml += '<i class="bx bxs-star-half" style="color: #ff9900; font-size: 16px; text-shadow: 0 0 2px rgba(0,0,0,0.1);"></i>';
  }
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="bx bx-star" style="color: #ff9900; font-size: 16px;"></i>';
  }
  return starsHtml;
}

function renderGroupedBySubcategory(pageContext, container, filterText = '') {
  const config = CATEGORY_CONFIGS[pageContext.pageType];
  if (!config) return;

  container.innerHTML = '';
  container.style.display = 'block';
  container.style.width = '100%';

  const allCategoryProducts = getPageProducts(pageContext);
  
  config.categories.forEach(subCat => {
    let subProducts = allCategoryProducts.filter(p => p.category === subCat.key);
    
    // Apply local search filtering
    if (filterText) {
      subProducts = subProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(filterText.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(filterText.toLowerCase()))
      );
    }

    // Limit to 4 and pad from top-level category if insufficient
    if (!filterText) {
      if (subProducts.length < 4) {
        const borrowed = allCategoryProducts
          .filter(p => p.category !== subCat.key && !subProducts.find(s => s.id === p.id))
          .slice(0, 4 - subProducts.length);
        subProducts = [...subProducts, ...borrowed];
      } else {
        subProducts = subProducts.slice(0, 4);
      }
    } else {
      // When searching, show all matches for that section
      subProducts = subProducts.slice(0, 4);
    }

    if (subProducts.length > 0) {
      const sectionHtml = `
        <div class="subcategory-section" style="margin-bottom: 50px; clear: both; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #eaeded; padding-bottom: 8px; margin-bottom: 20px;">
            <h2 style="font-size: 18px; font-weight: 700; color: #111;">${subCat.label.replace('|','').trim()}</h2>
            <a href="products.html?category=${subCat.key}" style="color: #007185; font-size: 13px; font-weight: 600;">Shop more</a>
          </div>
          <div class="products-grid" style="display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 20px !important;">
            ${subProducts.map(p => createProductCard(p)).join('')}
          </div>
        </div>
      `;
      container.innerHTML += sectionHtml;
    }
  });
}

function getProductImageUrl(image) {
    if (!image || image === "null" || image === "undefined" || image === "") {
        console.error("[Image Missing] Empty image field for product.");
        return "";
    }

    if (image.startsWith("http")) return image;

    if (image.startsWith("/uploads/")) {
        return `${BACKEND_BASE}${image}`;
    }

    if (image.includes("/")) {
        return image;
    }

    return `${BACKEND_BASE}/uploads/${image}`;
}

function handleProductImageError(img, productName, productImage) {
  console.error(`[Image Load Error] ${productName} -> ${productImage}`);
  img.onerror = null;
}
let currentTheme = localStorage.getItem('theme') || 'light';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", async () => {

  const fetchedProducts = await loadProducts();

  const safeProducts = fetchedProducts || [];

  console.log("Loaded products:", safeProducts.length);
  
  await fetchCart();
  await fetchWishlist();

  const pageId = document.body.id;

  if (pageId === "home-page") loadHomePage(safeProducts);
  if (pageId === "products-page") loadProductsPage(safeProducts);
  if (pageId === "product-page") loadProductPage(safeProducts);
  if (pageId === "cart-page") loadCartPage();
  if (pageId === "wishlist-page") loadWishlistPage();
  if (pageId === "orders-page") loadOrdersPage();

  updateCartCount();
  updateWishlistCount();
  setupEventListeners();
  initChat();
  checkAdminVisibility();
});

// ============================================
// THEME MANAGEMENT
// ============================================

function initializeTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.body.setAttribute('data-theme', currentTheme);
  updateThemeToggleState();
}

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.body.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeToggleState();
  showToast('Theme changed to ' + currentTheme.toUpperCase(), 'info');
}

function toggleTheme() {
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

function updateThemeToggleState() {
  const themeCheckbox = document.getElementById('themeToggle');
  if (themeCheckbox) {
    themeCheckbox.checked = currentTheme === 'dark';
  }

  const themeButton = document.querySelector('.theme-toggle');
  if (themeButton) {
    themeButton.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Theme toggle
  const themeCheckbox = document.getElementById('themeToggle');
  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', () => {
      setTheme(themeCheckbox.checked ? 'dark' : 'light');
    });
  } else {
    const themeButton = document.querySelector('.theme-toggle');
    if (themeButton) {
      themeButton.addEventListener('click', toggleTheme);
    }
  }

  // Removed redundant navigation handler that caused file origin CORS issues

  // Cart icon
  const cartIcon = document.querySelector('[data-action="cart"]');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

  // Wishlist icon
  const wishlistIcon = document.querySelector('[data-action="wishlist"]');
  if (wishlistIcon) {
    wishlistIcon.addEventListener('click', () => {
      window.location.href = 'wishlist.html';
    });
  }

  // Profile icon
  const profileIcon = document.querySelector('[data-action="profile"]');
  if (profileIcon) {
    profileIcon.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  }

  // Search
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
}

// ============================================
// CART MANAGEMENT
// ============================================

async function addToCart(product, quantity = 1) {
  console.log('[addToCart] Start', { product, quantity });
  let productId = null;
  if (product && typeof product === 'object') productId = product.id;
  else if (product != null) productId = Number(product);

  console.log('[addToCart] Product ID:', productId);
  if (!productId) {
    console.error('[addToCart] No productId found');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID, productId, quantity })
    });

    console.log('[addToCart] Response status:', res.status);
    if (res.ok) {
      await fetchCart();
      showToast('✓ Added to Bag', 'success');
    } else {
      const err = await res.json();
      console.error('[addToCart] API Error:', err);
      showToast('Failed to add: ' + (err.error || err.message || 'Unknown error'), 'error');
    }
  } catch (e) {
    console.error('[addToCart] Fatal Error:', e);
    showToast('Network error while adding to bag', 'error');
  }
}

function getProductDataFromDom(productId) {
  const productCard = document.querySelector(`[data-product-id="${productId}"]`);
  if (!productCard) return null;

  return {
    id: productId,
    name: productCard.dataset.name || productCard.querySelector('.product-name')?.textContent?.trim(),
    price: Number(productCard.dataset.price || productCard.querySelector('.current-price')?.textContent.replace(/\D/g, '') || 0),
    image: productCard.dataset.image || productCard.querySelector('img')?.src || ''
  };
}

async function removeFromCart(cartIdOrProductId) {
  const cartItems = getCart();
  const item = cartItems.find(i => i.id === Number(cartIdOrProductId) || i.cartItemId === Number(cartIdOrProductId));
  if (!item || !item.cartItemId) return;

  try {
    const res = await fetch(`http://localhost:5000/api/cart/remove/${item.cartItemId}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchCart();
      if (document.body.id === 'cart-page') loadCartPage();
      showToast('Removed from Bag', 'info');
    }
  } catch (e) { console.error('removeFromCart error:', e); }
}

async function decreaseQuantity(productId) {
  const cartItems = getCart();
  const item = cartItems.find(i => i.id === Number(productId));
  if (!item || !item.cartItemId) return;

  if (item.quantity <= 1) {
    await removeFromCart(item.cartItemId);
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/cart/decrease/${item.cartItemId}`, { method: 'PUT' });
    if (res.ok) {
      await fetchCart();
      if (document.body.id === 'cart-page') loadCartPage();
    }
  } catch (e) { console.error('decreaseQuantity error:', e); }
}

function updateCartCount() {
  const cartItems = getCart();
  const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartCountElements = [];
  const cartCountById = document.getElementById('cart-count');
  if (cartCountById) cartCountElements.push(cartCountById);
  document.querySelectorAll('[data-action="cart"] .cart-count').forEach(el => cartCountElements.push(el));

  const uniqueElements = [...new Set(cartCountElements)];
  uniqueElements.forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function getTotalCartPrice() {
  return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ============================================
// WISHLIST MANAGEMENT
// ============================================

// Add product to wishlist with full product data
async function addToWishlist(productOrId) {
  console.log('[addToWishlist] Start', productOrId);
  let productId = null;
  if (productOrId && typeof productOrId === 'object') productId = productOrId.id;
  else if (productOrId != null) productId = Number(productOrId);

  if (!productId) {
    console.error('[addToWishlist] No productId found');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/wishlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID, productId })
    });

    console.log('[addToWishlist] Response status:', res.status);
    if (res.ok) {
      const data = await res.json();
      await fetchWishlist();
      showToast(data.message || 'Wishlist updated', 'success');
    } else {
      const err = await res.json();
      console.error('[addToWishlist] API Error:', err);
      showToast('Wishlist error: ' + (err.message || 'Failed to update'), 'error');
    }
  } catch (e) {
    console.error('[addToWishlist] Fatal Error:', e);
    showToast('Network error while updating wishlist', 'error');
  }
}

async function toggleWishlist(productId) {
  await addToWishlist(productId);
}

async function removeFromWishlist(productId) {
  console.log('[removeFromWishlist] Product ID:', productId);
  try {
    const res = await fetch('http://localhost:5000/api/wishlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID, productId })
    });

    if (res.ok) {
      await fetchWishlist();
      if (document.body.id === 'wishlist-page') loadWishlistPage();
      showToast('Removed from wishlist', 'info');
    }
  } catch (e) {
    console.error('removeFromWishlist error:', e);
  }
}

function updateWishlistCount() {
  const wishlistItems = getWishlist();
  const wishlistCountElements = [];
  const wishlistCountById = document.getElementById('wishlist-count');
  if (wishlistCountById) wishlistCountElements.push(wishlistCountById);
  document.querySelectorAll('[data-action="wishlist"] .cart-count').forEach(el => wishlistCountElements.push(el));

  const uniqueElements = [...new Set(wishlistCountElements)];
  uniqueElements.forEach(el => {
    el.textContent = wishlistItems.length;
    el.style.display = wishlistItems.length > 0 ? 'flex' : 'none';
  });
}

function isInWishlist(productId) {
  return WISHLIST.some(item => Number(item.id) === Number(productId));
}

function updateWishlistUI() {
  document.querySelectorAll('.wishlist-toggle').forEach(btn => {
    const productId = parseInt(btn.dataset.productId);
    if (isInWishlist(productId)) {
      btn.classList.add('active');
      btn.innerHTML = '❤️';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '🤍';
    }
  });
}

// ============================================
// PRODUCT RENDERING
// ============================================

function createProductCard(product, options = {}) {
  const { showCart = true, showWishlist = true } = options;

  const originalPrice = Number(product.originalPrice) || 0;
  const discount = Number(product.discount) || 0;
  
  // Calculate current price if not provided, or use existing one
  let currentPrice = Number(product.price);
  if (!currentPrice || currentPrice === 0) {
    if (originalPrice > 0) {
      currentPrice = Math.round(originalPrice * (1 - discount / 100));
    } else {
      currentPrice = 0;
    }
  }

  console.log(product.name, product.image);
  const imageUrl = getProductImageUrl(product.image);

  const category = product.category || '';
  const brand = product.brand || ''; // ✅ Brand fix
  const inWishlist = showWishlist && isInWishlist(Number(product.id));

  return `
    <div class="product-card" 
         data-product-id="${product.id}" 
         data-category="${category}" 
         data-price="${currentPrice}"
         data-brand="${brand}"
         data-name="${product.name || ''}"
         data-image="${product.image || ''}">
      
      <div class="product-image-container" style="position: relative;">
        <img src="${imageUrl}" 
             alt="${product.name || 'Product'}" 
             class="product-image" 
             loading="lazy"
             onerror="handleProductImageError(this, '${(product.name || "Unknown Product").replace(/'/g, "\\'")}', '${(String(product.image || "")).replace(/'/g, "\\'")}')">

        ${
          showWishlist
            ? `<button class="wishlist-toggle${inWishlist ? ' active' : ''}" 
                data-product-id="${product.id}" 
                onclick="toggleWishlist(${product.id})" 
                aria-label="Toggle wishlist" style="position: absolute; top: 10px; right: 10px; z-index: 10; background: white; border: none; border-radius: 50%; padding: 5px; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                ${inWishlist ? '❤️' : '🤍'}
              </button>`
            : ''
        }
      </div>

      <div class="product-info" style="display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
        <div>
          <div class="product-brand" style="color: var(--Marketplace-link); text-transform: uppercase;">${brand ? brand : 'F@shionc@rt'}</div>
          <h3 class="product-name" style="font-size: 16px; margin: 4px 0;">${product.name || 'Unknown Product'}</h3>
          
          <div class="product-rating" style="display: flex; gap: 2px; align-items: center; margin-bottom: 6px;">
            ${renderStars(product.rating)}
            <span class="rating-count" style="color: var(--Marketplace-link); font-size: 12px; cursor: pointer; margin-left: 4px;">${product.reviews || Math.floor(Math.random() * 500) + 12}</span>
          </div>

          <div class="product-price" style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px;">
            <span class="current-price" style="font-size: 24px; font-weight: 500; color: #0f1111;">
              <span style="font-size: 12px; vertical-align: top;">₹</span>${currentPrice}
            </span>
            ${
              originalPrice > currentPrice
                ? `<span class="original-price" style="text-decoration: line-through; color: #565959; font-size: 12px;">M.R.P: ₹${originalPrice}</span>`
                : ''
            }
             ${
              discount > 0 && originalPrice > currentPrice
                ? `<span class="discount-badge" style="position: static; font-weight: normal; font-size: 12px; color: #cc0c39; background: none; padding: 0;">(${discount}% off)</span>`
                : ''
            }
          </div>
          
          <div style="font-size: 12px; color: #565959; margin-bottom: 8px;">
            <span style="font-weight: 700; color: #0f1111;">FREE Delivery</span> by Marketplace
          </div>
        </div>

        <div class="product-actions">
          ${
            showCart
              ? `<button class="amazon-add-to-cart" onclick="addToCart(${product.id})">
                  <i class='bx bxs-shopping-bag'></i>
                  <span>Add to Cart</span>
                </button>`
              : ''
          }
        </div>
      </div>
    </div>
  `;
}
function createWishlistCard(product) {
  return createProductCard(product, { showCart: false, showWishlist: true });
}

function renderProductsGrid(products, container, options = { showCart: true, showWishlist: true }) {
  const renderOptions = {
    showCart: options.showCart !== false,
    showWishlist: options.showWishlist !== false
  };
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon"></div>
        <h3 class="empty-state-title">No products found</h3>
        <p class="empty-state-text">Try adjusting your filters or search terms</p>
      </div>
    `;
    return;
  }

  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
  container.style.gap = "20px";
  container.innerHTML = products.map(product => createProductCard(product, renderOptions)).join('');
  updateWishlistUI();
}

// ============================================
// SEARCH & FILTER
// ============================================

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const pageProducts = (document.body.id === 'home-page' || !category) ? PRODUCTS : getPageProducts(getPageContext(category));
  
  const filtered = pageProducts.filter(p => !query || 
    (p.name || '').toLowerCase().includes(query) || 
    (p.brand || '').toLowerCase().includes(query)
  );

  const container = document.querySelector('.products-grid') || document.querySelector('#products');
  if (container) {
    const opts = document.body.id === 'home-page' ? { showCart: false, showWishlist: false } : {};
    renderProductsGrid(filtered, container, opts);
  }
}

function filterByCategory(category) {
  const normalized = category ? category.toLowerCase() : '';
  if (normalized === 'all') return PRODUCTS;
  
  const context = getPageContext(category);
  return getPageProducts(context);
}

// ============================================
// ADMIN VISIBILITY (Rule 2)
// ============================================
function checkAdminVisibility() {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const adminIcon = document.getElementById('admin-icon');
    
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      if (adminIcon) adminIcon.style.display = 'flex';
      document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    } else {
      if (adminIcon) adminIcon.style.display = 'none';
      document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }
  } catch (err) {
    console.error('Error checking admin visibility:', err);
  }
}

// ============================================
// HOME PAGE
// ============================================

function loadHomePage() {
  checkAdminVisibility();
  // Featured products (Exactly 8 - 2 rows of 4)
  const featuredProducts = PRODUCTS.slice(0, 8);
  const container = document.querySelector('.featured-products');
  if (container) {
    renderProductsGrid(featuredProducts, container, { showCart: false, showWishlist: false });
  }

  // Category cards
  setupCategoryCards();
}

function setupCategoryCards() {
  const categories = document.querySelectorAll('.category-card');
  categories.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      window.location.href = `products.html?category=${category}`;
    });
  });
}



// ============================================
// PRODUCTS PAGE
// ============================================

function loadProductsPage() {
  checkAdminVisibility();
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const pageContext = getPageContext(category);
  
  let products = getPageProducts(pageContext);
  
  const container = document.querySelector('.products-grid');
  if (container) {
    if (pageContext.selectedCategory) {
      renderProductsGrid(products, container);
    } else {
      renderGroupedBySubcategory(pageContext, container);
    }
  }

  renderCategoryNav(pageContext);
  updateProductsPageHeader(pageContext);
  populateBrandFilters(products);

  // Setup sort dropdown
  const sortDropdown = document.querySelector('.sort-dropdown');
  if (sortDropdown) {
    sortDropdown.addEventListener('change', (e) => {
      const value = e.target.value;
      const sorted = sortProducts(products, value);
      renderProductsGrid(sorted, container);
    });
  }

  // Setup local category search
  const localSearch = document.getElementById('categorySearchInput');
  if (localSearch) {
    localSearch.addEventListener('input', (e) => {
      const val = e.target.value;
      if (pageContext.selectedCategory) {
        const filtered = products.filter(p => 
          (p.name && p.name.toLowerCase().includes(val.toLowerCase())) ||
          (p.brand && p.brand.toLowerCase().includes(val.toLowerCase()))
        );
        renderProductsGrid(filtered, container);
      } else {
        renderGroupedBySubcategory(pageContext, container, val);
      }
    });
  }
}

function populateBrandFilters(products) {
  const brandListContainer = document.querySelector('.filter-sidebar .filter-group:nth-child(2)');
  if (!brandListContainer) return;

  const brands = [...new Set(products.map(p => p.brand).filter(b => !!b))];
  
  if (brands.length === 0) {
    brandListContainer.style.display = 'none';
    return;
  }

  brandListContainer.style.display = 'block';
  const brandOptions = brands.map((brand, index) => `
    <div class="filter-option">
      <input type="checkbox" id="brand-${index}" value="${brand}" class="brand-checkbox">
      <label for="brand-${index}">${brand}</label>
    </div>
  `).join('');

  brandListContainer.innerHTML = `
    <div class="filter-title">BRAND</div>
    ${brandOptions}
  `;

  document.querySelectorAll('.brand-checkbox').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });
}

function sortProducts(products, sortBy) {
  const sorted = [...products];
  
  switch(sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
}

function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-option input[type="checkbox"]');
  filterButtons.forEach(button => {
    button.addEventListener('change', applyFilters);
  });
}

function applyFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const pageContext = getPageContext(category);
  let products = getPageProducts(pageContext);

  // Price Filter
  const priceVal = document.getElementById('priceFilter')?.value || 'all';
  if (priceVal !== 'all') {
    products = products.filter(p => {
      // Logic for calculating price consistency with createProductCard
      const oPrice = Number(p.originalPrice) || 0;
      const dPercent = Number(p.discount) || 0;
      let price = Number(p.price);
      if (!price || price === 0) {
        price = oPrice > 0 ? Math.round(oPrice * (1 - dPercent / 100)) : 0;
      }
      
      if (priceVal === '0-500') return price < 500;
      if (priceVal === '500-1000') return price >= 500 && price <= 1000;
      if (priceVal === '1000-2000') return price >= 1000 && price <= 2000;
      if (priceVal === '2000-5000') return price >= 2000 && price <= 5000;
      if (priceVal === '5000-plus') return price > 5000;
      return true;
    });
  }

  // Brand Filter
  const selectedBrands = Array.from(document.querySelectorAll('.brand-checkbox:checked')).map(cb => cb.value);
  if (selectedBrands.length > 0) {
    products = products.filter(p => selectedBrands.includes(p.brand));
  }

  const container = document.querySelector('.products-grid');
  if (container) {
    renderProductsGrid(products, container);
  }
}

// ============================================
// PRODUCT DETAILS PAGE
// ============================================

function loadProductPage() {
  checkAdminVisibility();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    window.location.href = 'products.html';
    return;
  }

  // Main image
  const mainImage = document.querySelector('.product-image-large');
  if (mainImage) {
    mainImage.src = getProductImageUrl(product.image);
    mainImage.alt = product.name;
  }

  // Product info
  const brand = document.querySelector('.product-detail-brand');
  if (brand) brand.textContent = product.brand;

  const title = document.querySelector('.product-detail-title');
  if (title) title.textContent = product.name;

  const rating = document.querySelector('.rating-stars');
  if (rating) rating.textContent = '★★★★★';

  const ratingCount = document.querySelector('.rating-count');
  if (ratingCount) ratingCount.textContent = `${product.rating}(${product.reviews} reviews)`;

  const priceElements = {
    current: document.querySelector('.price-current'),
    original: document.querySelector('.price-original'),
    discount: document.querySelector('.price-discount')
  };

  const oPrice = Number(product.originalPrice) || 0;
  const dPercent = Number(product.discount) || 0;
  let cPrice = Number(product.price);
  if (!cPrice || cPrice === 0) {
    cPrice = oPrice > 0 ? Math.round(oPrice * (1 - dPercent / 100)) : 0;
  }

  if (priceElements.current) priceElements.current.textContent = `₹${cPrice}`;
  if (priceElements.original) priceElements.original.textContent = oPrice > cPrice ? `₹${oPrice}` : '';
  if (priceElements.discount) priceElements.discount.textContent = (dPercent > 0 && oPrice > cPrice) ? `${dPercent}% OFF` : '';

  // Description
  const description = document.querySelector('.product-description p');
  if (description) description.textContent = product.description;

  // Size buttons
  setupSizeSelection(product);

  // Add to cart button on product detail page
  const addToCartBtn = document.querySelector('.btn-primary');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const selectedSize = document.querySelector('.size-btn.active');
      if (!selectedSize) {
        showToast('Please select a size', 'warning');
        return;
      }
      addToCart(product.id);
    });
  }

  // Wishlist button
  const wishlistToggle = document.querySelector('.wishlist-toggle');
  if (wishlistToggle) {
    wishlistToggle.dataset.productId = product.id;
    wishlistToggle.addEventListener('click', () => {
      // Pass full product object with all data
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    });
    updateWishlistUI();
  }

  // Thumbnail gallery
  setupThumbnailGallery(product);
}

function setupSizeSelection(product) {
  const sizeContainer = document.querySelector('.size-selector');
  if (sizeContainer) {
    sizeContainer.innerHTML = product.sizes.map(size => `
      <button class="size-btn" data-size="${size}">${size}</button>
    `).join('');

    sizeContainer.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sizeContainer.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
}

function setupThumbnailGallery(product) {
  const thumbContainer = document.querySelector('.product-image-thumb-container');
  if (!thumbContainer) return;

  // only single image support (your current DB structure)
  const images = [product.image];

  thumbContainer.innerHTML = images.map(img => `
    <img 
      src="${getProductImageUrl(img)}" 
      class="product-image-thumb active"
      style="cursor:pointer;"
    />
  `).join('');

  thumbContainer.querySelectorAll('.product-image-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {

      thumbContainer.querySelectorAll('.product-image-thumb')
        .forEach(t => t.classList.remove('active'));

      thumb.classList.add('active');

      const mainImage = document.querySelector('.product-image-large');

      if (mainImage) {
        mainImage.src = thumb.src;
      }
    });
  });
}
const API_BASE = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("adminLoginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    const res = await fetch(`${API_BASE}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.user) return;

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("ROLE SAVED:", data.user.role);
  });
});

// ============================================
// CART PAGE
// ============================================

function loadCartPage() {
  const cartItems = getCart();
  const cartContainer = document.querySelector('.cart-items-container');

  if (cartItems.length === 0) {
    if (cartContainer) {
      cartContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛍️</div>
          <h3 class="empty-state-title">Your cart is empty</h3>
          <p class="empty-state-text">Looks like you haven't added anything yet</p>
          <button class="btn btn-primary" onclick="window.location.href='products.html'">Continue Shopping</button>
        </div>
      `;
    }
    updateCheckoutSummary();
    return;
  }

  if (cartContainer) {
    cartContainer.innerHTML = cartItems.map(item => `
      <div class="cart-item">
        <img src="${getProductImageUrl(item.image)}" 
             alt="${item.name}" 
             class="cart-item-image"
             >
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price}</div>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-selector">
            <button onclick="decreaseQuantity(${item.id})" title="Decrease">−</button>
            <input type="text" value="${item.quantity}" readonly>
            <button onclick="addToCart(${item.id})" title="Increase">+</button>
          </div>
          <button class="btn btn-danger btn-small" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `).join('');
  }

  updateCheckoutSummary();
}

function updateCheckoutSummary() {
  const cartItems = getCart();
  const totalItems = cartItems.length === 0 ? 0 : cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotalCartPrice();

  const itemsEl = document.getElementById('checkout-total-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const totalEl = document.getElementById('checkout-total-price');

  if (itemsEl) itemsEl.textContent = totalItems;
  if (subtotalEl) subtotalEl.textContent = `₹${totalPrice}`;
  if (totalEl) totalEl.textContent = `₹${totalPrice}`;
}

async function placeOrder() {
  const cartItems = getCart();
  if (cartItems.length === 0) return showToast('Your cart is empty', 'warning');
  const userId = getCurrentUserId();

  const orderItems = cartItems.map(item => ({
    productId: item.id,
    price: item.price,
    quantity: item.quantity
  }));

  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, items: orderItems })
    });

    if (res.ok) {
      CART = [];
      updateCartCount();
      updateCheckoutSummary();
      showToast('✅ Order placed successfully!', 'success');
      setTimeout(() => { window.location.href = 'orders.html'; }, 1500);
    } else {
      const errorData = await res.json().catch(() => ({}));
      showToast(errorData.message || 'Failed to place order', 'error');
    }
  } catch (e) { console.error('placeOrder error:', e); }
}

async function loadOrdersPage() {
  const container = document.querySelector('.orders-items-container');
  if (!container) return;

  try {
    const userId = getCurrentUserId();
    const res = await fetch(`http://localhost:5000/api/orders/${userId}`);
    const result = await res.json();
    const orders = result.data || [];
    console.log('[loadOrdersPage] Orders fetched:', orders);

    if (orders.length === 0) {
      container.innerHTML = '<div class="empty-state"><h3>No orders yet</h3></div>';
      return;
    }

    container.innerHTML = orders.map(order => {
      const orderDate = new Date(order.createdAt).toLocaleDateString();
      const status = order.status || "Placed";
      const items = Array.isArray(order.items)
        ? order.items
        : [
            {
              product_id: order.product_id,
              price: order.price,
              quantity: order.quantity,
              product: order.product || order.Product || null,
            },
          ];

      const itemsHtml = items.map((item) => {
        const product = item.product || item.Product || null;
        const productName = product?.name || `Product #${item.product_id || ""}`;
        const productImage = product?.image || "";
        const quantity = Number(item.quantity) || 1;
        const unitPrice = Number(item.price) || 0;

        return `
          <div style="display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; border-bottom: 1px rgba(0,0,0,0.05) solid; padding-bottom: 0.5rem;">
            <img src="${getProductImageUrl(productImage)}" alt="${productName}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
            <div>
              <p style="font-weight: 600; margin-bottom: 4px;">${productName}</p>
              <p style="font-size: 0.9rem; color: var(--text-light);">Qty: ${quantity} | ₹${unitPrice}</p>
            </div>
          </div>
        `;
      }).join("");

      const orderTotal = Number(order.total_price)
        || items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

      return `
        <div class="order-card" style="border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; background: var(--bg-white); margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
            <div>
              <p style="font-size: 0.8rem; color: var(--text-light); text-transform: uppercase;">Order ID</p>
              <p style="font-weight: bold;">#${order.id}</p>
              <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 4px;">Placed on ${orderDate}</p>
            </div>
            <div style="text-align: right;">
              <span class="status-badge" style="background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">${status}</span>
              <p style="font-weight: 800; font-size: 1.1rem; margin-top: 8px;">₹${orderTotal}</p>
            </div>
          </div>
          <div>${itemsHtml}</div>
        </div>
      `;
    }).join('');
  } catch (e) {
    console.error('[loadOrdersPage] Error:', e);
    container.innerHTML = '<p>Error loading orders. Check console.</p>';
  }
}

async function moveWishlistItemToCart(productId) {
  const wishlistItems = getWishlist();
  const product = wishlistItems.find(item => item.id === Number(productId));
  if (!product) return;

  await addToCart(product);
  // Optional: remove from wishlist after adding to cart
  showToast('Product added to Cart', 'success');
}

function loadWishlistPage() {
  const wishlistItems = getWishlist();
  const wishlistContainer = document.querySelector('.wishlist-items-container');

  if (!wishlistContainer) return;

  if (wishlistItems.length === 0) {
    wishlistContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🤍</div>
        <h3 class="empty-state-title">Your Wishlist is empty</h3>
        <p class="empty-state-text">Save your favorite items to your wishlist</p>
        <button class="btn btn-primary" onclick="window.location.href='products.html'">Explore Products</button>
      </div>
    `;
    return;
  }

  wishlistContainer.innerHTML = wishlistItems.map(item => `
    <div class="wishlist-item" style="display: flex; gap: 1.5rem; padding: 1rem; border-bottom: 1px solid var(--border-color); align-items: center;">
      <img src="${getProductImageUrl(item.image)}" 
           alt="${item.name}" 
           style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;"
           >
      <div class="wishlist-item-details" style="flex: 1;">
        <div class="wishlist-item-title" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">${item.name}</div>
        <div class="wishlist-item-price" style="color: var(--accent-color); font-weight: 700;">₹${item.price}</div>
      </div>
      <div class="wishlist-item-actions" style="display: flex; gap: 0.8rem;">
        <button class="btn btn-primary btn-small" onclick="moveWishlistItemToCart(${item.id})">Move to Cart</button>
        <button class="btn btn-danger btn-small" onclick="removeFromWishlist(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠️',
    info: 'ℹ️'
  };

  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ============================================
// UTILITIES
// ============================================

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(price);
}

// Prevent right-click on images (optional anti-theft feature)
document.addEventListener('contextmenu', (e) => {
  if (e.target.classList.contains('product-image') || e.target.classList.contains('product-image-large')) {
    e.preventDefault();
    return false;
  }
});

// ============================================
// AI SHOPPING ASSISTANT CHATBOT
// ============================================

// Helper function to get main category from product category
function getMainCategory(productCategory) {
  if (productCategory.startsWith('women-')) return 'women';
  if (productCategory.startsWith('kids-')) return 'kids';
  if (productCategory.startsWith('beauty-')) return 'beauty';
  return 'men'; // default
}

// Modular functions for product filtering and rendering
function filterProducts(category, budgetRange = null) {
  let filtered = PRODUCTS.filter(product => getMainCategory(product.category) === category);

  if (budgetRange) {
    const [min, max] = budgetRange;
    filtered = filtered.filter(product => product.price >= min && product.price <= max);
  }

  return filtered;
}

function recommendProducts(category, budgetRange = null) {
  let products = filterProducts(category, budgetRange);
  // Sort by rating (highest first) and return top 3
  return products.sort((a, b) => b.rating - a.rating).slice(0, 3);
}

function renderProductImages(products, container) {
  if (!container) return;

  products.forEach(product => {
    const img = document.createElement('img');

    img.src = getProductImageUrl(product.image);
    img.alt = product.name;
    img.className = 'product-image-thumb';

    img.onerror = function () {
      this.onerror = null;
      this.remove(); // completely remove broken image
    };

    img.addEventListener('click', () =>
      showProductDetails(product, container)
    );

    container.appendChild(img);
  });

  container.scrollTop = container.scrollHeight;
}
function showProductDetails(product, container) {
  const details = document.createElement('div');
  details.className = 'message bot product-details';
  details.innerHTML = `
    <img src="${getProductImageUrl(product.image)}" alt="${product.name}"  style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
    <h4>${product.name}</h4>
    <p><strong>Brand:</strong> ${product.brand}</p>
    <p><strong>Price:</strong> ₹${product.price.toLocaleString()}</p>
    <p><strong>Rating:</strong> ⭐ ${product.rating || 'N/A'}</p>
    <button class="option-btn" onclick="addToCart(${product.id})">Add to Cart</button>
  `;
  container.appendChild(details);
  container.scrollTop = container.scrollHeight;
}

let selectedCategory = null;
let currentStep = 'category';
let currentFlow = null;
let userSelections = {};

const chatSteps = [
  {
    message: "Hi! I'm your shopping assistant 🤖",
    options: ["Men 👕", "Women 👗", "Kids 🧸", "Beauty 💄"],
    key: "category"
  }
];

function initChat() {
  const chatIcon = document.getElementById('chat-icon');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatOptions = document.getElementById('chat-options');

  if (!chatIcon || !chatWindow) return; // Safety check

  function resetChat() {
    selectedCategory = null;
    currentStep = 'category';
    currentFlow = null;
    userSelections = {};
    chatMessages.innerHTML = '';
    chatOptions.innerHTML = '';
  }

  chatIcon.addEventListener('click', () => {
    chatWindow.classList.add('chat-visible');
    resetChat();
    showMessage(chatSteps[0].message, 'bot');
    showOptions(chatSteps[0].options);
  });

  chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('chat-visible');
    resetChat(); // Reset on close
  });

  function showMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showOptions(options) {
    chatOptions.innerHTML = '';
    options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = option;
      btn.onclick = () => handleOptionClick(option);
      chatOptions.appendChild(btn);
    });
  }

  function handleOptionClick(option) {
    console.log('Clicked:', option);
    showMessage(option, 'user');

    if (currentStep === 'category') {
      handleCategorySelection(option);
      return;
    }

    if (currentStep === 'action') {
      const action = option.replace(/[💸⚖️🤖]/g, '').trim();
      if (action === 'Budget') {
        currentStep = 'budget';
        handleBudget();
      } else if (action === 'Compare') {
        currentStep = 'compare';
        handleCompare();
      } else if (action === 'Recommend me') {
        currentStep = 'recommend';
        handleRecommend();
      }
      return;
    }

    if (currentStep === 'budget') {
      handleBudget(option);
    }
  }

  function handleCategorySelection(option) {
    selectedCategory = option.replace(/ 👕| 👗| 🧸| 💄/g, '').toLowerCase();
    currentStep = 'action';
    chatOptions.innerHTML = '';
    showMessage("What would you like to do?", 'bot');
    showOptions(["💸 Budget", "⚖️ Compare", "🤖 Recommend me"]);
  }

  function handleBudget(range) {
    if (currentStep === 'action') {
      showMessage("Select your budget range", 'bot');
      showOptions(["500-1000", "1000-2000", "2000-5000"]);
      return;
    }

    userSelections.budget = range;
    let budgetRange = null;

    if (range === '500-1000') {
      budgetRange = [500, 1000];
    } else if (range === '1000-2000') {
      budgetRange = [1000, 2000];
    } else if (range === '2000-5000') {
      budgetRange = [2000, 5000];
    }

    const products = filterProducts(selectedCategory, budgetRange);
    chatOptions.innerHTML = '';

    if (products.length > 0) {
      showMessage(`Here are products in the ${selectedCategory} category within your budget. Click any image for details:`, 'bot');
      renderProductImages(products.slice(0, 6), chatMessages);
    } else {
      showMessage(`No products found in the ${selectedCategory} category within your budget range.`, 'bot');
    }
  }

  function handleCompare() {
    chatOptions.innerHTML = '';
    const products = filterProducts(selectedCategory);

    if (products.length >= 3) {
      products.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      const lowest = products[0];
      const highest = products[products.length - 1];
      const middleIndex = Math.floor(products.length / 2);
      const middle = products[middleIndex];

      const compareProducts = [lowest, middle, highest];

      showMessage(`Comparing products in ${selectedCategory} category:`, 'bot');

      compareProducts.forEach((product, index) => {
        const comparison = document.createElement('div');
        comparison.className = 'message bot product-comparison';
        const highlight = index === 1 ? ' (RECOMMENDED - Best balanced choice)' : '';
        comparison.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${getProductImageUrl(product.image)}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" >
            <div>
              <strong>${product.name}</strong><br>
              Rating: ⭐ ${product.rating || 'N/A'} | Price: ₹${product.price.toLocaleString()}${highlight}
            </div>
          </div>
        `;
        chatMessages.appendChild(comparison);
      });

      showMessage("The middle-rated product is the best balanced option in terms of price and performance.", 'bot');
    } else {
      showMessage(`Not enough products available in the ${selectedCategory} category for comparison.`, 'bot');
    }
  }

  function handleRecommend() {
    chatOptions.innerHTML = '';
    const products = filterProducts(selectedCategory);

    if (products.length > 0) {
      products.sort((a, b) => b.price - a.price);
      const recommendedProduct = products[0];

      showMessage("This is the best premium product in this category.", 'bot');
      showProductDetails(recommendedProduct, chatMessages);
      showMessage("Thank you for using our assistant 😊", 'bot');
    } else {
      showMessage(`No products found in the ${selectedCategory} category.`, 'bot');
    }
  }

  function showTypingAnimation() {
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
      if (typing.parentNode) {
        chatMessages.removeChild(typing);
      }
    }, 3000);
  }
}


