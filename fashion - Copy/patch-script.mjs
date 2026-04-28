import fs from 'fs';

let content = fs.readFileSync('script.js', 'utf8');

const stateManagementReplacement = `
let CART = [];
let WISHLIST = [];
const CURRENT_USER_ID = 1;

function getCart() { return CART; }
function getWishlist() { return WISHLIST; }
function setCart(items) { CART = items; }
function setWishlist(items) { WISHLIST = items; }

async function fetchCart() {
  try {
    const res = await fetch('http://localhost:5000/api/cart/' + CURRENT_USER_ID);
    if (!res.ok) throw new Error("Failed to fetch cart");
    const data = await res.json();
    CART = data.map(item => ({
      cartItemId: item.id,
      id: item.productId,
      name: item.Product?.name || 'Product',
      price: item.Product?.price || 0,
      image: item.Product?.image || '',
      quantity: item.quantity
    }));
  } catch(e) { console.warn('fetchCart error:', e); }
}

async function fetchWishlist() {
  try {
    const res = await fetch('http://localhost:5000/api/wishlist/' + CURRENT_USER_ID);
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    const data = await res.json();
    WISHLIST = data.map(item => ({
      wishlistItemId: item.id,
      id: item.productId,
      name: item.Product?.name || 'Product',
      price: item.Product?.price || 0,
      image: item.Product?.image || ''
    }));
  } catch(e) { console.warn('fetchWishlist error:', e); }
}
`;

const cartFunctions = `
async function addToCart(product, quantity = 1) {
  let productId = typeof product === 'object' ? product.id : Number(product);
  if (!productId) return;
  try {
    await fetch('http://localhost:5000/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID, productId })
    });
    await fetchCart();
    updateCartCount();
    showToast('✓ Added to Bag', 'success');
  } catch(e) { console.error(e); }
}

function getProductDataFromDom(productId) {
  const productCard = document.querySelector(\`[data-product-id="\${productId}"]\`);
  if (!productCard) return null;
  return {
    id: productId,
    name: productCard.dataset.name || productCard.querySelector('.product-name')?.textContent?.trim(),
    price: Number(productCard.dataset.price || productCard.querySelector('.current-price')?.textContent.replace(/\\D/g, '') || 0),
    image: productCard.dataset.image || productCard.querySelector('img')?.src || ''
  };
}

async function removeFromCart(productId) {
  const item = CART.find(i => i.id === Number(productId));
  if (!item || !item.cartItemId) return;
  try {
    await fetch('http://localhost:5000/api/cart/remove/' + item.cartItemId, { method: 'DELETE' });
    await fetchCart();
    updateCartCount();
    if (document.body.id === 'cart-page') loadCartPage();
    showToast('Removed from Bag', 'info');
  } catch(e) { console.error(e); }
}

async function decreaseQuantity(productId) {
  const item = CART.find(i => i.id === Number(productId));
  if (!item || !item.cartItemId) return;
  try {
    await fetch('http://localhost:5000/api/cart/decrease/' + item.cartItemId, { method: 'PUT' });
    await fetchCart();
    updateCartCount();
    if (document.body.id === 'cart-page') loadCartPage();
  } catch(e) { console.error(e); }
}
`;

const wishlistFunctions = `
async function addToWishlist(productOrId) {
  let productId = typeof productOrId === 'object' ? productOrId.id : Number(productOrId);
  if (!productId) return;
  try {
    await fetch('http://localhost:5000/api/wishlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID, productId })
    });
    await fetchWishlist();
    updateWishlistCount();
    updateWishlistUI();
    showToast('Wishlist updated', 'success');
  } catch(e) { console.error(e); }
}

async function removeFromWishlist(productId) {
  await addToWishlist(productId);
  if (document.body.id === 'wishlist-page') loadWishlistPage();
}

async function toggleWishlist(productId) {
  await addToWishlist(productId);
}
`;

const isInWishlistReplacement = `
function isInWishlist(productId) {
  return WISHLIST.some(item => item.id === productId);
}
`;

const DOMContentLoadedReplacement = `
document.addEventListener("DOMContentLoaded", async () => {

  const fetchedProducts = await loadProducts();

  const safeProducts = fetchedProducts || [];

  console.log("Loaded products:", safeProducts.length);
  
  await fetchCart();
  await fetchWishlist();

  const pageId = document.body.id;
`;

const placeOrderReplacement = `
async function placeOrder() {
  const cartItems = getCart();
  if (cartItems.length === 0) {
    showToast('Your cart is empty', 'warning');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID, items: cartItems })
    });
    if (res.ok) {
      for (let item of cartItems) {
        await fetch(\`http://localhost:5000/api/cart/remove/\${item.cartItemId}\`, { method: 'DELETE' });
      }
      await fetchCart();
      updateCartCount();
      updateCheckoutSummary();
      showToast('✅ Order placed successfully! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'orders.html';
      }, 1500);
    } else {
      showToast('Order failed', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Error placing order', 'error');
  }
}
`;

content = content.replace(/function getCart\(\) \{[\s\S]*?function setWishlist\(wishlistItems\) \{[\s\S]*?\n\}/, stateManagementReplacement.trim());
content = content.replace(/document\.addEventListener\("DOMContentLoaded", async \(\) => \{[\s\S]*?const pageId = document\.body\.id;/, DOMContentLoadedReplacement.trim());
content = content.replace(/function addToCart\(product, quantity = 1\) \{[\s\S]*?function decreaseQuantity\(productId\) \{[\s\S]*?loadCartPage\(\);\n\}/, cartFunctions.trim());
content = content.replace(/function addToWishlist\(productOrId\) \{[\s\S]*?function toggleWishlist\(productId\) \{[\s\S]*?addToWishlist\(product\);\n\}/, wishlistFunctions.trim());
content = content.replace(/function isInWishlist\(productId\) \{[\s\S]*?return wishlistItems\.some\(item => item\.id === productId\);\n\}/, isInWishlistReplacement.trim());
content = content.replace(/function placeOrder\(\) \{[\s\S]*?1500\);\n\}/, placeOrderReplacement.trim());

fs.writeFileSync('script.js', content);
console.log('Script patched successfully');
