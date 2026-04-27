import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ArrowLeft, Store } from "lucide-react";
import logo from "@/assets/logo.png";

const vendorRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
});

type VendorRegisterFormData = z.infer<typeof vendorRegisterSchema>;

const VendorRegisterPage = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const registerForm = useForm<VendorRegisterFormData>({
    resolver: zodResolver(vendorRegisterSchema),
  });

  const onRegister = async (data: VendorRegisterFormData) => {
    console.log('Vendor register form data:', data);
    const success = await register({ 
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'vendor',
      address: data.address,
      storeName: data.storeName,
      password: data.password
    });
    console.log('Register success:', success);
    if (success) {
      navigate('/vendor/dashboard');
    } else {
      registerForm.setError('root', { message: 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Login Options
        </Link>

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="QuickCart" className="w-16 h-16 object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Store className="w-6 h-6" />
              Vendor Registration
            </CardTitle>
            <CardDescription>Create your vendor account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...registerForm.register('name')}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  placeholder="Local Grocery Store"
                  {...registerForm.register('storeName')}
                />
                {registerForm.formState.errors.storeName && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.storeName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vendor@example.com"
                  {...registerForm.register('email')}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="9876543210"
                  {...registerForm.register('phone')}
                />
                {registerForm.formState.errors.phone && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Store Address</Label>
                <Input
                  id="address"
                  placeholder="456 Market St, Bangalore"
                  {...registerForm.register('address')}
                />
                {registerForm.formState.errors.address && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.address.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...registerForm.register('password')}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              {registerForm.formState.errors.root && (
                <p className="text-sm text-destructive">{registerForm.formState.errors.root.message}</p>
              )}

              <Button type="submit" className="w-full click-feedback" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Create Vendor Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login/vendor" className="text-primary hover:underline">
                  Login as Vendor
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
