import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Auth = () => {
  const { signIn, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch {
      // toast handled in context
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthenticated && !loading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 pt-28">
        <div className="mx-auto w-full max-w-md px-4 sm:px-6">
          <FadeIn delay={100} className="mb-8 text-center">
            <h1 className="text-page-title mb-3">Sign in to MediSynic</h1>
            <p className="text-muted-foreground">
              Precision oncology and gene-therapy surveillance
            </p>
          </FadeIn>

          <FadeIn delay={200}>
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="text-section-title">Clinician sign-in</CardTitle>
                <CardDescription>Use the demo account to explore the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Signing in…' : 'Sign in'}
                  </Button>

                  <p className="text-caption text-center">
                    Demo login: {DEMO_EMAIL} / {DEMO_PASSWORD}
                  </p>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
