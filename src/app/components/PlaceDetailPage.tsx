import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Bookmark, Share2, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';

// Mock data for all places
const PLACES_DATA = {
  '1': {
    id: '1',
    name: 'Hidden Waterfall Trail',
    city: 'Pune',
    state: 'Maharashtra',
    tags: ['adventure', 'nature', 'trek'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=80',
    description: 'A beautiful hidden waterfall perfect for adventure seekers',
    blogs: [
      {
        id: '1',
        author: 'Rajesh Kumar',
        content: 'This place is absolutely amazing! The trek is moderate and the waterfall view is breathtaking. Best time to visit is during monsoon season when the water flow is at its peak.',
        upvotes: 24,
        downvotes: 2,
        comments: 5,
        date: '3 days ago',
      },
      {
        id: '2',
        author: 'Priya Sharma',
        content: 'Went there last weekend with my family. The trail is well-marked and there are plenty of spots to rest. Carry enough water and snacks! The local guides are very helpful.',
        upvotes: 18,
        downvotes: 1,
        comments: 3,
        date: '1 week ago',
      },
    ],
    tips: [
      {
        id: '1',
        author: 'Arjun Patel',
        content: 'Start early morning to avoid crowd and heat. Wear good trekking shoes with grip as the rocks can be slippery!',
        upvotes: 15,
        downvotes: 0,
        comments: 2,
        date: '5 days ago',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Cozy Corner Café',
    city: 'Mumbai',
    state: 'Maharashtra',
    tags: ['chill', 'café', 'food'],
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80',
    description: 'Perfect spot for coffee and conversation',
    blogs: [
      {
        id: '1',
        author: 'Neha Desai',
        content: 'This café has the most amazing ambience! The cold coffee is to die for and their sandwiches are freshly made. Perfect spot for catching up with friends or working remotely.',
        upvotes: 32,
        downvotes: 1,
        comments: 8,
        date: '2 days ago',
      },
      {
        id: '2',
        author: 'Vikram Mehta',
        content: 'Been coming here for 2 years now. The staff knows me by name! Their masala chai and cheese toast combo is the best breakfast option in the area. WiFi is fast and stable.',
        upvotes: 28,
        downvotes: 0,
        comments: 6,
        date: '1 week ago',
      },
      {
        id: '3',
        author: 'Anjali Singh',
        content: 'Love the cozy vibe here. Great place to read a book with a cappuccino. They also have board games which is fun. Prices are reasonable for Mumbai standards.',
        upvotes: 21,
        downvotes: 2,
        comments: 4,
        date: '2 weeks ago',
      },
    ],
    tips: [
      {
        id: '1',
        author: 'Karan Kapoor',
        content: 'Visit during weekday mornings to get a window seat. The place gets packed on weekends after 11 AM. Their brownie with ice cream is a must-try!',
        upvotes: 19,
        downvotes: 0,
        comments: 3,
        date: '4 days ago',
      },
      {
        id: '2',
        author: 'Sana Qureshi',
        content: 'They have a loyalty card system - buy 10 coffees, get 1 free! Also, parking can be tricky, better to take public transport or auto.',
        upvotes: 12,
        downvotes: 1,
        comments: 2,
        date: '10 days ago',
      },
    ],
  },
  '3': {
    id: '3',
    name: 'Gateway of India',
    city: 'Mumbai',
    state: 'Maharashtra',
    tags: ['tourist', 'historical', 'landmark'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
    description: 'Iconic historical monument',
    blogs: [
      {
        id: '1',
        author: 'Aditya Iyer',
        content: 'An absolute must-visit in Mumbai! The architecture is stunning and the view of the Arabian Sea is spectacular. Best to visit during sunrise or sunset for amazing photos.',
        upvotes: 45,
        downvotes: 3,
        comments: 12,
        date: '5 days ago',
      },
      {
        id: '2',
        author: 'Meera Nair',
        content: 'The historical significance of this place is immense. Took a guided tour which was very informative. You can also take a ferry ride to Elephanta Caves from here.',
        upvotes: 38,
        downvotes: 2,
        comments: 9,
        date: '1 week ago',
      },
      {
        id: '3',
        author: 'Rohan Malhotra',
        content: 'Great place for street photography. The surrounding area has many food stalls and you can try vada pav and bhel puri. Can get very crowded during holidays.',
        upvotes: 29,
        downvotes: 1,
        comments: 7,
        date: '3 weeks ago',
      },
    ],
    tips: [
      {
        id: '1',
        author: 'Deepak Reddy',
        content: 'Go early in the morning around 6-7 AM to avoid crowds and get the best photos. Beware of touts and overpriced boat rides. Fixed prices are displayed at official counters.',
        upvotes: 34,
        downvotes: 0,
        comments: 5,
        date: '6 days ago',
      },
      {
        id: '2',
        author: 'Kavita Joshi',
        content: 'Don\'t miss the Taj Palace Hotel right next to it. The area is well-lit at night and looks beautiful. Street food nearby is good but stick to busy stalls.',
        upvotes: 26,
        downvotes: 1,
        comments: 4,
        date: '2 weeks ago',
      },
    ],
  },
  '4': {
    id: '4',
    name: 'Sunset Beach',
    city: 'Goa',
    state: 'Goa',
    tags: ['chill', 'beach', 'sunset'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
    description: 'Beautiful beach with stunning sunsets',
    blogs: [
      {
        id: '1',
        author: 'Ishaan Verma',
        content: 'One of the best beaches in Goa! The sunset here is absolutely magical. The beach is cleaner than most touristy beaches and has a peaceful vibe. Perfect for couples and families.',
        upvotes: 41,
        downvotes: 2,
        comments: 11,
        date: '1 day ago',
      },
      {
        id: '2',
        author: 'Tanvi Chopra',
        content: 'Spent an entire evening here just watching the sunset and it was worth every minute. The shacks serve great seafood and cold beer. Music is not too loud which I appreciated.',
        upvotes: 35,
        downvotes: 1,
        comments: 8,
        date: '4 days ago',
      },
      {
        id: '3',
        author: 'Rahul Bhat',
        content: 'Great for water sports during the day and chilling in the evening. The locals are friendly and the beach is relatively safe for swimming. Lifeguards are present.',
        upvotes: 27,
        downvotes: 0,
        comments: 6,
        date: '1 week ago',
      },
    ],
    tips: [
      {
        id: '1',
        author: 'Pooja Menon',
        content: 'Arrive at least 30 minutes before sunset to get a good spot. The beach shacks have sunbeds you can rent. Try the grilled fish - it\'s fresh and delicious!',
        upvotes: 31,
        downvotes: 1,
        comments: 7,
        date: '3 days ago',
      },
      {
        id: '2',
        author: 'Sameer Gupta',
        content: 'Rent a scooter to get here easily. Parking is available but fills up fast in evening. Bring mosquito repellent for later hours. Beach is clean but do your part!',
        upvotes: 24,
        downvotes: 0,
        comments: 5,
        date: '1 week ago',
      },
    ],
  },
};

interface PlaceDetailPageProps {
  user: any;
}

export function PlaceDetailPage({ user }: PlaceDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent'>('upvotes');
  const [comment, setComment] = useState('');
  const [bookmarked, setBookmarked] = useState(false);

  // Get the current place data, fallback to first place if not found
  const currentPlace = PLACES_DATA[id as keyof typeof PLACES_DATA] || PLACES_DATA['1'];

  useEffect(() => {
    // Check if place is already bookmarked
    if (user) {
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.email}`);
      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        setBookmarked(bookmarks.some((b: any) => b.id === id));
      }
    }
  }, [user, id]);

  const handleBookmarkToggle = () => {
    if (!user) {
      alert('Please login to bookmark places');
      navigate('/login');
      return;
    }

    const savedBookmarks = localStorage.getItem(`bookmarks_${user.email}`) || '[]';
    let bookmarks = JSON.parse(savedBookmarks);

    if (bookmarked) {
      // Remove bookmark
      bookmarks = bookmarks.filter((b: any) => b.id !== id);
      setBookmarked(false);
    } else {
      // Add bookmark
      const bookmarkData = {
        id: currentPlace.id,
        name: currentPlace.name,
        city: currentPlace.city,
        state: currentPlace.state,
        tags: currentPlace.tags,
        rating: currentPlace.rating,
        image: currentPlace.image,
        description: currentPlace.description,
        bookmarkedAt: new Date().toISOString(),
      };
      bookmarks.push(bookmarkData);
      setBookmarked(true);
    }

    localStorage.setItem(`bookmarks_${user.email}`, JSON.stringify(bookmarks));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-neutral-900 ml-64">
      {/* Header Image */}
      <div className="relative h-96">
        <img
          src={currentPlace.image}
          alt={currentPlace.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent" />
        
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-neutral-900/80 hover:bg-neutral-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Title & Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-4xl font-bold text-white mb-2">{currentPlace.name}</h1>
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>{currentPlace.city}, {currentPlace.state}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              <span>{currentPlace.rating}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {currentPlace.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-green-900/30 text-green-400">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <Button
            onClick={handleBookmarkToggle}
            className={bookmarked ? 'bg-green-600 hover:bg-green-700' : 'bg-neutral-900/80 hover:bg-neutral-900'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
          </Button>
          <Button onClick={handleShare} className="bg-neutral-900/80 hover:bg-neutral-900">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-8">
        <Tabs defaultValue="blogs" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-neutral-800">
              <TabsTrigger value="blogs" className="data-[state=active]:bg-green-600">
                Blogs ({currentPlace.blogs.length})
              </TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:bg-green-600">
                Tips ({currentPlace.tips.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={sortBy === 'upvotes' ? 'default' : 'outline'}
                onClick={() => setSortBy('upvotes')}
                className={sortBy === 'upvotes' ? 'bg-green-600' : ''}
              >
                Upvotes
              </Button>
              <Button
                size="sm"
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                onClick={() => setSortBy('recent')}
                className={sortBy === 'recent' ? 'bg-green-600' : ''}
              >
                Recent
              </Button>
            </div>
          </div>

          <TabsContent value="blogs" className="space-y-4">
            {currentPlace.blogs.map((blog) => (
              <Card key={blog.id} className="bg-neutral-800 border-neutral-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{blog.author}</h3>
                    <p className="text-sm text-neutral-500">{blog.date}</p>
                  </div>
                </div>
                <p className="text-neutral-300 mb-4">{blog.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-neutral-400 hover:text-green-500">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{blog.upvotes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-neutral-400 hover:text-red-500">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{blog.downvotes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-neutral-400 hover:text-blue-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{blog.comments}</span>
                  </button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            {currentPlace.tips.map((tip) => (
              <Card key={tip.id} className="bg-neutral-800 border-neutral-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{tip.author}</h3>
                    <p className="text-sm text-neutral-500">{tip.date}</p>
                  </div>
                </div>
                <p className="text-neutral-300 mb-4">{tip.content}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-neutral-400 hover:text-green-500">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{tip.upvotes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-neutral-400 hover:text-red-500">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{tip.downvotes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-neutral-400 hover:text-blue-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{tip.comments}</span>
                  </button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Add Comment */}
        <Card className="bg-neutral-800 border-neutral-700 p-6 mt-6">
          <h3 className="text-white font-semibold mb-4">Add a Comment</h3>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="bg-neutral-900 border-neutral-700 text-white mb-4"
            rows={3}
          />
          <Button className="bg-green-600 hover:bg-green-700">
            Post Comment
          </Button>
        </Card>
      </div>
    </div>
  );
}