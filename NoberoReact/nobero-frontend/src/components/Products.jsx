import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [minDiscount, setMinDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(Infinity);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        setError("Error fetching the product data");
        console.error("Error fetching the product data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const newFilteredProducts = products.filter(product => {
        const price = parseFloat(product.price.replace(/â‚¹/, ''));
        const discount = parseFloat(product.discount.replace(/â‚¹/, ''));
        return (
          price >= minPrice &&
          price <= maxPrice &&
          discount >= minDiscount &&
          discount <= maxDiscount
        );
      });
      setFilteredProducts(newFilteredProducts);
    };

    applyFilters();
  }, [minPrice, maxPrice, minDiscount, maxDiscount, products]);

  if (loading) {
    return <p>Loading products...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  const categorizedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="products-container">
      <center><h1>Nobero Men's Products</h1></center>
      <div className="filters">
        <div className="filter-group">
          <label>Price Range:</label>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice === Infinity ? '' : maxPrice}
            onChange={(e) => setMaxPrice(parseFloat(e.target.value) || Infinity)}
          />
        </div>
        <div className="filter-group">
          <label>Discount Range:</label>
          <input
            type="number"
            placeholder="Min Discount"
            value={minDiscount}
            onChange={(e) => setMinDiscount(parseFloat(e.target.value) || 0)}
          />
          <input
            type="number"
            placeholder="Max Discount"
            value={maxDiscount === Infinity ? '' : maxDiscount}
            onChange={(e) => setMaxDiscount(parseFloat(e.target.value) || Infinity)}
          />
        </div>
      </div>
      {Object.keys(categorizedProducts).map((category, idx) => (
        <div key={idx} className="category-section">
          <h2 className="category-heading">{category}</h2>
          <div className="products-grid">
            {categorizedProducts[category].map((product, index) => (
              <Link to={`/product/${encodeURIComponent(product.url)}`} key={index} className="product-card">
              <div className="product-inner">
                <div className="product-front">
                  <img 
                    src={`https:${product.images[6]}`} 
                    alt={product.title} 
                    className="product-image"
                  />
                </div>
                <div className="product-back">
                  <h3>{product.title}</h3>
                  <p>Category: {product.category}</p>
                  <p>Price: ₹{product.price.replace(/â‚¹|₹/, '')}</p>
                  <p>Discount: {product.discount.replace(/â‚¹|₹/, '')}</p>
                  <p>Save: ₹{product.save_off.replace(/â‚¹|₹/, '')}</p>
                  <p>Location:<br></br> {product.description}</p>
                </div>
              </div>
            </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
