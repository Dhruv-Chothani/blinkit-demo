import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRiderAuth } from "@/context/RiderAuthContext";
import { Loader2, ArrowLeft, Truck } from "lucide-react";
import logo from "@/assets/logo.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const RiderLoginPage = () => {
  const { login, isLoading } = useRiderAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onLogin = async (data: LoginFormData) => {
    console.log('Rider login form data:', data);
    const success = await login(data.email, data.password);
    console.log('Login success:', success);
    if (success) {
      navigate('/rider/dashboard');
    } else {
      loginForm.setError('root', { message: 'Invalid email or password' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
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
              <Truck className="w-6 h-6 text-green-600" />
              Rider Login
            </CardTitle>
            <CardDescription>Login to your delivery partner account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="rider@example.com"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              {loginForm.formState.errors.root && (
                <p className="text-sm text-destructive">{loginForm.formState.errors.root.message}</p>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 click-feedback" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Login as Rider
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register/rider" className="text-green-600 hover:underline">
                  Register as Rider
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Demo credentials: rider@example.com / password
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiderLoginPage;
