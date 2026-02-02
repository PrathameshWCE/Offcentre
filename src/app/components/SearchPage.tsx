import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, ChevronRight, ZoomIn, ZoomOut, Navigation, X, Bookmark } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Slider } from '@/app/components/ui/slider';
import IndiaOSMMap from '@/app/components/IndiaOSMMap';
import { Marker, Circle, Tooltip } from 'react-leaflet';
import { divIcon } from 'leaflet';

// Mock data for places
const MOCK_PLACES = [
  {
    id: '1',
    name: 'Hidden Waterfall Trail',
    city: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    tags: ['adventure', 'nature', 'trek'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
    description: 'A beautiful hidden waterfall perfect for adventure seekers',
  },
  {
    id: '2',
    name: 'Cozy Corner Café',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    tags: ['chill', 'café', 'food'],
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    description: 'Perfect spot for coffee and conversation',
  },
  {
    id: '3',
    name: 'Gateway of India',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 18.9220,
    lng: 72.8347,
    tags: ['tourist', 'historical', 'landmark'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    description: 'Iconic historical monument',
  },
  {
    id: '4',
    name: 'Sunset Beach',
    city: 'Goa',
    state: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    tags: ['chill', 'beach', 'sunset'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    description: 'Beautiful beach with stunning sunsets',
  },
];

interface SearchPageProps {
  user: any;
}

export function SearchPage({ user }: SearchPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [radius, setRadius] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [pinnedLocation, setPinnedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [showRadiusDialog, setShowRadiusDialog] = useState(false);
  const [tempRadius, setTempRadius] = useState(50);
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load bookmarked places
    if (user) {
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.email}`);
      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        const bookmarkedIds = new Set(bookmarks.map((b: any) => b.id));
        setBookmarkedPlaces(bookmarkedIds);
      }
    }
  }, [user]);

  const handleBookmarkToggle = (place: any, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      alert('Please login to bookmark places');
      navigate('/login');
      return;
    }

    const savedBookmarks = localStorage.getItem(`bookmarks_${user.email}`) || '[]';
    let bookmarks = JSON.parse(savedBookmarks);

    if (bookmarkedPlaces.has(place.id)) {
      // Remove bookmark
      bookmarks = bookmarks.filter((b: any) => b.id !== place.id);
      setBookmarkedPlaces(prev => {
        const newSet = new Set(prev);
        newSet.delete(place.id);
        return newSet;
      });
    } else {
      // Add bookmark
      const bookmarkData = {
        id: place.id,
        name: place.name,
        city: place.city,
        state: place.state,
        tags: place.tags,
        rating: place.rating,
        image: place.image,
        description: place.description,
        bookmarkedAt: new Date().toISOString(),
      };
      bookmarks.push(bookmarkData);
      setBookmarkedPlaces(prev => new Set(prev).add(place.id));
    }

    localStorage.setItem(`bookmarks_${user.email}`, JSON.stringify(bookmarks));
  };

  const categories = [
    { value: 'chill', label: 'Local Chill Spots' },
    { value: 'tourist', label: 'Tourist Worth' },
    { value: 'adventure', label: 'Adventurous' },
  ];

  const filteredPlaces = MOCK_PLACES.filter((place) => {
    const matchesState = !state || place.state.toLowerCase().includes(state.toLowerCase());
    const matchesCity = !city || place.city.toLowerCase().includes(city.toLowerCase());
    const matchesCategory = !selectedCategory || place.tags.includes(selectedCategory);
    return matchesState && matchesCity && matchesCategory;
  });

  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    setPinnedLocation({ ...latlng, name: 'My Location' });
    setShowRadiusDialog(true);
  };

  const handleRadiusConfirm = () => {
    setRadius(tempRadius);
    setShowRadiusDialog(false);
  };

  const clearPin = () => {
    setPinnedLocation(null);
    setRadius(50);
  };

  // Custom Icons
  const placeIcon = divIcon({
    className: "bg-transparent",
    html: `<div class="w-4 h-4 bg-red-500 rounded-full shadow-lg ring-2 ring-red-500/30 transition-transform duration-300 hover:scale-150"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  const pinIconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#4ade80" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-green-400 drop-shadow-lg animate-bounce"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#171717" stroke="none"/></svg>`;
  
  const pinIcon = divIcon({
    className: "bg-transparent",
    html: pinIconHtml,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <div className="flex h-screen bg-neutral-900 ml-64">
      {/* Left Side - Map */}
      <div className="w-1/2 relative bg-neutral-800 border-r border-neutral-700">
        {/* Map Instructions */}
        {!pinnedLocation && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 bg-neutral-900/95 backdrop-blur-sm px-6 py-3 rounded-lg border border-green-600/50 shadow-xl">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Click anywhere on the map to pin your location
            </p>
          </div>
        )}

        {/* Current Pin Info */}
        {pinnedLocation && (
          <div className="absolute top-6 left-6 z-20 bg-neutral-900/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-green-600 shadow-xl">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-semibold text-sm">{pinnedLocation.name}</p>
                <p className="text-neutral-400 text-xs">Search radius: {radius} km</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearPin}
                className="ml-2 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          {/* Interactive India Map with Satellite View */}
          <IndiaOSMMap 
            zoom={zoom} 
            onMapClick={handleMapClick}
            mapLayers={
              <>
                {/* User's pinned location with radius circle */}
                {pinnedLocation && (
                  <>
                    <Circle 
                      center={[pinnedLocation.lat, pinnedLocation.lng]}
                      radius={radius * 1000} // Convert km to meters
                      pathOptions={{ 
                        color: '#4ade80', // green-400
                        fillColor: '#4ade80',
                        fillOpacity: 0.1,
                        weight: 2,
                        opacity: 0.3
                      }}
                    />
                    <Marker 
                      position={[pinnedLocation.lat, pinnedLocation.lng]}
                      icon={pinIcon}
                    />
                  </>
                )}

                {/* Plot places on map */}
                {filteredPlaces.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={placeIcon}
                  >
                    <Tooltip 
                      direction="top" 
                      offset={[0, -12]} 
                      opacity={1}
                      className="!bg-neutral-900 !text-white !border-none !rounded !px-2 !py-1 !text-xs !shadow-lg"
                    >
                      {place.name}
                    </Tooltip>
                  </Marker>
                ))}
              </>
            }
          >
            {/* Hover hint (UI Overlay) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-green-500/40 text-sm pointer-events-none select-none">
              Click to set your location
            </div>
          </IndiaOSMMap>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
          <Button
            size="icon"
            onClick={() => setZoom(Math.min(zoom + 0.2, 1.5))}
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))}
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          {pinnedLocation && (
            <Button
              size="icon"
              onClick={() => setShowRadiusDialog(true)}
              className="bg-green-600 hover:bg-green-700 border border-green-500"
              title="Adjust radius"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Right Side - Search & Results */}
      <div className="w-1/2 flex flex-col">
        {/* Search Bar */}
        <div className="p-6 bg-neutral-800 border-b border-neutral-700">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by state..."
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="bg-neutral-900 border-neutral-700 text-white"
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Search by city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-neutral-900 border-neutral-700 text-white"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={!selectedCategory ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              className={!selectedCategory ? 'bg-green-600' : ''}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.value}
                size="sm"
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.value)}
                className={selectedCategory === cat.value ? 'bg-green-600' : ''}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredPlaces.length > 0 ? (
            <div className="space-y-4">
              {filteredPlaces.map((place) => (
                <Card
                  key={place.id}
                  className="bg-neutral-800 border-neutral-700 hover:border-green-600 transition-all cursor-pointer overflow-hidden group"
                  onClick={() => navigate(`/place/${place.id}`)}
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-32 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-lg font-semibold text-white">{place.name}</h3>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => handleBookmarkToggle(place, e)}
                          className={`${
                            bookmarkedPlaces.has(place.id)
                              ? 'text-green-400 hover:text-green-500'
                              : 'text-neutral-500 hover:text-green-400'
                          } transition-colors`}
                        >
                          <Bookmark
                            className={`w-5 h-5 ${bookmarkedPlaces.has(place.id) ? 'fill-green-400' : ''}`}
                          />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{place.city}, {place.state}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-white">{place.rating}</span>
                      </div>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {place.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-green-900/30 text-green-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-neutral-400">{place.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-green-400 transition-colors" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Search className="w-16 h-16 text-neutral-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No places found</h3>
              <p className="text-neutral-400 max-w-md">
                Try adjusting your search filters or explore different categories
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Radius Selection Dialog */}
      <Dialog open={showRadiusDialog} onOpenChange={setShowRadiusDialog}>
        <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Set Search Radius</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Choose how far you want to search from your pinned location. This will help you discover places within your preferred distance.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-300">Radius</span>
                <span className="text-2xl font-bold text-green-400">{tempRadius} km</span>
              </div>
              <Slider
                value={[tempRadius]}
                onValueChange={(value) => setTempRadius(value[0])}
                min={5}
                max={200}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-2">
                <span>5 km</span>
                <span>100 km</span>
                <span>200 km</span>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
              <h4 className="text-sm font-semibold text-white mb-2">What this means:</h4>
              <p className="text-sm text-neutral-400">
                You'll see places within <strong className="text-green-400">{tempRadius} km</strong> of your pinned location. 
                Adjust the slider to expand or narrow your search area.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRadiusDialog(false)}
              className="border-neutral-600 text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRadiusConfirm}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm Radius
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}