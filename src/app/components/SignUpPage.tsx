import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, User, Mail, Lock, MapPinned } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';

interface SignUpPageProps {
  onSignup: (user: any) => void;
}

export function SignUpPage({ onSignup }: SignUpPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create user object
    const newUser = {
      id: Date.now().toString(),
      ...formData,
      badge: 'Localite',
      posts: [],
      comments: [],
      bookmarks: [],
    };

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some((u: any) => u.email === formData.email)) {
      alert('This email is already registered. Please login instead.');
      return;
    }
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Automatically save credentials for auto-login
    localStorage.setItem('savedCredentials', JSON.stringify({
      email: formData.email,
      password: formData.password,
      remember: true
    }));

    onSignup(newUser);
    navigate('/search');
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
          <h1 className="text-3xl font-bold text-white">Join OffCentre</h1>
          <p className="text-neutral-400 mt-2">Discover hidden gems around you</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="bg-neutral-800 rounded-xl p-8 border border-neutral-700">
          <div className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-white mb-2 block">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your full name"
                  className="pl-10 bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your@email.com"
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
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Create a password"
                  className="pl-10 bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-white mb-2 block">Location</Label>
              <div className="relative">
                <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="City, State"
                  className="pl-10 bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Create Account
            </Button>
          </div>

          <p className="text-center text-neutral-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-500 hover:text-green-400">
              Login
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