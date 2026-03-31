// Place this file in: src/app/components/AuthPage.tsx

import { useState } from 'react';
import { User } from '../types';
import { DarkModeToggle } from './DarkModeToggle';
import { buildPath } from './Path';
import { storeToken } from '../tokenStorage';
import { jwtDecode } from 'jwt-decode';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

// Shape of the decoded JWT payload — must match what your backend puts in the token
interface JwtPayload {
  userId: string;
  name: string;
  email: string;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        // ── LOGIN ──────────────────────────────────────────────
        const obj = { email, password };
        const js = JSON.stringify(obj);

        const response = await fetch(buildPath('api/login'), {
          method: 'POST',
          body: js,
          headers: { 'Content-Type': 'application/json' }
        });

        const res = JSON.parse(await response.text());

        if (res.error && res.error.length > 0) {
          setError(res.error);
          return;
        }

        // Store JWT and decode user info from it
        const { accessToken } = res;
        storeToken(accessToken);
        const decoded = jwtDecode<JwtPayload>(accessToken);

        const user: User = {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          meals: []  // meals are fetched separately after login
        };

        localStorage.setItem('user_data', JSON.stringify(user));
        onLogin(user);

      } else {
        // ── REGISTER ───────────────────────────────────────────
        const obj = { name, email, password };
        const js = JSON.stringify(obj);

        const response = await fetch(buildPath('api/register'), {
          method: 'POST',
          body: js,
          headers: { 'Content-Type': 'application/json' }
        });

        const res = JSON.parse(await response.text());

        if (res.error && res.error.length > 0) {
          setError(res.error);
          return;
        }

        // After successful registration, log in automatically
        const { accessToken } = res;
        storeToken(accessToken);
        const decoded = jwtDecode<JwtPayload>(accessToken);

        const user: User = {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          meals: []
        };

        localStorage.setItem('user_data', JSON.stringify(user));
        onLogin(user);
      }

    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── UI — identical to original Figma design ──────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md border border-border">
        <h1 className="text-foreground text-center mb-2">What Do I Want to Eat?</h1>
        <p className="text-center text-muted-foreground mb-6">Never be indecisive about meals again</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              isLogin ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              !isLogin ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-foreground mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
