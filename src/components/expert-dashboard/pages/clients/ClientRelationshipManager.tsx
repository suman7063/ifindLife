
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Video, 
  Star,
  TrendingUp,
  Clock,
  Heart,
  Brain,
  Activity,
  FileText,
  Plus,
  Edit
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinDate: Date;
  lastSession: Date;
  nextSession?: Date;
  totalSessions: number;
  satisfaction: number;
  status: 'active' | 'inactive' | 'completed';
  goals: string[];
  concerns: string[];
  progress: number;
  notes: ClientNote[];
  preferences: {
    sessionType: 'video' | 'audio' | 'chat';
    frequency: 'weekly' | 'biweekly' | 'monthly';
    reminderTime: number;
  };
  metrics: {
    engagement: number;
    improvement: number;
    consistency: number;
  };
}

interface ClientNote {
  id: string;
  date: Date;
  type: 'session' | 'observation' | 'goal' | 'concern';
  content: string;
  private: boolean;
}

const ClientRelationshipManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({ type: 'session', content: '', private: false });

  const clients: ClientProfile[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      avatar: '/lovable-uploads/avatar1.jpg',
      joinDate: new Date('2024-01-15'),
      lastSession: new Date('2024-05-28'),
      nextSession: new Date('2024-06-05'),
      totalSessions: 12,
      satisfaction: 4.8,
      status: 'active',
      goals: ['Anxiety management', 'Work-life balance', 'Confidence building'],
      concerns: ['Social anxiety', 'Performance stress'],
      progress: 78,
      notes: [
        {
          id: '1',
          date: new Date('2024-05-28'),
          type: 'session',
          content: 'Great progress with breathing techniques. Client reports feeling more confident in social situations.',
          private: false
        },
        {
          id: '2',
          date: new Date('2024-05-21'),
          type: 'observation',
          content: 'Client seems more relaxed and open during sessions. Building good rapport.',
          private: true
        }
      ],
      preferences: {
        sessionType: 'video',
        frequency: 'weekly',
        reminderTime: 24
      },
      metrics: {
        engagement: 85,
        improvement: 78,
        consistency: 92
      }
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      phone: '+1 (555) 234-5678',
      avatar: '/lovable-uploads/avatar2.jpg',
      joinDate: new Date('2024-02-10'),
      lastSession: new Date('2024-05-25'),
      nextSession: new Date('2024-06-08'),
      totalSessions: 8,
      satisfaction: 4.5,
      status: 'active',
      goals: ['Stress management', 'Career guidance'],
      concerns: ['Burnout', 'Decision making'],
      progress: 65,
      notes: [
        {
          id: '3',
          date: new Date('2024-05-25'),
          type: 'session',
          content: 'Discussed career transition strategies. Client is making good progress with stress management.',
          private: false
        }
      ],
      preferences: {
        sessionType: 'video',
        frequency: 'biweekly',
        reminderTime: 48
      },
      metrics: {
        engagement: 75,
        improvement: 65,
        consistency: 88
      }
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const addNote = () => {
    if (!selectedClient || !newNote.content.trim()) return;

    const note: ClientNote = {
      id: Date.now().toString(),
      date: new Date(),
      type: newNote.type as any,
      content: newNote.content,
      private: newNote.private
    };

    // In a real app, this would update the backend
    setSelectedClient({
      ...selectedClient,
      notes: [note, ...selectedClient.notes]
    });

    setNewNote({ type: 'session', content: '', private: false });
    setShowAddNote(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Client List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>Manage your client relationships</CardDescription>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 p-4">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedClient?.id === client.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{client.name}</h4>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{client.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-gray-500">{client.satisfaction}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{client.totalSessions} sessions</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Client Details */}
      <Card className="lg:col-span-2">
        {selectedClient ? (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedClient.avatar} />
                    <AvatarFallback className="text-xl">
                      {selectedClient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedClient.name}</CardTitle>
                    <CardDescription>{selectedClient.email}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(selectedClient.status)}>
                        {selectedClient.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{selectedClient.satisfaction}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  {/* Progress Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold">{selectedClient.metrics.engagement}%</div>
                      <div className="text-sm text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold">{selectedClient.metrics.improvement}%</div>
                      <div className="text-sm text-gray-500">Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="text-2xl font-bold">{selectedClient.metrics.consistency}%</div>
                      <div className="text-sm text-gray-500">Consistency</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-gray-500">{selectedClient.progress}%</span>
                    </div>
                    <Progress value={selectedClient.progress} className="w-full" />
                  </div>

                  {/* Goals and Concerns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Goals
                      </h4>
                      <div className="space-y-1">
                        {selectedClient.goals.map((goal, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-blue-500" />
                        Concerns
                      </h4>
                      <div className="space-y-1">
                        {selectedClient.concerns.map((concern, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-500">Total Sessions</div>
                      <div className="text-xl font-semibold">{selectedClient.totalSessions}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Last Session</div>
                      <div className="text-sm font-medium">{formatDate(selectedClient.lastSession)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Next Session</div>
                      <div className="text-sm font-medium">
                        {selectedClient.nextSession ? formatDate(selectedClient.nextSession) : 'Not scheduled'}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sessions">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Session History</h3>
                      <Button>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Session
                      </Button>
                    </div>
                    {/* Session history would go here */}
                    <div className="text-center py-8 text-gray-500">
                      Session history and scheduling interface
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Client Notes</h3>
                      <Dialog open={showAddNote} onOpenChange={setShowAddNote}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Client Note</DialogTitle>
                            <DialogDescription>
                              Add a note about this client's progress or session
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="note-type">Note Type</Label>
                              <Select 
                                value={newNote.type} 
                                onValueChange={(value) => setNewNote(prev => ({ ...prev, type: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="session">Session Note</SelectItem>
                                  <SelectItem value="observation">Observation</SelectItem>
                                  <SelectItem value="goal">Goal Update</SelectItem>
                                  <SelectItem value="concern">Concern</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="note-content">Content</Label>
                              <Textarea
                                id="note-content"
                                value={newNote.content}
                                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Enter your note here..."
                                rows={4}
                              />
                            </div>
                            <div className="flex justify-between">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="private"
                                  checked={newNote.private}
                                  onChange={(e) => setNewNote(prev => ({ ...prev, private: e.target.checked }))}
                                />
                                <Label htmlFor="private">Private note</Label>
                              </div>
                              <div className="space-x-2">
                                <Button variant="outline" onClick={() => setShowAddNote(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={addNote}>Add Note</Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {selectedClient.notes.map((note) => (
                          <div
                            key={note.id}
                            className={`p-4 rounded-lg border ${
                              note.private ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{note.type}</Badge>
                                {note.private && (
                                  <Badge variant="secondary">Private</Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(note.date)}
                              </span>
                            </div>
                            <p className="text-sm">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Client Preferences</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Preferred Session Type</Label>
                        <Select value={selectedClient.preferences.sessionType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video Call</SelectItem>
                            <SelectItem value="audio">Audio Call</SelectItem>
                            <SelectItem value="chat">Chat Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Session Frequency</Label>
                        <Select value={selectedClient.preferences.frequency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a client</h3>
              <p>Choose a client from the list to view their details</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ClientRelationshipManager;
