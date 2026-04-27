import React, { useState, useEffect, useCallback } from 'react';
import './ProductList.css';

const API_BASE_URL = 'http://localhost:5000/api';
const IMAGE_BASE_URL = 'http://localhost:5000/uploads';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x400?text=Fashion+Cart';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      // Cache products in state
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    
    // If it's a full URL
    if (imagePath.startsWith('http')) return imagePath;
    
    // Some products in seed have 'arito1.jpg' which might be in frontend public/images
    // But we prefer serving from backend uploads /uploads
    // We'll try backend first, fallback handles failure
    return `${IMAGE_BASE_URL}/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="product-list-container">
        <h2>Loading Products...</h2>
        <div className="products-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="product-card skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button className="retry-btn" onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>Products ({products.length})</h2>
        <button className="refresh-btn" onClick={fetchProducts}>
          Refresh
        </button>
      </div>
      
      {products.length === 0 ? (
        <div className="no-products">No products found.</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                  onError={(e) => {
                    // Try fallback to local public/images if backend upload fails
                    if (e.target.src !== PLACEHOLDER_IMAGE) {
                      if (!e.target.dataset.triedLocal) {
                        e.target.dataset.triedLocal = "true";
                        e.target.src = `/images/${product.image}`;
                      } else {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }
                    }
                  }}
                />
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
                <div className="product-footer">
                  <span className="product-price">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                  </span>
                  <button className="add-to-cart-btn">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;