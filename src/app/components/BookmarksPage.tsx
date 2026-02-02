import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Star, ChevronRight, Trash2, Search } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface BookmarkedPlace {
  id: string;
  name: string;
  city: string;
  state: string;
  tags: string[];
  rating: number;
  image: string;
  description: string;
  bookmarkedAt: string;
}

interface BookmarksPageProps {
  user: any;
}

export function BookmarksPage({ user }: BookmarksPageProps) {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkedPlace[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'rating'>('recent');

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  const loadBookmarks = () => {
    if (!user) return;
    
    const savedBookmarks = localStorage.getItem(`bookmarks_${user.email}`);
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  };

  const removeBookmark = (placeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const updatedBookmarks = bookmarks.filter(b => b.id !== placeId);
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`bookmarks_${user.email}`, JSON.stringify(updatedBookmarks));
  };

  const clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to remove all bookmarks?')) {
      setBookmarks([]);
      localStorage.setItem(`bookmarks_${user.email}`, JSON.stringify([]));
    }
  };

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter(bookmark => 
      bookmark.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
        default:
          return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-neutral-900 ml-64 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Bookmarks</h1>
              <p className="text-neutral-400">
                {bookmarks.length} {bookmarks.length === 1 ? 'place' : 'places'} saved
              </p>
            </div>
            {bookmarks.length > 0 && (
              <Button
                variant="outline"
                onClick={clearAllBookmarks}
                className="border-red-600 text-red-500 hover:bg-red-600/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Search and Sort Controls */}
          {bookmarks.length > 0 && (
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={sortBy === 'recent' ? 'default' : 'outline'}
                  onClick={() => setSortBy('recent')}
                  className={sortBy === 'recent' ? 'bg-green-600' : ''}
                >
                  Recent
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  onClick={() => setSortBy('name')}
                  className={sortBy === 'name' ? 'bg-green-600' : ''}
                >
                  Name
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  onClick={() => setSortBy('rating')}
                  className={sortBy === 'rating' ? 'bg-green-600' : ''}
                >
                  Rating
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bookmarks List */}
        {filteredBookmarks.length > 0 ? (
          <div className="space-y-4">
            {filteredBookmarks.map((place) => (
              <Card
                key={place.id}
                className="bg-neutral-800 border-neutral-700 hover:border-green-600 transition-all cursor-pointer overflow-hidden group"
                onClick={() => navigate(`/place/${place.id}`)}
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-40 h-40 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">{place.name}</h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => removeBookmark(place.id, e)}
                        className="text-green-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Bookmark className="w-5 h-5 fill-green-400" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{place.city}, {place.state}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-white font-semibold">{place.rating}</span>
                    </div>

                    <div className="flex gap-2 mb-3 flex-wrap">
                      {place.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-green-900/30 text-green-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-neutral-400 mb-2">{place.description}</p>
                    
                    <p className="text-xs text-neutral-500">
                      Bookmarked {new Date(place.bookmarkedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-green-400 transition-colors self-center" />
                </div>
              </Card>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          // Empty state - no bookmarks
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
              <Bookmark className="w-12 h-12 text-neutral-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No Bookmarks Yet</h3>
            <p className="text-neutral-400 max-w-md mb-6">
              Start exploring and save your favorite places for easy access later. 
              Click the bookmark icon on any place to add it here.
            </p>
            <Button
              onClick={() => navigate('/search')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Explore Places
            </Button>
          </div>
        ) : (
          // No search results
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-16 h-16 text-neutral-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-neutral-400 max-w-md">
              Try adjusting your search query
            </p>
            <Button
              onClick={() => setSearchQuery('')}
              variant="outline"
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
