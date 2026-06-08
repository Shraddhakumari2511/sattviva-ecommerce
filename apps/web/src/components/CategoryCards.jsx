import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CategoryCards = () => {
  const categories = [
    {
      title: 'Wood Pressed Oils',
      description: 'Traditional cold-pressed oils retaining natural goodness and authentic flavors',
      image: 'https://images.unsplash.com/photo-1631722470161-de959ae7db6b?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Pure Desi Ghee',
      description: 'Handcrafted ghee made from grass-fed cow milk using ancient methods',
      image: 'https://images.unsplash.com/photo-1671507136750-05ebd0f97843?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Premium Dry Fruits',
      description: 'Carefully selected nuts and dried fruits, naturally processed for freshness',
      image: 'https://images.unsplash.com/photo-1614061811009-82760cd2e83b?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Authentic Spices',
      description: 'Freshly ground spices that bring traditional flavors to your kitchen',
      image: 'https://images.unsplash.com/photo-1592457711340-2412dc07b733?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Health Punch',
      description: 'Nutrient-rich blends crafted for wellness and vitality',
      image: 'https://images.unsplash.com/photo-1618828822641-9d30cd929aff?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Combos & Deals',
      description: 'Thoughtfully curated bundles for complete natural nutrition',
      image: 'https://images.unsplash.com/photo-1673968796583-5c9d23b677e1?w=800&h=600&fit=crop',
      link: '/store'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Explore Our Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the finest selection of traditional foods, crafted with care and authenticity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={category.link} className="group block">
                <div className="relative overflow-hidden rounded-2xl shadow-lg h-80">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="heading-font text-3xl font-bold text-white mb-3">
                      {category.title}
                    </h3>
                    <p className="text-white/90 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <Button
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 group-hover:bg-white group-hover:text-primary transition-all"
                    >
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;