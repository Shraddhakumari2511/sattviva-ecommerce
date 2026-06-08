import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';

const AnnouncementStrip = () => {
  const announcements = [
    "Get extra 2% off on prepaid orders",
    "100% Natural & Authentic",
    "Lab Tested for Purity",
    "No Preservatives Added"
  ];

  return (
    <div className="bg-background border-b border-border py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...announcements, ...announcements, ...announcements].map((text, index) => (
          <span key={index} className="mx-8 text-xs font-semibold text-primary uppercase tracking-widest flex items-center gap-4">
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};

const StickyHeader = ({ onMenuClick, onCartOpen }) => {
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md shadow-sm flex flex-col">
      <AnnouncementStrip />
      
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-foreground hover:bg-muted"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </Button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search products, oils, spices..." 
            className="pl-10 bg-card border-border focus-visible:ring-secondary rounded-full h-10 text-sm"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <Link to="/login" className="hidden lg:flex items-center gap-2 text-sm font-medium text-foreground hover:text-secondary transition-colors">
            <User size={18} />
            <span>Login / Signup</span>
          </Link>
          
          <div className="w-px h-6 bg-border hidden lg:block mx-2" />

          <Button
            variant="ghost"
            size="icon"
            className="relative text-foreground hover:bg-muted rounded-full"
            onClick={onCartOpen}
          >
            <ShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm border-2 border-background">
                {cartItemCount}
              </span>
            )}
          </Button>

          <Link to="/products" className="hidden sm:block">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-full px-6 gold-glow">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;