import { useState } from 'react';
import { Calendar, MapPin, Plus, Star } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';

const AVAILABLE_TAGS = [
  'trek', 'beachside', 'café', 'restaurant', 'historical',
  'nature', 'adventure', 'photography', 'family-friendly', 'nightlife',
];

const MOCK_SUGGESTIONS = [
  {
    id: '1',
    name: 'Hidden Waterfall Trail',
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=400&q=80',
    tags: ['trek', 'nature', 'adventure'],
    rating: 4.8,
    distance: '25 km',
  },
  {
    id: '2',
    name: 'Sunset Beach',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    tags: ['beachside', 'photography', 'nature'],
    rating: 4.7,
    distance: '18 km',
  },
  {
    id: '3',
    name: 'Mountain View Café',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80',
    tags: ['café', 'family-friendly'],
    rating: 4.6,
    distance: '12 km',
  },
  {
    id: '4',
    name: 'Ancient Fort',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80',
    tags: ['historical', 'photography'],
    rating: 4.9,
    distance: '30 km',
  },
  {
    id: '5',
    name: 'Forest Trail',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    tags: ['trek', 'nature'],
    rating: 4.5,
    distance: '22 km',
  },
  {
    id: '6',
    name: 'Lakeside Retreat',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80',
    tags: ['nature', 'photography'],
    rating: 4.8,
    distance: '28 km',
  },
];

interface WeekendPlannerPageProps {
  user: any;
}

export function WeekendPlannerPage({ user }: WeekendPlannerPageProps) {
  const [searched, setSearched] = useState(false);
  const [formData, setFormData] = useState({
    days: 2,
    distance: 50,
    tags: [] as string[],
  });
  const [plannedPlaces, setPlannedPlaces] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tags.length < 2) {
      alert('Please select at least 2 tags');
      return;
    }
    setSearched(true);
  };

  const handleTagToggle = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((t) => t !== tag),
      });
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
  };

  const handleAddToPlanner = (placeId: string) => {
    if (plannedPlaces.includes(placeId)) {
      setPlannedPlaces(plannedPlaces.filter((id) => id !== placeId));
    } else {
      setPlannedPlaces([...plannedPlaces, placeId]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 ml-64">
      <div className="flex">
        {/* Form Section */}
        <div
          className={`${
            searched ? 'w-1/4' : 'w-full flex items-center justify-center'
          } transition-all duration-300 p-8`}
        >
          <Card className="bg-neutral-800 border-neutral-700 p-8 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-green-500" />
              <h1 className="text-2xl font-bold text-white">Weekend Planner</h1>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <Label htmlFor="days" className="text-white mb-2 block">
                  Number of Days
                </Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.days}
                  onChange={(e) =>
                    setFormData({ ...formData, days: parseInt(e.target.value) })
                  }
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="distance" className="text-white mb-2 block">
                  Distance from Location (km)
                </Label>
                <Input
                  id="distance"
                  type="number"
                  min="10"
                  max="200"
                  value={formData.distance}
                  onChange={(e) =>
                    setFormData({ ...formData, distance: parseInt(e.target.value) })
                  }
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white mb-4 block">
                  Select Tags (At least 2)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`cursor-pointer transition-colors ${
                        formData.tags.includes(tag)
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-neutral-400 mt-2">
                  Selected: {formData.tags.length} tags
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={formData.tags.length < 2}
              >
                Search Places
              </Button>
            </form>
          </Card>
        </div>

        {/* Suggestions Section */}
        {searched && (
          <div className="w-3/4 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Suggested Places ({MOCK_SUGGESTIONS.length})
              </h2>
              <p className="text-neutral-400">
                Based on your preferences for {formData.days} days within {formData.distance} km
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {MOCK_SUGGESTIONS.slice(0, 12).map((place) => (
                <Card
                  key={place.id}
                  className="bg-neutral-800 border-neutral-700 overflow-hidden hover:border-green-600 transition-all group"
                >
                  <div className="relative">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-40 object-cover"
                    />
                    <Button
                      onClick={() => handleAddToPlanner(place.id)}
                      size="icon"
                      className={`absolute top-2 right-2 ${
                        plannedPlaces.includes(place.id)
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-neutral-900/80 hover:bg-neutral-900'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{place.distance}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-white text-sm">{place.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {place.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-green-900/30 text-green-400 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {plannedPlaces.length > 0 && (
              <div className="mt-8 p-6 bg-green-900/20 border border-green-600 rounded-lg">
                <h3 className="text-white font-semibold mb-2">
                  Your Planner ({plannedPlaces.length} places)
                </h3>
                <Button className="bg-green-600 hover:bg-green-700">
                  Save Itinerary
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
