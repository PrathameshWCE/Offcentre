import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, User, Lock } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Load saved credentials on component mount
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { email, password, remember } = JSON.parse(savedCredentials);
      if (remember) {
        setUsername(email);
        setPassword(password);
        setRememberMe(true);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in real app, validate against backend
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === username && u.password === password);
    
    if (user) {
      // Save credentials if Remember Me is checked
      if (rememberMe) {
        localStorage.setItem('savedCredentials', JSON.stringify({
          email: username,
          password: password,
          remember: true
        }));
      } else {
        // Clear saved credentials if Remember Me is unchecked
        localStorage.removeItem('savedCredentials');
      }

      onLogin(user);
      navigate('/search');
    } else {
      alert('Invalid credentials. Try signing up first!');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-4">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-neutral-400 mt-2">Login to continue exploring</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
          <div className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-white mb-2 block">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <Input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-neutral-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <label
                htmlFor="remember"
                className="text-sm text-neutral-400 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Login
            </Button>
          </div>

          <p className="text-center text-neutral-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-500 hover:text-green-400">
              Sign Up
            </Link>
          </p>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-neutral-500 hover:text-neutral-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}