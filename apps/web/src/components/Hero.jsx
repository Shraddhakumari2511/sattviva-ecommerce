import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

const Hero = () => {
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
            
            <h1 className="heading-font text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
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
            <div className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
              <motion.img
                animate={{ y: [-10, 10, -10], rotate: [-1, 1, -1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                src="https://images.unsplash.com/photo-1664791461482-79f5deee490f?w=800&h=1000&fit=crop"
                alt="Premium mustard oil bottle on wooden platform with rustic aesthetic"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
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