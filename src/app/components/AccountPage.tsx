import { useState } from 'react';
import { User, Settings, MapPin, MessageCircle, Heart } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface AccountPageProps {
  user: any;
  onUpdateUser: (user: any) => void;
}

// Mock user posts and comments
const MOCK_USER_POSTS = [
  {
    id: '1',
    place: 'Hidden Waterfall Trail',
    content: 'Amazing experience! The trek was challenging but worth it.',
    likes: 24,
    comments: 8,
    date: '2 days ago',
  },
  {
    id: '2',
    place: 'Sunset Beach',
    content: 'Perfect spot for evening walks and photography.',
    likes: 18,
    comments: 5,
    date: '1 week ago',
  },
];

const MOCK_USER_COMMENTS = [
  {
    id: '1',
    place: 'Gateway of India',
    comment: 'Best time to visit is early morning to avoid crowds!',
    date: '3 days ago',
  },
  {
    id: '2',
    place: 'Cozy Corner Café',
    comment: 'The coffee here is absolutely amazing!',
    date: '5 days ago',
  },
];

export function AccountPage({ user, onUpdateUser }: AccountPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
  });

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 ml-64 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-neutral-800 border-neutral-700 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              {/* Profile Picture */}
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                <div className="flex items-center gap-2 text-neutral-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{user?.location}</span>
                </div>
                <Badge className="bg-green-900/30 text-green-400 border-green-600">
                  {user?.badge || 'Localite'}
                </Badge>
              </div>
            </div>

            {/* Settings Button */}
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="border-neutral-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="mt-8 pt-8 border-t border-neutral-700">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white mb-2 block">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-neutral-900 border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-neutral-900 border-neutral-700 text-white"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="location" className="text-white mb-2 block">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-neutral-900 border-neutral-700 text-white"
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="mt-6 bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </div>
          )}
        </Card>

        {/* User Activity */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="bg-neutral-800 mb-6">
            <TabsTrigger value="posts" className="data-[state=active]:bg-green-600">
              My Posts ({MOCK_USER_POSTS.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-green-600">
              My Comments ({MOCK_USER_COMMENTS.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {MOCK_USER_POSTS.map((post) => (
              <Card key={post.id} className="bg-neutral-800 border-neutral-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold mb-1">{post.place}</h3>
                    <p className="text-sm text-neutral-500">{post.date}</p>
                  </div>
                </div>
                <p className="text-neutral-300 mb-4">{post.content}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            {MOCK_USER_COMMENTS.map((comment) => (
              <Card key={comment.id} className="bg-neutral-800 border-neutral-700 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-semibold">On: {comment.place}</h3>
                  <span className="text-sm text-neutral-500">{comment.date}</span>
                </div>
                <p className="text-neutral-300">{comment.comment}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
