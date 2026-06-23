import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero.jsx';
import TrustBar from '@/components/TrustBar.jsx';
import CategoryCards from '@/components/CategoryCards.jsx';
import ProductsList from '@/components/ProductsList.jsx';
import WhyChooseUs from '@/components/WhyChooseUs.jsx';
import ReviewsSlider from '@/components/ReviewsSlider.jsx';
import CertificationSection from '@/components/CertificationSection.jsx';

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="heading-font text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4"
    >
      {title}
    </motion.h2>
    <motion.div 
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="w-16 h-1 bg-secondary mx-auto mb-4 rounded-full" 
    />
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>SattViva Naturals | Premium Wood Pressed Oils & Traditional Foods</title>
        <meta name="description" content="Discover SattViva Naturals - Premium wood pressed oils, pure desi ghee, organic dry fruits, and authentic spices. Food the way nature intended." />
      </Helmet>

      <div className="bg-background">
        <Hero />
        <TrustBar />
        
      
        

        <WhyChooseUs />
        <ReviewsSlider />
        <CertificationSection />
      </div>
    </>
  );
};

export default HomePage;