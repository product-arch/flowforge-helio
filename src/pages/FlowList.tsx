import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  MoreHorizontal, 
  Play, 
  Pause,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Users,
  MessageCircle,
  ArrowLeft,
  GitBranch,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Grid3X3,
  List
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Flow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  channels: string[];
  lastModified: string;
  createdBy: string;
  messagesProcessed: number;
  successRate: number;
  nodeCount: number;
}

const mockFlows: Flow[] = [
  {
    id: 'flow-1',
    name: 'Welcome Onboarding Campaign',
    description: 'Advanced multi-channel onboarding with intelligent routing, analytics, and failover mechanisms',
    status: 'active',
    channels: ['SMS', 'Email', 'WhatsApp', 'Voice'],
    lastModified: '2 hours ago',
    createdBy: 'Marketing Team',
    messagesProcessed: 15420,
    successRate: 98.5,
    nodeCount: 20
  },
  {
    id: 'flow-2',
    name: 'Payment Reminder Flow',
    description: 'Automated payment reminders with escalation logic',
    status: 'active',
    channels: ['SMS', 'Voice'],
    lastModified: '1 day ago',
    createdBy: 'Finance Team',
    messagesProcessed: 8930,
    successRate: 95.2,
    nodeCount: 12
  },
  {
    id: 'flow-3',
    name: 'Customer Support Routing',
    description: 'Intelligent routing based on customer priority and issue type',
    status: 'inactive',
    channels: ['WhatsApp', 'Email'],
    lastModified: '3 days ago',
    createdBy: 'Support Team',
    messagesProcessed: 2840,
    successRate: 89.3,
    nodeCount: 15
  },
  {
    id: 'flow-4',
    name: 'Promotional Campaign',
    description: 'Weekly promotional campaign with targeted messaging',
    status: 'draft',
    channels: ['SMS', 'RCS'],
    lastModified: '5 days ago',
    createdBy: 'Marketing Team',
    messagesProcessed: 0,
    successRate: 0,
    nodeCount: 6
  }
];

const FlowList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flows, setFlows] = useState<Flow[]>(mockFlows);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  const getStatusColor = (status: Flow['status']) => {
    switch (status) {
      case 'active':
        return 'bg-status-success/10 text-status-success border-status-success/20';
      case 'inactive':
        return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      case 'draft':
        return 'bg-status-info/10 text-status-info border-status-info/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Flow['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />;
      case 'inactive':
        return <Pause className="w-3 h-3" />;
      case 'draft':
        return <Clock className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handleCreateFlow = () => {
    navigate('/flow-builder');
  };

  const handleEditFlow = (flowId: string) => {
    navigate(`/flow-builder?id=${flowId}`);
  };

  const handleDeleteFlow = (flowId: string) => {
    setFlowToDelete(flowId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (flowToDelete) {
      setFlows(flows.filter(flow => flow.id !== flowToDelete));
      toast({
        title: "Flow Deleted",
        description: "The flow has been successfully deleted",
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    }
    setDeleteDialogOpen(false);
    setFlowToDelete(null);
  };

  const handleDuplicateFlow = (flowId: string) => {
    const flowToDuplicate = flows.find(flow => flow.id === flowId);
    if (flowToDuplicate) {
      const newFlow: Flow = {
        ...flowToDuplicate,
        id: `flow-${Date.now()}`,
        name: `${flowToDuplicate.name} (Copy)`,
        status: 'draft',
        messagesProcessed: 0,
        successRate: 0,
        lastModified: 'Just now'
      };
      setFlows([newFlow, ...flows]);
      toast({
        title: "Flow Duplicated",
        description: "A copy of the flow has been created",
        className: "border-status-info bg-status-info/10 text-status-info"
      });
    }
  };

  const toggleFlowStatus = (flowId: string) => {
    setFlows(flows.map(flow => {
      if (flow.id === flowId) {
        const newStatus = flow.status === 'active' ? 'inactive' : 'active';
        toast({
          title: `Flow ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
          description: `${flow.name} is now ${newStatus}`,
          className: `border-status-${newStatus === 'active' ? 'success' : 'warning'} bg-status-${newStatus === 'active' ? 'success' : 'warning'}/10 text-status-${newStatus === 'active' ? 'success' : 'warning'}`
        });
        return { ...flow, status: newStatus };
      }
      return flow;
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 pt-4">
        <div className="container mx-auto px-6">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/5 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Routing Plans
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button 
                    variant={viewMode === 'card' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewMode('card')}
                    className="h-8"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleCreateFlow}
                  className="bg-gradient-primary hover:opacity-90 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Flow
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{flows.filter(f => f.status === 'active').length}</div>
                  <div className="text-sm text-muted-foreground">Active Flows</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {flows.reduce((sum, flow) => sum + flow.messagesProcessed, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Messages Processed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {(flows.reduce((sum, flow) => sum + (flow.messagesProcessed * flow.successRate / 100), 0) / 
                      flows.reduce((sum, flow) => sum + flow.messagesProcessed, 0) * 100 || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{flows.length}</div>
                  <div className="text-sm text-muted-foreground">Total Flows</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Flows Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {flows.map((flow, index) => (
                <motion.div
                  key={flow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Card className="border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 h-[420px] flex flex-col">
                    <CardHeader className="pb-4 flex-shrink-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getStatusColor(flow.status)} border`}>
                              {getStatusIcon(flow.status)}
                              <span className="ml-1 capitalize">{flow.status}</span>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {flow.nodeCount} nodes
                            </Badge>
                          </div>
                          <CardTitle className="text-xl font-heading font-heading-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {flow.name}
                          </CardTitle>
                          <CardDescription className="text-sm font-body leading-relaxed line-clamp-3 h-[4.5rem]">
                            {flow.description}
                          </CardDescription>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditFlow(flow.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Flow
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateFlow(flow.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleFlowStatus(flow.id)}>
                              {flow.status === 'active' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                              {flow.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFlow(flow.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Channels */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2">Channels</div>
                          <div className="flex flex-wrap gap-1">
                            {flow.channels.map((channel) => (
                              <Badge key={channel} variant="secondary" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Messages</div>
                            <div className="font-semibold">{flow.messagesProcessed.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Success Rate</div>
                            <div className="font-semibold">{flow.successRate}%</div>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="pt-2 border-t border-border/50">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {flow.createdBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {flow.lastModified}
                            </span>
                          </div>
                        </div>

                        <Button 
                          className="w-full font-body-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                          variant="outline"
                          onClick={() => handleEditFlow(flow.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Flow
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Create New Flow Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * flows.length }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card 
                  className="border-2 border-dashed border-border/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 bg-card/30 h-[420px]"
                  onClick={handleCreateFlow}
                >
                  <CardContent className="p-8 text-center h-full flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                        <Plus className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-heading font-heading-semibold mb-2">Create New Flow</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start building a new routing flow from scratch
                      </p>
                      <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground">
                        Get Started
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border/50">
              <div className="p-4 border-b border-border/50 flex justify-between items-center">
                <h2 className="text-lg font-semibold">All Flows</h2>
                <Button 
                  onClick={handleCreateFlow}
                  size="sm"
                  className="bg-gradient-primary hover:opacity-90 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Flow
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flow Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flows.map((flow) => (
                    <TableRow key={flow.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleEditFlow(flow.id)}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{flow.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{flow.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(flow.status)} border`}>
                          {getStatusIcon(flow.status)}
                          <span className="ml-1 capitalize">{flow.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {flow.channels.map((channel) => (
                            <Badge key={channel} variant="secondary" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{flow.messagesProcessed.toLocaleString()}</TableCell>
                      <TableCell>{flow.successRate}%</TableCell>
                      <TableCell>{flow.createdBy}</TableCell>
                      <TableCell>{flow.lastModified}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditFlow(flow.id); }}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Flow
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateFlow(flow.id); }}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleFlowStatus(flow.id); }}>
                              {flow.status === 'active' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                              {flow.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => { e.stopPropagation(); handleDeleteFlow(flow.id); }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flow? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FlowList;