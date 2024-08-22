import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { url } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Received URL parameter:", url); 

    if (!url) {
      setError("Product URL is undefined");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${url}/`);
        setProduct(response.data);
      } catch (error) {
        setError("Error fetching product details");
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [url]);

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='body'>
      <div className="product-detail">
        <div className="product-image-container">
          {product.images.map((image, index) => (
            <img 
              key={index}
              src={`https:${image}`} 
              alt={`Product image ${index + 1}`} 
              className={`product-image-scroll ${index === 2 ? 'active' : ''}`} 
            />
          ))}
        </div>
        <div className="product-content">
          <h2>{product.title}</h2>
          <p className="price">Price: ₹{product.price.replace(/â‚¹/, '')}</p>
          <p className="discount">Discount: {product.discount.replace(/â‚¹/, '')}</p>
          <p className="save">Save: ₹{product.save_off.replace(/â‚¹/, '')}</p>
          <p>Fit: {product.attributes.Fit}</p>
          <p>Fabric: {product.attributes.Fabric}</p>
          <p>Neck: {product.attributes.Neck}</p>
          <p>Sleeve: {product.attributes.Sleeve}</p>
          <p>Pattern: {product.attributes.Pattern}</p>
          <p>Length: {product.attributes.Length}</p>
          <p className="description">Location: {product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
