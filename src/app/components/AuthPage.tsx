import { useState } from 'react';
import type { User } from '../types';
import { DarkModeToggle } from './DarkModeToggle';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }

    const usersData = localStorage.getItem('users');
    const users: User[] = usersData ? JSON.parse(usersData) : [];

    if (isLogin) {
      const user = users.find(u => u.email === email);
      if (user) {
        localStorage.setItem('user_data', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setError('User already exists');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        meals: []
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user_data', JSON.stringify(newUser));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md border border-border">
        <h1 className="text-foreground text-center mb-2">What Do I Want to Eat?</h1>
        <p className="text-center text-muted-foreground mb-6">Never be indecisive about meals again</p>

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
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-4">
          {isLogin ? (
            <>Don't have an account?{' '}
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                className="text-primary underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                className="text-primary underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}