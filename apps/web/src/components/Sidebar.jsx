import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, ShoppingBag, BookOpen, FileText, 
  Leaf, MessageSquare, HelpCircle, Phone,
  Instagram, Facebook, Youtube, MessageCircle, X, Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: ShoppingBag },
    { name: 'Our Story', path: '/our-story', icon: BookOpen },
    { name: 'Lab Reports', path: '/lab-reports', icon: FileText },
    { name: 'Contact Us', path: '/contact', icon: Phone },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-[100dvh] w-[280px] z-50
        bg-gradient-to-b from-green-950 via-green-900 to-green-800 text-white
        shadow-2xl md:shadow-none
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Top Section: Logo & Tagline */}
        <div className="p-8 flex flex-col items-center relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 md:hidden text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
          
          <Link
  to="/"
  className="flex flex-col items-center text-center"
  onClick={onClose}
>
  {/* Logo */}
  <img
    src="images/logo.png"
    alt="SattViva Logo"
    className="w-32 mb-3 object-contain"
  />

  {/* Tagline */}
  <p className="heading-font text-sm text-primary-foreground/90 italic tracking-wider">
    When Purity Meets Life
  </p>
</Link>
          <div className="w-16 h-px bg-green-300/40 mt-6" />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 hide-scrollbar space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-background text-primary shadow-md' 
                    : 'text-primary-foreground/80 hover:hover:bg-green-700/40 hover:text-primary-foreground'
                  }
                `}
              >
                <Icon 
                  size={20} 
                  className={`transition-transform duration-200 ${isActive ? 'text-primary' : 'group-hover:scale-110 group-hover:text-green-300'}`} 
                />
                <span className="font-medium text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 space-y-6 mt-auto bg-black/10 backdrop-blur-sm">
          {/* Free Shipping Card */}
          <div className="bg-primary-foreground/10 border border-secondary/30 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-secondary/20 p-2 rounded-lg text-green-300">
              <Truck size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary-foreground mb-1">Free Shipping</h4>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">On all orders above ₹999</p>
            </div>
          </div>

          {/* Need Help */}
          <div className="text-center space-y-1">
            <p className="text-xs text-primary-foreground/60 uppercase tracking-wider font-semibold mb-2">Need Help?</p>
            <a href="tel:+919876543210" className="text-green-300 font-medium hover:underline flex items-center justify-center gap-2">
              <Phone size={14} />
              +91 98765 43210
            </a>
            <p className="text-xs text-primary-foreground/50">Mon-Fri, 10AM-6PM IST</p>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-3 pt-2">
            {[Instagram, Facebook, MessageCircle, Youtube].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary-foreground/5 flex items-center justify-center text-primary-foreground/70 hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-110"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;