import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersonalInfoModal, AccountSettingsModal, BillingModal } from './AccountModals';
import { SimulationModal } from './SimulationModal';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Play, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  MoreVertical,
  User,
  Settings,
  CreditCard,
  Palette,
  FileDown,
  FileUp,
  Trash2,
  Copy,
  History,
  ArrowLeft
} from 'lucide-react';
import { useFlow } from '@/contexts/FlowContext';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const themes: Array<{ value: Theme; label: string; color: string }> = [
  { value: 'blue', label: 'Professional Blue', color: 'bg-blue-500' },
  { value: 'emerald', label: 'Growth Green', color: 'bg-emerald-500' },
  { value: 'purple', label: 'Creative Purple', color: 'bg-purple-500' },
  { value: 'orange', label: 'Energy Orange', color: 'bg-orange-500' },
  { value: 'rose', label: 'Warm Rose', color: 'bg-rose-500' },
  { value: 'indigo', label: 'Deep Indigo', color: 'bg-indigo-500' },
  { value: 'solarized-osaka', label: 'Solarized Osaka', color: 'bg-teal-600' },
  { value: 'monochrome', label: 'Black & White', color: 'bg-gray-900' },
];

const mockCampaigns = [
  'Summer Sale 2024',
  'Welcome Series',
  'Abandoned Cart Recovery'
];

export const FlowNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [flowName, setFlowName] = useState('UPI_payment notification');
  const [flowState, setFlowState] = useState<'draft' | 'active' | 'archived'>('draft');
  const [isEditing, setIsEditing] = useState(false);
  const [campaignCount] = useState(3);
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const { simulationMode, setSimulationMode } = useFlow();
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();

  // Load flow name from localStorage on component mount
  useEffect(() => {
    const savedFlowName = localStorage.getItem('flowName');
    if (savedFlowName) {
      setFlowName(savedFlowName);
    }
  }, []);

  // Save flow name to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('flowName', flowName);
  }, [flowName]);

  const handleSave = () => {
    toast({
      title: "Flow Saved",
      description: "Your routing flow has been saved successfully.",
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleActivate = () => {
    if (flowState === 'active') {
      setFlowState('draft');
      toast({
        title: "Flow Deactivated",
        description: "Your routing flow has been deactivated and is no longer processing messages.",
        className: "border-status-warning bg-status-warning/10 text-status-warning"
      });
    } else {
      setFlowState('active');
      toast({
        title: "Flow Activated",
        description: "Your routing flow is now live and processing messages.",
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    }
  };

  const handleSimulate = () => {
    setSimulationModalOpen(true);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${themes.find(t => t.value === newTheme)?.label}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Downloading flow configuration...",
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const handleImport = () => {
    toast({
      title: "Import Started",
      description: "Please select a configuration file to import.",
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const handleDelete = () => {
    toast({
      title: "Delete Failed",
      description: "Cannot delete active flow. Please deactivate first.",
      className: "border-status-error bg-status-error/10 text-status-error"
    });
  };

  return (
    <TooltipProvider>
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Flow Info */}
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
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Input
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  className="h-8 text-lg font-semibold"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-lg font-semibold cursor-pointer hover:text-primary"
                  onClick={() => setIsEditing(true)}
                >
                  {flowName}
                </h1>
              )}
              
              <Badge variant="secondary" className="text-xs">
                SMS
              </Badge>
              
              <Badge 
                variant={flowState === 'active' ? 'default' : 'secondary'}
                className={flowState === 'active' ? 'bg-status-success text-white' : ''}
              >
                {flowState === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                {flowState === 'draft' && <AlertCircle className="w-3 h-3 mr-1" />}
                {flowState.charAt(0).toUpperCase() + flowState.slice(1)}
              </Badge>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm text-muted-foreground cursor-help hover:text-foreground">
                  Used by {campaignCount} campaigns
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  {mockCampaigns.map((campaign, i) => (
                    <div key={i} className="text-xs">{campaign}</div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSimulate}
              className={simulationMode ? 'bg-status-info/10 border-status-info text-status-info' : ''}
            >
              <Play className="w-4 h-4 mr-2" />
              {simulationMode ? 'Stop Simulation' : 'Simulate'}
            </Button>

            <Button 
              size="sm"
              onClick={handleActivate}
              className={flowState === 'active' 
                ? "bg-status-warning hover:bg-status-warning/90 text-white" 
                : "bg-gradient-primary hover:opacity-90"
              }
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {flowState === 'active' ? 'Deactivate' : 'Activate'}
            </Button>

            {/* Account Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setPersonalInfoOpen(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Personal Info
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAccountSettingsOpen(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBillingOpen(true)}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <div className="px-2 py-1">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Themes</div>
                  <div className="grid grid-cols-3 gap-1">
                    {themes.map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => handleThemeChange(themeOption.value)}
                        className={`w-6 h-6 rounded-full ${themeOption.color} hover:scale-110 transition-transform ${
                          theme === themeOption.value ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
                        }`}
                        title={themeOption.label}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex gap-1">
                    <button
                      onClick={() => setMode('light')}
                      className={`px-2 py-1 text-xs rounded ${
                        mode === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setMode('dark')}
                      className={`px-2 py-1 text-xs rounded ${
                        mode === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Export Configuration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImport}>
                  <FileUp className="w-4 h-4 mr-2" />
                  Import Configuration
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate Flow
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="w-4 h-4 mr-2" />
                  View History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Flow
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <PersonalInfoModal isOpen={personalInfoOpen} onClose={() => setPersonalInfoOpen(false)} />
      <AccountSettingsModal isOpen={accountSettingsOpen} onClose={() => setAccountSettingsOpen(false)} />
      <BillingModal isOpen={billingOpen} onClose={() => setBillingOpen(false)} />
      <SimulationModal isOpen={simulationModalOpen} onClose={() => setSimulationModalOpen(false)} />
    </TooltipProvider>
  );
};