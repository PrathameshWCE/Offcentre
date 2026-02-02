import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, Mountain, Coffee, Users, Heart, Shield, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Card } from '@/app/components/ui/card';
import logo from 'figma:asset/5ae4b0c49506b866536d27f05461c1989d8ee60b.png';

interface HomePageProps {
  user: any;
}

export function HomePage({ user }: HomePageProps) {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const categories = [
    { name: 'Chill Spots', icon: Coffee, filter: 'chill' },
    { name: 'Tourist Places', icon: Compass, filter: 'tourist' },
    { name: 'Adventure', icon: Mountain, filter: 'adventure' },
  ];

  const handleCategoryClick = (filter: string) => {
    navigate(`/search?category=${filter}`);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store feedback in localStorage
    const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    existingFeedback.push({
      ...feedbackForm,
      timestamp: new Date().toISOString(),
      user: user?.name || 'Anonymous'
    });
    localStorage.setItem('feedback', JSON.stringify(existingFeedback));
    
    // Reset form
    setFeedbackForm({ name: '', email: '', message: '' });
    alert('Thank you for your feedback!');
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Video */}
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background Video */}
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setVideoError(true)}
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-person-walking-on-a-mountain-trail-41-large.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
            }}
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Logo */}
          <img 
            src={logo} 
            alt="OffCentre Logo" 
            className="w-32 h-32 object-contain mb-6 drop-shadow-2xl"
          />

          {/* App Name & Tagline */}
          <h1 className="text-6xl font-bold text-white mb-4 text-center">OffCentre</h1>
          <p className="text-2xl text-green-400 mb-12 text-center">A Little Left. To The Heart.</p>

          {/* CTA Buttons */}
          <div className="flex gap-4 mb-16">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/search')}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Explore
                </button>
                <button
                  onClick={() => navigate('/post')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg font-semibold text-lg transition-all"
                >
                  Post a Place
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg font-semibold text-lg transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Featured Categories */}
          <div className="max-w-4xl w-full">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Explore Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.filter)}
                  className="p-6 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 hover:border-green-500/50 transition-all group"
                >
                  <category.icon className="w-12 h-12 text-green-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* App Information Section */}
      <section className="bg-neutral-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Discover Hidden Gems
          </h2>
          <p className="text-xl text-neutral-400 text-center mb-16 max-w-3xl mx-auto">
            OffCentre is your community-driven platform for discovering authentic local experiences, 
            hidden spots, and adventure destinations that go beyond the typical tourist trail.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-neutral-800 border-neutral-700 p-8">
              <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Location-First</h3>
              <p className="text-neutral-400">
                Explore places through an interactive map experience. Pin locations, set your search radius, 
                and discover hidden gems in your area.
              </p>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700 p-8">
              <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Community-Driven</h3>
              <p className="text-neutral-400">
                Share your favorite spots, read authentic reviews from locals, and contribute to a 
                growing community of explorers and adventure seekers.
              </p>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700 p-8">
              <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Curated Experiences</h3>
              <p className="text-neutral-400">
                From chill cafes to adventure trails, find places that match your vibe. 
                Plan your weekends with our smart planning tools.
              </p>
            </Card>
          </div>

          {/* Features List */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <h4 className="text-white font-semibold mb-2">Interactive Map Search</h4>
                <p className="text-neutral-400 text-sm">
                  Pin any location and explore places within your custom radius
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <h4 className="text-white font-semibold mb-2">Weekend Planner</h4>
                <p className="text-neutral-400 text-sm">
                  Plan your perfect weekend with multiple destinations and routes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <h4 className="text-white font-semibold mb-2">User Reviews & Ratings</h4>
                <p className="text-neutral-400 text-sm">
                  Read authentic reviews from real travelers and locals
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <h4 className="text-white font-semibold mb-2">Create & Share Posts</h4>
                <p className="text-neutral-400 text-sm">
                  Share your discoveries with photos, tips, and detailed information
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-neutral-950 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">About OffCentre</h2>
              <div className="space-y-4 text-neutral-400">
                <p>
                  Born from a passion for authentic travel experiences, OffCentre was created to help 
                  people discover the places that truly matter - the hidden cafes, secret viewpoints, 
                  and local favorites that make a destination special.
                </p>
                <p>
                  We believe the best travel experiences come from local knowledge and community 
                  recommendations, not from glossy guidebooks or sponsored listings.
                </p>
                <p>
                  Our platform is built by travelers, for travelers - whether you're seeking adventure, 
                  relaxation, or cultural experiences. We're here to help you find those "off-centre" 
                  spots that leave a lasting impression.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div>
                  <div className="text-3xl font-bold text-green-400">100+</div>
                  <div className="text-sm text-neutral-500">Places Shared</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">50+</div>
                  <div className="text-sm text-neutral-500">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">25+</div>
                  <div className="text-sm text-neutral-500">Cities Covered</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8">
                <Shield className="w-16 h-16 text-green-400 mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Our Values</h3>
                <ul className="space-y-3 text-neutral-400">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                    <span><strong className="text-white">Authenticity:</strong> Real experiences from real people</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                    <span><strong className="text-white">Community:</strong> Building connections through shared discoveries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                    <span><strong className="text-white">Exploration:</strong> Encouraging curiosity and adventure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                    <span><strong className="text-white">Trust:</strong> Maintaining transparency and honest reviews</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="bg-neutral-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">We'd Love to Hear From You</h2>
            <p className="text-xl text-neutral-400">
              Your feedback helps us improve OffCentre and create a better experience for everyone
            </p>
          </div>

          <Card className="bg-neutral-800 border-neutral-700 p-8">
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={feedbackForm.email}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Share your thoughts, suggestions, or report issues..."
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                  className="bg-neutral-900 border-neutral-700 text-white min-h-[150px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Feedback
              </Button>
            </form>
          </Card>

          <div className="mt-8 text-center text-sm text-neutral-500">
            <p>Built with ❤️ for adventurers and explorers everywhere</p>
          </div>
        </div>
      </section>
    </div>
  );
}