import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from '@/hooks/useCart';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import ShoppingCart from '@/components/ShoppingCart.jsx';

// Pages
import HomePage from '@/pages/HomePage.jsx';
import OurStoryPage from '@/pages/OurStoryPage.jsx';
import LabReportsPage from '@/pages/LabReportsPage.jsx';
import LoginPage from "@/pages/LoginPage.jsx";
// import RegisterPage from "@/pages/RegisterPage.jsx";
import MyOrdersPage from "@/pages/MyOrdersPage.jsx";
import AdminOrdersPage from "@/pages/AdminOrdersPage.jsx";

import StorePage from '@/pages/StorePage.jsx';
import ProductCatalog from '@/pages/ProductCatalog.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import SuccessPage from '@/pages/SuccessPage.jsx';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        
        <DashboardLayout onCartOpen={() => setIsCartOpen(true)}>
          <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/lab-reports" element={<LabReportsPage />} />
            
            
            <Route path="/store" element={<StorePage />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/register" element={<RegisterPage />} /> */}
            <Route path="/admin/orders" element={<AdminOrdersPage />}/>
            <Route path="/my-orders" element={<MyOrdersPage />}/>
            <Route path="*" element={
              <div className="min-h-[60vh] flex items-center justify-center bg-background">
                <div className="text-center px-4">
                  <h1 className="heading-font text-5xl font-bold text-primary mb-4">Page Not Found</h1>
                  <p className="text-muted-foreground text-lg mb-8 font-light">The page you are looking for does not exist or has been moved.</p>
                  <a href="/" className="inline-block bg-secondary text-secondary-foreground px-8 py-3 rounded-full tracking-wide font-semibold hover:bg-secondary/90 transition-colors shadow-md">
                    Return to Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </DashboardLayout>
        
      </Router>
    </CartProvider>
  );
}

export default App;