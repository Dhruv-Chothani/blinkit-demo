import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Store, Shield, Truck, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

const UserLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="QuickCart" className="w-20 h-20 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to QuickCart</CardTitle>
          <CardDescription>Choose your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Login Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Customer Login */}
            <Link to="/login/user" className="group">
              <Card className="hover-lift click-feedback border-2 hover:border-primary/50 transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <User className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">Customer</h3>
                  <p className="text-sm text-muted-foreground mb-4">Shop for groceries</p>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Vendor Login */}
            <Link to="/login/vendor" className="group">
              <Card className="hover-lift click-feedback border-2 hover:border-accent/50 transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <Store className="w-12 h-12 mx-auto mb-4 text-accent" />
                  <h3 className="font-semibold text-lg mb-2">Vendor</h3>
                  <p className="text-sm text-muted-foreground mb-4">Sell products</p>
                  <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Rider Login */}
            <Link to="/login/rider" className="group">
              <Card className="hover-lift click-feedback border-2 hover:border-green-500/50 transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <Truck className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold text-lg mb-2">Rider</h3>
                  <p className="text-sm text-muted-foreground mb-4">Deliver orders</p>
                  <Button variant="outline" className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                    Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Admin Login */}
            <Link to="/login/admin" className="group">
              <Card className="hover-lift click-feedback border-2 hover:border-destructive/50 transition-all duration-200">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-destructive" />
                  <h3 className="font-semibold text-lg mb-2">Admin</h3>
                  <p className="text-sm text-muted-foreground mb-4">System admin</p>
                  <Button variant="outline" className="w-full group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors">
                    Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Registration Links */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">New customer?</p>
                <Link to="/register/user" className="text-primary hover:underline text-sm font-medium">
                  Register as Customer
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Want to sell?</p>
                <Link to="/register/vendor" className="text-accent hover:underline text-sm font-medium">
                  Register as Vendor
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Want to deliver?</p>
                <Link to="/register/rider" className="text-green-600 hover:underline text-sm font-medium">
                  Register as Rider
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Admin access?</p>
                <Link to="/register/admin" className="text-destructive hover:underline text-sm font-medium">
                  Register as Admin
                </Link>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Demo Credentials</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="font-medium text-primary">Customer</p>
                <p className="text-muted-foreground">user@example.com</p>
                <p className="text-muted-foreground">password</p>
              </div>
              <div>
                <p className="font-medium text-accent">Vendor</p>
                <p className="text-muted-foreground">vendor@example.com</p>
                <p className="text-muted-foreground">password</p>
              </div>
              <div>
                <p className="font-medium text-green-600">Rider</p>
                <p className="text-muted-foreground">rider@example.com</p>
                <p className="text-muted-foreground">password</p>
              </div>
              <div>
                <p className="font-medium text-destructive">Admin</p>
                <p className="text-muted-foreground">admin@example.com</p>
                <p className="text-muted-foreground">password</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
