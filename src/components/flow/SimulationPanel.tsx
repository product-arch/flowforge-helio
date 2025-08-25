import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronUp, 
  ChevronDown, 
  Play, 
  RotateCcw, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useFlow } from '@/contexts/FlowContext';
import { useToast } from '@/hooks/use-toast';

export const SimulationPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
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

  if (!expanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">Simulation Center</h3>
            {simulationMode && (
              <Badge variant="outline" className="bg-status-info/10 text-status-info border-status-info">
                Simulation Active
              </Badge>
            )}
            {simulationResults.length > 0 && (
              <Badge variant="secondary">
                {simulationResults.length} results
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setExpanded(true)}
          >
            <ChevronUp className="w-4 h-4 mr-2" />
            Expand
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: 400 }}
      exit={{ height: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border overflow-hidden"
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Simulation Center</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunSimulation}
              >
                <Play className="w-4 h-4 mr-2" />
                Run Test
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(false)}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="config" className="h-full">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="scenarios">Quick Tests</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Input Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>App ID</Label>
                      <Input
                        value={testParams.appId}
                        onChange={(e) => setTestParams({ ...testParams, appId: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Channel</Label>
                      <Select
                        value={testParams.channel}
                        onValueChange={(value) => setTestParams({ ...testParams, channel: value })}
                      >
                        <SelectTrigger>
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
                    <div>
                      <Label>Message Type</Label>
                      <Select
                        value={testParams.messageType}
                        onValueChange={(value) => setTestParams({ ...testParams, messageType: value })}
                      >
                        <SelectTrigger>
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
                    <div>
                      <Label>Message ID</Label>
                      <Input
                        value={testParams.messageId}
                        onChange={(e) => setTestParams({ ...testParams, messageId: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Vendor Overrides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Gupshup Status</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Karix Status</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Kaleyra Status</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quota Overrides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Gupshup Quota</Label>
                      <Input placeholder="Leave empty for actual" />
                    </div>
                    <div>
                      <Label className="text-xs">Karix Quota</Label>
                      <Input placeholder="Leave empty for actual" />
                    </div>
                    <div>
                      <Label className="text-xs">Kaleyra Quota</Label>
                      <Input placeholder="Leave empty for actual" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Channel Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Sender ID</Label>
                      <Input placeholder="HELOHUB" />
                    </div>
                    <div>
                      <Label className="text-xs">RCS Bot Name</Label>
                      <Input placeholder="helo_support" />
                    </div>
                    <div>
                      <Label className="text-xs">WhatsApp Number</Label>
                      <Input placeholder="+91XXXXXXXXXX" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="results" className="h-full overflow-y-auto p-4">
              <div className="space-y-3">
                {simulationResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No simulation results yet. Run a test to see results.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Simulation Results</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={exportResults}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                    </div>
                    
                    {simulationResults.map((result, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.status === 'success' && <CheckCircle className="w-4 h-4 text-status-success" />}
                          {result.status === 'error' && <XCircle className="w-4 h-4 text-status-error" />}
                          {result.status === 'warning' && <AlertTriangle className="w-4 h-4 text-status-warning" />}
                          <span className="text-sm font-medium">{result.nodeId}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm">{result.message}</span>
                        </div>
                        <Badge variant={
                          result.status === 'success' ? 'default' : 
                          result.status === 'error' ? 'destructive' : 'secondary'
                        }>
                          {result.status}
                        </Badge>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-accent/50" onClick={() => handleQuickTest('happy')}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-status-success" />
                      Happy Path Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Test normal routing with all vendors healthy and within limits.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50" onClick={() => handleQuickTest('failover')}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-status-error" />
                      Failover Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Test fallback routing when primary vendor is down.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50" onClick={() => handleQuickTest('quota')}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-status-warning" />
                      Quota Breach Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Test routing when vendor quota is exceeded.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-accent/50" onClick={() => handleQuickTest('cost')}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-status-warning" />
                      Cost Limit Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Test routing when message cost exceeds threshold.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};