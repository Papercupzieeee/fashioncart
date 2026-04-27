import fs from 'fs';

let content = fs.readFileSync('script.js', 'utf8');
content = content.replace(/\r\n/g, '\n');

const ordersReplacement = `
async function loadOrdersPage() {
  let orders = [];
  try {
    const res = await fetch('http://localhost:5000/api/orders/' + CURRENT_USER_ID);
    if (res.ok) {
      const data = await res.json();
      orders = data.data || [];
    }
  } catch (err) {
    console.error('fetch orders error', err);
  }

  const ordersContainer = document.querySelector('.orders-items-container');

  if (orders.length === 0) {
    if (ordersContainer) {
      ordersContainer.innerHTML = \`
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3 class="empty-state-title">No orders yet</h3>
          <p class="empty-state-text">Your order history will appear here</p>
          <button class="btn btn-primary" onclick="window.location.href='products.html'">Start Shopping</button>
        </div>
      \`;
    }
    return;
  }

  if (ordersContainer) {
    const groupedOrders = orders.reduce((groups, order) => {
      const date = new Date(order.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(order);
      return groups;
    }, {});

    ordersContainer.innerHTML = Object.entries(groupedOrders)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([date, orderItems]) => \`
        <div class="order-group">
          <h3 class="order-date">\${date}</h3>
          <div class="order-items">
            \${orderItems.map(order => \`
              <div class="order-item">
                <div class="order-image">
                  <img src="\${getProductImageUrl(order.product ? order.product.image : order.image)}" alt="\${order.product ? order.product.name : 'Product'}">
                </div>
                <div class="order-details">
                  <h4 class="order-name">\${order.product ? order.product.name : 'Unknown Product'}</h4>
                  <div class="order-price">
                    <span class="current-price">₹\${order.price}</span>
                    <span class="quantity">Qty: \${order.quantity || 1}</span>
                  </div>
                  <div class="order-status \${(order.status || 'placed').toLowerCase()}">
                    \${order.status || 'Placed'}
                  </div>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`).join('');
  }
}
`;

const spl1 = content.split('// ORDERS PAGE\n// ============================================\n\nfunction loadOrdersPage() {');
const preSection = spl1[0] + '// ORDERS PAGE\n// ============================================\n\n';
const postSectionStr = spl1[1];

const spl2 = postSectionStr.split('// ============================================\n// TOAST NOTIFICATIONS');
let postSectionContent = '\n// ============================================\n// TOAST NOTIFICATIONS' + spl2[1];

content = preSection + ordersReplacement.trim() + '\n' + postSectionContent;

content = content.replace(/onerror="this\.onerror=null;this\.src='\$\{LOCAL_FALLBACK_IMAGE\}'"/g, '');

fs.writeFileSync('script.js', content);
console.log('Orders page patched successfully.');
