import { Search, ShoppingCart, User, MapPin, ChevronDown, LogOut, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Home");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default Bangalore
  const navigate = useNavigate();

  const locations = [
    { id: "home", name: "Home", address: "Your current address", lat: 12.9716, lng: 77.5946 },
    { id: "office", name: "Office", address: "Work address", lat: 12.9352, lng: 77.6245 },
    { id: "other", name: "Other", address: "Custom address", lat: 12.9716, lng: 77.5946 }
  ];

  const suggestions = search.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  const handleLocationSelect = (location: typeof locations[0]) => {
    setSelectedLocation(location.name);
    setShowLocationDropdown(false);
    setMapCenter({ lat: location.lat, lng: location.lng });
    // Store selected location in localStorage
    localStorage.setItem('selectedLocation', JSON.stringify(location));
  };

  const handleLocationClick = () => {
    setShowMapModal(true);
  };

  const handleMapLocationSelect = (lat: number, lng: number, address: string) => {
    const customLocation = {
      id: 'custom',
      name: 'Selected Location',
      address: address,
      lat: lat,
      lng: lng
    };
    handleLocationSelect(customLocation);
    setShowMapModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Load saved location on mount
  useState(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      setSelectedLocation(location.name);
      if (location.lat && location.lng) {
        setMapCenter({ lat: location.lat, lng: location.lng });
      }
    }
  });

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container flex items-center gap-3 h-14 md:h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 hover-lift">
          <img src={logo} alt="QuickCart" className="w-10 h-10 md:w-12 md:h-12 object-contain" width={48} height={48} />
          <span className="font-bold text-xl hidden sm:block text-foreground">QuickCart</span>
        </Link>

        {/* Location */}
        <div className="hidden md:flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors shrink-0">
          <MapPin className="w-3.5 h-3.5 text-accent" />
          <span className="font-medium text-foreground hidden sm:inline">
            Deliver to {selectedLocation}
          </span>
          <span className="font-medium text-foreground sm:hidden">
            {selectedLocation}
          </span>
          <button
            onClick={handleLocationClick}
            className="ml-2 p-1 hover:bg-accent/20 rounded transition-colors"
            title="Select delivery location on map"
          >
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>

        {/* Mobile Location Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span className="font-medium text-foreground">
              {selectedLocation}
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>

        {/* Mobile Location Dropdown */}
        {showLocationDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg shadow-lg border border-border overflow-hidden animate-fade-in z-50 md:hidden w-48">
            {locations.map((location) => (
              <DropdownMenuItem
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className="cursor-pointer"
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{location.name}</span>
                  <span className="text-xs text-muted-foreground">{location.address}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <button
                onClick={() => {
                  const newLocation = prompt('Enter delivery address:');
                  if (newLocation) {
                    const customLocation = {
                      id: 'custom',
                      name: 'Custom',
                      address: newLocation,
                      lat: 12.9716,
                      lng: 77.5946
                    };
                    handleLocationSelect(customLocation);
                  }
                }}
                className="w-full text-left text-sm text-primary"
              >
                + Add New Address
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <button
                onClick={handleLocationClick}
                className="w-full text-left text-sm text-primary flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Select on Map
              </button>
            </DropdownMenuItem>
          </div>
        )}

        {/* Google Maps Modal */}
        {showMapModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] mx-auto overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold">Select Delivery Location</h3>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              {/* Google Maps Embed */}
              <div className="flex-1 mb-4 min-h-0">
                <iframe
                  src={`https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=15&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                />
              </div>
              
              <div className="text-sm text-gray-600 flex-shrink-0">
                <p>Click on the map to select your delivery location</p>
                <p className="mt-2">Or search for an address:</p>
                <input
                  type="text"
                  placeholder="Enter address..."
                  className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const address = (e.target as HTMLInputElement).value;
                      if (address) {
                        // Geocoding would go here - for demo, use Bangalore coordinates
                        handleMapLocationSelect(12.9716, 77.5946, address);
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex-1 relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search for groceries near ${selectedLocation}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full h-9 md:h-10 pl-9 pr-4 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg shadow-lg border border-border overflow-hidden animate-fade-in z-50">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onMouseDown={() => { navigate(`/product/${p.id}`); setSearch(""); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left"
                >
                  <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">₹{p.price} · {p.vendorName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center animate-scale-in">
                {totalItems}
              </span>
            )}
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <User className="w-5 h-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground">
                    {user.role === 'admin' ? 'Administrator' : user.role === 'vendor' ? 'Vendor' : 'Customer'}
                  </p>
                </div>
                <DropdownMenuSeparator />
                {user.role === 'admin' ? (
                  <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </DropdownMenuItem>
                ) : user.role === 'vendor' ? (
                  <DropdownMenuItem onClick={() => navigate('/vendor/dashboard')}>
                    <User className="w-4 h-4 mr-2" />
                    Vendor Dashboard
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login')} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <User className="w-5 h-5 text-foreground" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
