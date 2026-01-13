import React from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { GraduationCap, Shield, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import { BackgroundPattern } from '../BackgroundPattern';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate credentials here
    onLogin();
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Clean Background Pattern */}
      <BackgroundPattern variant="grid" />

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white rounded-2xl shadow-xl border border-border p-10">
          {/* Logo and Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-5 shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-primary text-3xl mb-2 font-bold">Veeru&apos;s Pro Academy</h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <p>Admin Portal - Secure Access</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@veerupro.academy"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-secondary border-border focus:ring-2 focus:ring-primary rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-secondary border-border focus:ring-2 focus:ring-primary rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-14 text-lg font-semibold shadow-md transition-all"
            >
              <Lock className="h-5 w-5 mr-2" />
              Sign In to Admin Panel
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-3">
            <a href="#" className="text-primary hover:underline font-medium block">
              Forgot password?
            </a>
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                For admin access issues, contact: <strong className="text-primary">admin@veerupro.academy</strong>
              </p>
            </div>
          </div>
        </Card>

        {/* Branding Footer */}
        <p className="text-center mt-8 text-white font-medium">
          © 2025 Veeru&apos;s Pro Academy - Elite Learning Platform
        </p>
      </div>
    </div>
  );
}
