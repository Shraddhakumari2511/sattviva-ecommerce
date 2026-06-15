import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
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
 
  
const { user, logout } = useAuth();


const handleLogout = () => {
  logout();
  toast.success("Logged out successfully");
};
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
        <div>
          {user ? (
  <div className="hidden lg:flex items-center gap-4">
    <span className="text-sm font-medium text-foreground">
      Hi, {user.name}
    </span>

    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-secondary transition-colors"
    >
      <User size={18} />
      <span>Logout</span>
    </button>
  </div>
) : (
  <Link
    to="/login"
    className="hidden lg:flex items-center gap-2 text-sm font-medium text-foreground hover:text-secondary transition-colors"
  >
    <User size={18} />
    <span>Login / Signup</span>
  </Link>
)}
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;