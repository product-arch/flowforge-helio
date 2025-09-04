import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  RotateCcw, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { useFlow } from '@/contexts/FlowContext';
import { useToast } from '@/hooks/use-toast';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose }) => {
  const [testParams, setTestParams] = useState({
    appId: 'HELO_BROADCAST_001',
    channel: 'SMS',
    messageType: 'promotional',
    messageId: `MSG_${Date.now()}`,
    overrideVendorStatus: {},
    overrideQuotas: {}
  });
  const { simulationMode, simulationResults, runSimulation } = useFlow();
  const { toast } = useToast();

  const handleRunSimulation = () => {
    runSimulation(testParams);
    toast({
      title: "Simulation Started",
      description: "Running routing simulation with test parameters.",
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const handleQuickTest = (scenario: string) => {
    const scenarios = {
      happy: { ...testParams, scenario: 'happy-path' },
      failover: { ...testParams, scenario: 'failover-test', overrideVendorStatus: { gupshup: 'down' } },
      quota: { ...testParams, scenario: 'quota-breach', overrideQuotas: { gupshup: 0 } },
      cost: { ...testParams, scenario: 'cost-limit', messageType: 'premium' }
    };
    
    runSimulation(scenarios[scenario as keyof typeof scenarios]);
    toast({
      title: "Quick Test Running",
      description: `Testing ${scenario} scenario`,
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const exportResults = () => {
    toast({
      title: "Export Started",
      description: "Downloading simulation results as CSV...",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[75vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-bold">Simulation Center</DialogTitle>
              {simulationMode && (
                <Badge variant="outline" className="bg-status-info/10 text-status-info border-status-info text-xs">
                  Simulation Active
                </Badge>
              )}
              {simulationResults.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {simulationResults.length} results
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="config" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b h-12 bg-accent/50 backdrop-blur-sm px-6 shrink-0">
              <TabsTrigger 
                value="config" 
                className="text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Configuration
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Results
              </TabsTrigger>
              <TabsTrigger 
                value="scenarios" 
                className="text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Quick Tests
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="config" className="h-full overflow-y-auto p-4 m-0">
                <div className="grid grid-cols-4 gap-3">
                <Card className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Input Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">App ID</Label>
                      <Input
                        value={testParams.appId}
                        onChange={(e) => setTestParams({ ...testParams, appId: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Channel</Label>
                      <Select
                        value={testParams.channel}
                        onValueChange={(value) => setTestParams({ ...testParams, channel: value })}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SMS">SMS</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="RCS">RCS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Message Type</Label>
                      <Select
                        value={testParams.messageType}
                        onValueChange={(value) => setTestParams({ ...testParams, messageType: value })}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transactional">Transactional</SelectItem>
                          <SelectItem value="promotional">Promotional</SelectItem>
                          <SelectItem value="utility">Utility</SelectItem>
                          <SelectItem value="authentication">Authentication</SelectItem>
                          <SelectItem value="service_explicit">Service Explicit</SelectItem>
                          <SelectItem value="service_implicit">Service Implicit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Message ID</Label>
                      <Input
                        value={testParams.messageId}
                        onChange={(e) => setTestParams({ ...testParams, messageId: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Vendor Overrides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">Gupshup Status</Label>
                        <Switch className="scale-75" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">Karix Status</Label>
                        <Switch defaultChecked className="scale-75" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">Kaleyra Status</Label>
                        <Switch defaultChecked className="scale-75" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Quota Overrides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Gupshup Quota</Label>
                      <Input placeholder="Leave empty for actual" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Karix Quota</Label>
                      <Input placeholder="Leave empty for actual" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Kaleyra Quota</Label>
                      <Input placeholder="Leave empty for actual" className="h-8 text-sm" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Channel Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Sender ID</Label>
                      <Input placeholder="HELOHUB" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">RCS Bot Name</Label>
                      <Input placeholder="helo_support" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">WhatsApp Number</Label>
                      <Input placeholder="+91XXXXXXXXXX" className="h-8 text-sm" />
                    </div>
                  </CardContent>
                </Card>
                </div>
              </TabsContent>

              <TabsContent value="results" className="h-full overflow-y-auto p-4 m-0">
              <div className="space-y-4">
                {simulationResults.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Play className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No simulation results yet. Run a test to see results.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <h4 className="font-medium text-sm">Simulation Results</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={exportResults} className="h-8">
                          <Download className="w-3 h-3 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" className="h-8">
                          <RotateCcw className="w-3 h-3 mr-2" />
                          Clear
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {simulationResults.map((result, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-accent/30 rounded-md border border-border/20">
                          <div className="flex items-center gap-2 min-w-0">
                            <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground font-mono">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            {result.status === 'success' && <CheckCircle className="w-3 h-3 text-status-success flex-shrink-0" />}
                            {result.status === 'error' && <XCircle className="w-3 h-3 text-status-error flex-shrink-0" />}
                            {result.status === 'warning' && <AlertTriangle className="w-3 h-3 text-status-warning flex-shrink-0" />}
                            <span className="text-sm font-medium truncate">{result.nodeId}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-foreground/90 line-clamp-1">{result.message}</span>
                          </div>
                          <Badge 
                            variant={
                              result.status === 'success' ? 'default' : 
                              result.status === 'error' ? 'destructive' : 'secondary'
                            }
                            className="text-xs flex-shrink-0"
                          >
                            {result.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              </TabsContent>

              <TabsContent value="scenarios" className="h-full overflow-y-auto p-4 m-0">
                <div className="grid grid-cols-2 gap-3">
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-border/50" onClick={() => handleQuickTest('happy')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 font-medium">
                      <CheckCircle className="w-4 h-4 text-status-success flex-shrink-0" />
                      Happy Path Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Test normal routing with all vendors healthy and within limits.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-border/50" onClick={() => handleQuickTest('failover')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 font-medium">
                      <XCircle className="w-4 h-4 text-status-error flex-shrink-0" />
                      Failover Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Test fallback routing when primary vendor is down.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-border/50" onClick={() => handleQuickTest('quota')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 font-medium">
                      <AlertTriangle className="w-4 h-4 text-status-warning flex-shrink-0" />
                      Quota Breach Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Test routing when vendor quota is exceeded.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-border/50" onClick={() => handleQuickTest('cost')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 font-medium">
                      <AlertTriangle className="w-4 h-4 text-status-warning flex-shrink-0" />
                      Cost Limit Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Test routing when message cost exceeds threshold.
                    </p>
                  </CardContent>
                </Card>
                </div>
              </TabsContent>
            </div>

            {/* Bottom Action Bar */}
            <div className="border-t border-border px-6 py-4 bg-card/50 backdrop-blur-sm shrink-0">
              <div className="flex justify-end">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRunSimulation}
                  className="h-9 px-6"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Test
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};