
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, Trophy, Award, MessageSquare, Heart, ThumbsUp, Bookmark } from "lucide-react";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { toast } from "sonner";

interface CommunityHubProps {
  userId?: string;
}

// Mock community posts
const mockPosts = [
  {
    id: 'p1',
    author: {
      id: 'u1',
      name: 'Jessica M.',
      avatar: '/placeholder.svg',
      badge: 'Verified Member'
    },
    content: 'Just reached my 90-day streak of staying in my target glucose range! The continuous monitoring feature in this app has been a game-changer for me.',
    createdAt: '2025-05-03T15:30:00Z',
    likes: 24,
    replies: 6,
    isLiked: false,
    isSaved: true
  },
  {
    id: 'p2',
    author: {
      id: 'u2',
      name: 'Robert K.',
      avatar: '/placeholder.svg',
      badge: 'Health Coach'
    },
    content: 'Tip of the day: Try incorporating short walks after meals to help regulate your blood sugar levels. Even 10-15 minutes can make a significant difference!',
    createdAt: '2025-05-04T12:15:00Z',
    likes: 42,
    replies: 12,
    isLiked: true,
    isSaved: false
  }
];

// Mock upcoming events
const mockEvents = [
  {
    id: 'e1',
    title: 'Understanding Diabetes Medications',
    type: 'Webinar',
    date: '2025-05-10T18:00:00Z',
    host: 'Dr. Patricia Sanders',
    participants: 156,
    isRegistered: true
  },
  {
    id: 'e2',
    title: 'Cooking for Better Blood Sugar Control',
    type: 'Workshop',
    date: '2025-05-15T15:30:00Z',
    host: 'Chef Michael Zhang',
    participants: 89,
    isRegistered: false
  },
  {
    id: 'e3',
    title: 'Q&A with Endocrinology Specialists',
    type: 'Live Session',
    date: '2025-05-22T19:00:00Z',
    host: 'Dr. Aisha Johnson & Dr. Carlos Mendez',
    participants: 203,
    isRegistered: false
  }
];

// Mock achievements
const mockAchievements = [
  {
    id: 'a1',
    title: 'Consistency Champion',
    description: 'Log your glucose readings for 30 consecutive days',
    progress: 100,
    iconName: 'calendar',
    achieved: true,
    achievedDate: '2025-04-28T00:00:00Z'
  },
  {
    id: 'a2',
    title: 'Data Master',
    description: 'Link a continuous glucose monitor to your account',
    progress: 100,
    iconName: 'chart',
    achieved: true,
    achievedDate: '2025-03-15T00:00:00Z'
  },
  {
    id: 'a3',
    title: 'Balance Keeper',
    description: 'Maintain 80% of readings within target range for a week',
    progress: 65,
    iconName: 'target',
    achieved: false
  },
  {
    id: 'a4',
    title: 'Knowledge Seeker',
    description: 'Complete all educational modules on diabetes management',
    progress: 40,
    iconName: 'book',
    achieved: false
  }
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Helper function to format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    hour: 'numeric', 
    minute: 'numeric',
    hour12: true 
  }).format(date);
};

const CommunityHub: React.FC<CommunityHubProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('community');

  // Mock queries - in a real app these would fetch from an API
  const { data: posts } = useOptimizedQuery(
    ['community', 'posts'],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockPosts;
    }
  );

  const { data: events } = useOptimizedQuery(
    ['community', 'events'],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEvents;
    }
  );

  const { data: achievements } = useOptimizedQuery(
    ['user', userId, 'achievements'],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockAchievements;
    }
  );

  const handleLikePost = (postId: string) => {
    toast.success('Post liked');
  };

  const handleSavePost = (postId: string) => {
    toast.success('Post saved for later');
  };

  const handleRegisterEvent = (eventId: string) => {
    toast.success('Successfully registered for event');
  };

  const handleCancelRegistration = (eventId: string) => {
    toast.success('Event registration cancelled');
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar': return <Calendar className="h-5 w-5" />;
      case 'chart': return <Trophy className="h-5 w-5" />;
      case 'target': return <Award className="h-5 w-5" />;
      case 'book': return <MessageSquare className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Community Hub</CardTitle>
            <CardDescription>Connect, learn, and grow with others on similar health journeys</CardDescription>
          </div>
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200">
            <Users className="h-3.5 w-3.5 mr-1" />
            Beta
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="community" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none px-6 pt-2 pb-0 h-auto" style={{ justifyContent: 'flex-start' }}>
            <TabsTrigger value="community" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none">
              <Users className="h-4 w-4 mr-2" />
              Community
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-none data-[state=active]:shadow-none">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>
          <Separator />
          
          <TabsContent value="community" className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Recent Discussions</h3>
              <Button size="sm">New Post</Button>
            </div>
            
            <div className="space-y-6">
              {posts?.map(post => (
                <Card key={post.id} className="border-slate-200 dark:border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.split(' ')[0][0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{post.author.name}</span>
                            {post.author.badge && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {post.author.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleSavePost(post.id)}>
                        <Bookmark className={`h-4 w-4 ${post.isSaved ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    
                    <p className="mt-3">{post.content}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`flex items-center gap-1 ${post.isLiked ? 'text-blue-600 dark:text-blue-400' : ''}`}
                          onClick={() => handleLikePost(post.id)}
                        >
                          <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.replies}</span>
                        </Button>
                      </div>
                      
                      <Button variant="outline" size="sm">Reply</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">Load More</Button>
          </TabsContent>
          
          <TabsContent value="events" className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Upcoming Events</h3>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                My Calendar
              </Button>
            </div>
            
            <div className="space-y-4">
              {events?.map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="bg-white/80 dark:bg-black/20">
                          {event.type}
                        </Badge>
                        <h3 className="font-medium text-lg mt-1">{event.title}</h3>
                      </div>
                      {event.isRegistered && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Registered
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm"><span className="font-medium">Date:</span> {formatDate(event.date)}</p>
                        <p className="text-sm"><span className="font-medium">Time:</span> {formatTime(event.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm"><span className="font-medium">Host:</span> {event.host}</p>
                        <p className="text-sm text-muted-foreground">{event.participants} participants</p>
                      </div>
                    </div>
                    
                    {event.isRegistered ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Add to Calendar
                        </Button>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950" onClick={() => handleCancelRegistration(event.id)}>
                          Cancel Registration
                        </Button>
                      </div>
                    ) : (
                      <Button className="w-full" onClick={() => handleRegisterEvent(event.id)}>
                        Register Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements?.map(achievement => (
                <Card key={achievement.id} className={`border ${achievement.achieved ? 'border-yellow-200 dark:border-yellow-900' : 'border-gray-200 dark:border-gray-800'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${
                        achievement.achieved 
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {getAchievementIcon(achievement.iconName)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{achievement.title}</h3>
                          {achievement.achieved && (
                            <Trophy className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        
                        <Progress value={achievement.progress} className="h-2" />
                        
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{achievement.progress}% Complete</span>
                          {achievement.achieved && achievement.achievedDate && (
                            <span className="text-xs text-muted-foreground">
                              Achieved on {formatDate(achievement.achievedDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommunityHub;
