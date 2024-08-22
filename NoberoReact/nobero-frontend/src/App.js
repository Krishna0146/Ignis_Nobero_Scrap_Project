import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:url" element={<ProductDetail />} />
        </Routes>
    </Router>
  );
};

export default App;
