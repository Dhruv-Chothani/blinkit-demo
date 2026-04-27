import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { RiderAuthProvider } from "@/context/RiderAuthContext";
import { CartProvider } from "@/context/CartContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetail from "@/pages/ProductDetail";
import VendorStore from "@/pages/VendorStore";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import UserLogin from "@/pages/UserLogin";
import UserLoginPage from "@/pages/UserLoginPage";
import VendorLoginPage from "@/pages/VendorLoginPage";
import RiderLoginPage from "@/pages/RiderLoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import UserRegisterPage from "@/pages/UserRegisterPage";
import VendorRegisterPage from "@/pages/VendorRegisterPage";
import RiderRegisterPage from "@/pages/RiderRegisterPage";
import AdminRegisterPage from "@/pages/AdminRegisterPage";
import UserProfile from "@/pages/UserProfile";
import VendorDashboard from "@/pages/VendorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import RiderDashboard from "@/pages/RiderDashboard";
import RiderOrders from "@/pages/RiderOrders";
import RiderProfile from "@/pages/RiderProfile";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import OrderMapPage from "@/pages/OrderMapPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <RiderAuthProvider>
              <CartProvider>
                <Routes>
                  {/* Routes with Navbar */}
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  <Route path="/category/:category" element={<Layout><CategoryPage /></Layout>} />
                  <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
                  <Route path="/vendor/:id" element={<Layout><VendorStore /></Layout>} />
                  <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                  <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
                  <Route path="/track-order/:orderId" element={<Layout><OrderTrackingPage /></Layout>} />
                  <Route path="/track-map/:orderId" element={<Layout><OrderMapPage /></Layout>} />
                  <Route path="/profile" element={<Layout><UserProfile /></Layout>} />
                  <Route path="/vendor/dashboard" element={<Layout><VendorDashboard /></Layout>} />
                  <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
                  
                  {/* Rider Routes (without main Layout) */}
                  <Route path="/rider/dashboard" element={<RiderDashboard />} />
                  <Route path="/rider/orders" element={<RiderOrders />} />
                  <Route path="/rider/profile" element={<RiderProfile />} />
                  
                  {/* Routes without Navbar (Login/Register pages) */}
                  <Route path="/login" element={<UserLogin />} />
                  <Route path="/login/user" element={<UserLoginPage />} />
                  <Route path="/login/vendor" element={<VendorLoginPage />} />
                  <Route path="/login/rider" element={<RiderLoginPage />} />
                  <Route path="/login/admin" element={<AdminLoginPage />} />
                  <Route path="/register/user" element={<UserRegisterPage />} />
                  <Route path="/register/vendor" element={<VendorRegisterPage />} />
                  <Route path="/register/rider" element={<RiderRegisterPage />} />
                  <Route path="/register/admin" element={<AdminRegisterPage />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CartProvider>
            </RiderAuthProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
