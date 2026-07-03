import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

const Hero = () => {
  const banners = [
    "images/banner1.png",
    "images/banner2.png",
    "images/banner3.png",
  ];
  
  const [currentBanner, setCurrentBanner] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-background overflow-hidden py-4 md:py-1 lg:py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-8 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Traditional Goodness</span>
            </div>
            
            <h1 className="heading-font text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
  Wood Pressed Oils.<br />
  <span className="text-secondary">Pure By Nature.</span>
</h1>
            
            <p className="body-font text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the authentic taste and health benefits of traditionally extracted oils, pure desi ghee, and organic spices. Crafted in small batches for your family's wellness.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-6 text-base rounded-full shadow-lg gold-glow">
                  Shop Oils
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/lab-reports">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-6 text-base rounded-full transition-colors">
                  <FileText className="mr-2 h-5 w-5" />
                  View Lab Reports
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative w-full max-w-lg mx-auto lg:max-w-none"
          >
            <div className="flex-1 relative w-full max-w-md mx-auto">
            <div className="relative h-[350px] md:h-[400px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-white">

<img
  src={banners[currentBanner]}
  alt="Banner"
  className="w-full h-full oobject-contain transition-all duration-700"
/>

<div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>

{/* Previous Button */}
<button
  onClick={() =>
    setCurrentBanner(
      currentBanner === 0
        ? banners.length - 1
        : currentBanner - 1
    )
  }
  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2"
>
  ❮
</button>

{/* Next Button */}
<button
  onClick={() =>
    setCurrentBanner(
      (currentBanner + 1) % banners.length
    )
  }
  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2"
>
  ❯
</button>

{/* Dots */}
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
  {banners.map((_, index) => (
    <button
      key={index}
      onClick={() => setCurrentBanner(index)}
      className={`w-3 h-3 rounded-full transition-all ${
        currentBanner === index
          ? "bg-white"
          : "bg-white/40"
      }`}
    />
  ))}
</div>

</div>
</div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;