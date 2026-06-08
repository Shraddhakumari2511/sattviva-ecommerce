
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const SuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Helmet>
        <title>Order Successful - SattViva Naturals</title>
        <meta name="description" content="Thank you for your order! Your journey to pure, traditional nutrition begins now." />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>

            <h1 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4">
              Order Successful
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Thank you for choosing SattViva Naturals. Your order has been confirmed and will be prepared with care. You will receive an email confirmation shortly.
            </p>

            <div className="bg-muted rounded-xl p-8 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="heading-font text-2xl font-semibold text-foreground">
                  What Happens Next?
                </h2>
              </div>
              <ul className="text-left space-y-3 text-muted-foreground max-w-md mx-auto">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>Your order will be freshly prepared in small batches</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>We will send you tracking details via email</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Your products will arrive fresh at your doorstep</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/store">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
