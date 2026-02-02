import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MapPin, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';

interface CreatePostPageProps {
  user: any;
}

const AVAILABLE_TAGS = [
  'trek', 'beachside', 'café', 'restaurant', 'historical', 
  'nature', 'adventure', 'photography', 'family-friendly', 'nightlife'
];

const CATEGORIES = [
  { value: 'chill', label: 'Local Chill Spots' },
  { value: 'tourist', label: 'Tourist Worth' },
  { value: 'adventure', label: 'Adventurous' },
];

export function CreatePostPage({ user }: CreatePostPageProps) {
  const navigate = useNavigate();
  const [postType, setPostType] = useState<'tip' | 'blog'>('blog');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAdventureDialog, setShowAdventureDialog] = useState(false);
  const [adventureDetails, setAdventureDetails] = useState({
    time: '',
    difficulty: '',
    safetyTips: '',
  });
  const [formData, setFormData] = useState({
    placeName: '',
    location: '',
    content: '',
    tags: [] as string[],
  });
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }
    
    if (formData.tags.length < 2) {
      alert('Please select at least 2 tags');
      return;
    }

    // Mock post creation
    console.log('Creating post:', { ...formData, postType, selectedCategory, adventureDetails, images });
    alert('Post created successfully!');
    navigate('/search');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    // Show adventure dialog if Adventurous is selected
    if (category === 'adventure') {
      setShowAdventureDialog(true);
    }
  };

  const handleAdventureDialogSave = () => {
    if (!adventureDetails.time || !adventureDetails.difficulty || !adventureDetails.safetyTips) {
      alert('Please fill all adventure details');
      return;
    }
    setShowAdventureDialog(false);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files.slice(0, 3)); // Max 3 images
  };

  const maxWords = postType === 'tip' ? 120 : 500;
  const wordCount = formData.content.trim().split(/\s+/).length;

  return (
    <div className="min-h-screen bg-neutral-900 ml-64 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={() => navigate(-1)} variant="outline" className="border-neutral-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Create Post</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Post Type Selection */}
          <Card className="bg-neutral-800 border-neutral-700 p-6 mb-6">
            <Label className="text-white mb-4 block">Post Type</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={postType === 'blog' ? 'default' : 'outline'}
                onClick={() => setPostType('blog')}
                className={postType === 'blog' ? 'bg-green-600' : ''}
              >
                Blog (500 words max)
              </Button>
              <Button
                type="button"
                variant={postType === 'tip' ? 'default' : 'outline'}
                onClick={() => setPostType('tip')}
                className={postType === 'tip' ? 'bg-green-600' : ''}
              >
                Tip (120 words max)
              </Button>
            </div>
          </Card>

          {/* Category Selection */}
          <Card className="bg-neutral-800 border-neutral-700 p-6 mb-6">
            <Label className="text-white mb-4 block">Category * (Select one)</Label>
            <div className="flex gap-4 flex-wrap">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  type="button"
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  onClick={() => handleCategorySelect(category.value)}
                  className={`${
                    selectedCategory === category.value 
                      ? 'bg-green-600 hover:bg-green-700 text-black' 
                      : 'border-neutral-600 text-black hover:bg-neutral-700'
                  } px-6 py-2`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            {selectedCategory === 'adventure' && adventureDetails.time && (
              <div className="mt-4 p-3 bg-neutral-900 rounded-lg border border-green-600">
                <p className="text-sm text-green-400 font-semibold mb-2">Adventure Details:</p>
                <p className="text-xs text-neutral-300"><strong>Time:</strong> {adventureDetails.time}</p>
                <p className="text-xs text-neutral-300"><strong>Difficulty:</strong> {adventureDetails.difficulty}</p>
                <p className="text-xs text-neutral-300"><strong>Safety Tips:</strong> {adventureDetails.safetyTips}</p>
              </div>
            )}
          </Card>

          {/* Place Details */}
          <Card className="bg-neutral-800 border-neutral-700 p-6 mb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="placeName" className="text-white mb-2 block">Place Name *</Label>
                <Input
                  id="placeName"
                  value={formData.placeName}
                  onChange={(e) => setFormData({ ...formData, placeName: e.target.value })}
                  placeholder="Enter place name"
                  className="bg-neutral-900 border-neutral-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-white mb-2 block">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, State (within 50km radius)"
                    className="pl-10 bg-neutral-900 border-neutral-700 text-white"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Note: Posting allowed only for locations within 50 km radius
                </p>
              </div>
            </div>
          </Card>

          {/* Tags */}
          <Card className="bg-neutral-800 border-neutral-700 p-6 mb-6">
            <Label className="text-white mb-4 block">Tags * (Select at least 2)</Label>
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
                  {formData.tags.includes(tag) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-neutral-400 mt-2">
              Selected: {formData.tags.length} tags
            </p>
          </Card>

          {/* Content */}
          <Card className="bg-neutral-800 border-neutral-700 p-6 mb-6">
            <Label htmlFor="content" className="text-white mb-2 block">
              Content * ({wordCount}/{maxWords} words)
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={postType === 'tip' ? 'Share a quick tip...' : 'Write your blog post...'}
              className="bg-neutral-900 border-neutral-700 text-white"
              rows={postType === 'tip' ? 4 : 10}
              required
            />
            {wordCount > maxWords && (
              <p className="text-red-500 text-sm mt-1">
                Content exceeds maximum word limit
              </p>
            )}
          </Card>

          {/* Media Upload */}
          <Card className="bg-neutral-800 border-neutral-700 p-6 mb-6">
            <Label className="text-white mb-4 block">Media (3 images OR 1 video)</Label>
            <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="cursor-pointer text-green-500 hover:text-green-400"
              >
                Click to upload files
              </label>
              <p className="text-sm text-neutral-500 mt-2">
                PNG, JPG, MP4 up to 10MB
              </p>
            </div>
            {images.length > 0 && (
              <div className="mt-4 flex gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="text-neutral-300 text-sm">
                    {img.name}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={wordCount > maxWords || formData.tags.length < 2}
            >
              Publish Post
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-neutral-700"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Adventure Details Dialog */}
        <Dialog open={showAdventureDialog} onOpenChange={setShowAdventureDialog}>
          <DialogContent className="bg-neutral-800 border-neutral-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Adventure Details</DialogTitle>
              <DialogDescription className="text-neutral-400">
                Please provide additional details for this adventurous place
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="adventure-time" className="text-white mb-2 block">
                  Time Required *
                </Label>
                <Input
                  id="adventure-time"
                  value={adventureDetails.time}
                  onChange={(e) =>
                    setAdventureDetails({ ...adventureDetails, time: e.target.value })
                  }
                  placeholder="e.g., 2-3 hours, Half day, Full day"
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="adventure-difficulty" className="text-white mb-2 block">
                  Difficulty Level *
                </Label>
                <Input
                  id="adventure-difficulty"
                  value={adventureDetails.difficulty}
                  onChange={(e) =>
                    setAdventureDetails({ ...adventureDetails, difficulty: e.target.value })
                  }
                  placeholder="e.g., Easy, Moderate, Difficult, Expert"
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="adventure-safety" className="text-white mb-2 block">
                  Safety Tips *
                </Label>
                <Textarea
                  id="adventure-safety"
                  value={adventureDetails.safetyTips}
                  onChange={(e) =>
                    setAdventureDetails({ ...adventureDetails, safetyTips: e.target.value })
                  }
                  placeholder="e.g., Wear proper hiking boots, carry water, avoid during monsoon..."
                  className="bg-neutral-900 border-neutral-700 text-white"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAdventureDialog(false);
                  setSelectedCategory('');
                  setAdventureDetails({ time: '', difficulty: '', safetyTips: '' });
                }}
                className="border-neutral-600 text-neutral-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdventureDialogSave}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Save Details
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}