import React from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  PersonalInfoModal, 
  AccountSettingsModal, 
  BillingModal,
  NotificationsModal,
  LanguageModal,
  PrivacyModal,
  DataManagementModal,
  KeyboardShortcutsModal
} from '@/components/flow/AccountModals';
import { ThemeSelector } from '@/components/navigation/ThemeSelector';
import { SettingsDropdown } from '@/components/navigation/SettingsDropdown';
import { useModalStates } from '@/hooks/useModalStates';
import { 
  ArrowLeft,
  Settings,
  User,
  MoreHorizontal,
  MessageSquare,
  Mail,
  Phone,
  Hash,
  Shield,
  Grid3X3,
  List,
  Bell,
  Globe,
  Database,
  Keyboard,
  Moon,
  Sun,
  Plus,
  GitBranch
} from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { THEMES } from '@/constants/themes';
import { BusinessUnitCreationModal } from '@/components/business/BusinessUnitCreationModal';
import { RouteAssignmentModal } from '@/components/business/RouteAssignmentModal';
import { generateBusinessCode } from '@/utils/businessCodeGenerator';

// Business data with generated codes
const initialBusinessProfiles = [
  {
    name: "UPI Switch",
    code: "hdfc-upis-8z8o",
    status: "active",
    channels: ["sms", "rcs", "email"]
  },
  {
    name: "Net Banking",
    code: "hdfc-netb-4a3e",
    status: "active",
    channels: ["sms", "email", "whatsapp"]
  },
  {
    name: "Auto Loans",
    code: "hdfc-auto-7x9m",
    status: "active",
    channels: ["sms", "email", "whatsapp"]
  },
  {
    name: "Credit and Debit cards",
    code: "hdfc-cred-2k8p",
    status: "active",
    channels: ["sms", "rcs", "email", "voice"]
  },
  {
    name: "Personal Loans",
    code: "hdfc-pers-5j3n",
    status: "inactive",
    channels: ["sms", "email"]
  },
  {
    name: "Home Loans",
    code: "hdfc-home-9w4r",
    status: "active",
    channels: ["sms", "email", "whatsapp", "voice"]
  },
  {
    name: "Gold Loans",
    code: "hdfc-gold-1x7t",
    status: "active",
    channels: ["sms", "whatsapp"]
  },
  {
    name: "Mortgages",
    code: "hdfc-mort-6p9k",
    status: "inactive",
    channels: ["email", "voice"]
  },
  {
    name: "Commercial Vehicle Finance",
    code: "hdfc-comm-3m8x",
    status: "active",
    channels: ["sms", "email", "rcs"]
  },
  {
    name: "Retail Business Banking",
    code: "hdfc-reta-4n2w",
    status: "active",
    channels: ["sms", "email", "whatsapp", "voice"]
  },
  {
    name: "Savings Account",
    code: "hdfc-savi-8k5j",
    status: "active",
    channels: ["sms", "rcs", "email", "whatsapp"]
  },
  {
    name: "Current Account",
    code: "hdfc-curr-7t9p",
    status: "active",
    channels: ["sms", "email", "voice"]
  },
  {
    name: "Fixed and Recurring Deposits",
    code: "hdfc-fixe-2x6m",
    status: "inactive",
    channels: ["email", "sms"]
  },
  {
    name: "Corporate Salary Accounts",
    code: "hdfc-corp-5w8n",
    status: "active",
    channels: ["sms", "email", "rcs"]
  },
  {
    name: "Construction Equipment Finance",
    code: "hdfc-cons-9j4k",
    status: "active",
    channels: ["email", "voice", "whatsapp"]
  },
  {
    name: "Agri and Tractor Loans",
    code: "hdfc-agri-3p7x",
    status: "active",
    channels: ["sms", "whatsapp"]
  },
  {
    name: "SHG Loans",
    code: "hdfc-shgl-6m9t",
    status: "inactive",
    channels: ["sms", "email"]
  },
  {
    name: "Kisan Gold Card",
    code: "hdfc-kisa-1k8w",
    status: "active",
    channels: ["sms", "whatsapp", "voice"]
  },
  {
    name: "Distribution of Mutual Funds, Life, General and Health insurance",
    code: "hdfc-dist-4x2n",
    status: "active",
    channels: ["sms", "email", "rcs", "whatsapp"]
  },
  {
    name: "Healthcare Finance",
    code: "hdfc-heal-7p5j",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Offshore loans to NRIs",
    code: "hdfc-offs-9w3k",
    status: "inactive",
    channels: ["email", "voice"]
  },
  {
    name: "NRI deposits",
    code: "hdfc-nrid-2t7m",
    status: "active",
    channels: ["email", "sms"]
  },
  {
    name: "Small ticket working capital loans",
    code: "hdfc-smal-8x4p",
    status: "active",
    channels: ["sms", "email", "whatsapp"]
  },
  {
    name: "Business loans",
    code: "hdfc-busi-5k9w",
    status: "active",
    channels: ["sms", "email", "rcs", "voice"]
  },
  {
    name: "Two-wheeler loans",
    code: "hdfc-twow-3n6j",
    status: "active",
    channels: ["sms", "whatsapp"]
  },
  {
    name: "Loans Against Securities",
    code: "hdfc-loan-7m2x",
    status: "inactive",
    channels: ["email", "voice"]
  },
  {
    name: "Rural Housing Loans",
    code: "hdfc-rura-1p8t",
    status: "active",
    channels: ["sms", "whatsapp"]
  },
  {
    name: "Affordable Housing – HDFC Reach Loans",
    code: "hdfc-affo-6w4k",
    status: "active",
    channels: ["sms", "email", "whatsapp", "voice"]
  },
  {
    name: "Refinance – Home Loan Balance Transfer",
    code: "hdfc-refi-9j7n",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Housing Loans for Non-Resident Indians (NRIs)",
    code: "hdfc-hous-4x5m",
    status: "inactive",
    channels: ["email", "voice"]
  },
  {
    name: "House Renovation Loans",
    code: "hdfc-hren-2t9p",
    status: "active",
    channels: ["sms", "email"]
  },
  {
    name: "Home Extension Loans",
    code: "hdfc-hext-8k3w",
    status: "active",
    channels: ["sms", "email", "whatsapp"]
  },
  {
    name: "Top up Loans",
    code: "hdfc-topu-5p7j",
    status: "active",
    channels: ["sms", "rcs", "email"]
  },
  {
    name: "Loan Against property",
    code: "hdfc-prop-3w9x",
    status: "active",
    channels: ["email", "voice", "whatsapp"]
  },
  {
    name: "Working Capital Facilities",
    code: "hdfc-work-7n4k",
    status: "active",
    channels: ["email", "rcs"]
  },
  {
    name: "Term Lending",
    code: "hdfc-term-1m8t",
    status: "inactive",
    channels: ["email", "voice"]
  },
  {
    name: "Project Finance",
    code: "hdfc-proj-6x2p",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Debt Capital Markets",
    code: "hdfc-debt-9k5w",
    status: "active",
    channels: ["email", "rcs"]
  },
  {
    name: "Mergers and Acquisitions",
    code: "hdfc-merg-4j7n",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Trade Credit",
    code: "hdfc-trad-2p9m",
    status: "active",
    channels: ["email", "sms"]
  },
  {
    name: "Supply Chain Financing",
    code: "hdfc-supp-8w3x",
    status: "active",
    channels: ["email", "rcs", "voice"]
  },
  {
    name: "Forex and Derivatives",
    code: "hdfc-fore-5t6k",
    status: "inactive",
    channels: ["email", "voice"]
  },
  {
    name: "Cash Management Services",
    code: "hdfc-cash-7x9j",
    status: "active",
    channels: ["email", "sms"]
  },
  {
    name: "Wholesale Deposits",
    code: "hdfc-whol-3n4p",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Letters of Credit and Guarantees",
    code: "hdfc-lett-1k7w",
    status: "active",
    channels: ["email", "rcs"]
  },
  {
    name: "Custodial Services",
    code: "hdfc-cust-6m2t",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Correspondent Banking",
    code: "hdfc-corr-9p5x",
    status: "inactive",
    channels: ["email"]
  },
  {
    name: "Construction Finance",
    code: "hdfc-conf-4w8k",
    status: "active",
    channels: ["email", "voice", "sms"]
  },
  {
    name: "Working Capital Loans",
    code: "hdfc-wocl-2j6n",
    status: "active",
    channels: ["email", "rcs", "sms"]
  },
  {
    name: "Term Loans",
    code: "hdfc-terl-8x3m",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Supply Chain Management",
    code: "hdfc-sucm-5t9p",
    status: "active",
    channels: ["email", "rcs"]
  },
  {
    name: "Export Finance",
    code: "hdfc-expo-7k4w",
    status: "inactive",
    channels: ["email", "voice"]
  },
  {
    name: "Tractor Finance",
    code: "hdfc-trac-3p7j",
    status: "active",
    channels: ["sms", "whatsapp"]
  },
  {
    name: "Infrastructure Finance",
    code: "hdfc-infr-1w9x",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Crop Loan/Farmer Finance",
    code: "hdfc-crop-6n2k",
    status: "active",
    channels: ["sms", "whatsapp", "voice"]
  },
  {
    name: "KCC",
    code: "hdfc-kccl-9m5t",
    status: "active",
    channels: ["sms", "whatsapp"]
  },
  {
    name: "Dairy/Cattle Finance",
    code: "hdfc-dair-4x8p",
    status: "active",
    channels: ["sms", "whatsapp"]
  },
  {
    name: "Liabilities",
    code: "hdfc-liab-2k6w",
    status: "inactive",
    channels: ["email"]
  },
  {
    name: "CASA Accounts",
    code: "hdfc-casa-8j3n",
    status: "active",
    channels: ["sms", "email", "rcs"]
  },
  {
    name: "Fixed Deposits",
    code: "hdfc-fixd-5p9m",
    status: "active",
    channels: ["sms", "email", "voice"]
  },
  {
    name: "Salary Account",
    code: "hdfc-sala-7w4x",
    status: "active",
    channels: ["sms", "email", "whatsapp"]
  },
  {
    name: "Trade Finance",
    code: "hdfc-trfi-3t7k",
    status: "active",
    channels: ["email", "rcs"]
  },
  {
    name: "Bank Guarantee/LCs",
    code: "hdfc-bank-1n9j",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "International Trade",
    code: "hdfc-inte-6x2p",
    status: "inactive",
    channels: ["email", "voice"]
  },
  {
    name: "FX Advisory",
    code: "hdfc-fxad-9k5w",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Trade Flows & Derivatives",
    code: "hdfc-trfl-4m8t",
    status: "active",
    channels: ["email", "rcs"]
  },
  {
    name: "Foreign exchange & derivatives",
    code: "hdfc-fxde-2p6n",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Solutions on hedging strategies",
    code: "hdfc-solu-8w3x",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Trade solutions - domestic and cross border",
    code: "hdfc-trso-5j7k",
    status: "active",
    channels: ["email", "rcs"]
  },
  {
    name: "Bullion",
    code: "hdfc-bull-7t9m",
    status: "inactive",
    channels: ["email"]
  },
  {
    name: "Debt capital markets",
    code: "hdfc-decm-3x4p",
    status: "active",
    channels: ["email", "voice"]
  },
  {
    name: "Equities",
    code: "hdfc-equi-1k8w",
    status: "active",
    channels: ["email", "rcs"]
  },
  {
    name: "Research - Reports & commentary on markets and currencies",
    code: "hdfc-rese-6n2j",
    status: "active",
    channels: ["email", "rcs"]
  },
  {
    name: "Asset liability management",
    code: "hdfc-asse-9p5x",
    status: "active",
    channels: ["email"]
  },
  {
    name: "Statutory reserve",
    code: "hdfc-stat-4w7t",
    status: "inactive",
    channels: ["email"]
  }
];

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'sms': return MessageSquare;
    case 'email': return Mail;
    case 'voice': return Phone;
    case 'whatsapp': return MessageSquare;
    case 'rcs': return Hash;
    default: return MessageSquare;
  }
};

const getChannelColor = (channel: string) => {
  switch (channel) {
    case 'sms': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'email': return 'bg-red-500/10 text-red-600 border-red-500/20';
    case 'voice': return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'whatsapp': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'rcs': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

const UserProfiles: React.FC = () => {
  const navigate = useNavigate();
  const [businessProfiles, setBusinessProfiles] = React.useState(initialBusinessProfiles);
  const [selectedBusiness, setSelectedBusiness] = React.useState<typeof initialBusinessProfiles[0] | null>(null);
  const [businessCreationModalOpen, setBusinessCreationModalOpen] = React.useState(false);
  const [extrasModalOpen, setExtrasModalOpen] = React.useState(false);
  const [isRouteAssignmentModalOpen, setIsRouteAssignmentModalOpen] = React.useState(false);
  const [selectedBusinessForRoute, setSelectedBusinessForRoute] = React.useState<typeof initialBusinessProfiles[0] | null>(null);
  const [viewMode, setViewMode] = React.useState<'card' | 'list'>('card');
  const [personalInfoOpen, setPersonalInfoOpen] = React.useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = React.useState(false);
  const [billingOpen, setBillingOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [dataManagementOpen, setDataManagementOpen] = React.useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = React.useState(false);
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();

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

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${themes.find(t => t.value === newTheme)?.label}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const handleSettingClick = (setting: string) => {
    toast({
      title: "Setting Updated",
      description: `${setting} setting has been updated`,
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  const handleExtrasClick = (business: typeof initialBusinessProfiles[0]) => {
    setSelectedBusiness(business);
    setExtrasModalOpen(true);
  };

  const handleAssignRoute = (business: typeof initialBusinessProfiles[0]) => {
    setSelectedBusinessForRoute(business);
    setIsRouteAssignmentModalOpen(true);
  };

  const handleRouteAssignment = (routeId: string) => {
    if (!selectedBusinessForRoute) return;

    // Find the route name from the mock data (in a real app, this would come from a service)
    const routeName = `Route Plan ${routeId.split('-')[1]}`;
    
    setBusinessProfiles(prev => prev.map(profile => 
      profile.code === selectedBusinessForRoute.code
        ? {
            ...profile,
            assignedRouteId: routeId,
            assignedRouteName: routeName,
            routeAssignedAt: new Date().toISOString().split('T')[0]
          }
        : profile
    ));
    
    toast({
      title: "Route Plan Assigned",
      description: `${routeName} has been assigned to ${selectedBusinessForRoute.name}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
    
    setIsRouteAssignmentModalOpen(false);
    setSelectedBusinessForRoute(null);
  };

  const handleCreateBusinessUnit = (data: { brandName: string; businessEntityName: string; channels: string[] }) => {
    const existingCodes = businessProfiles.map(bp => bp.code);
    const newCode = generateBusinessCode(data.brandName, data.businessEntityName, existingCodes);
    
    const newBusinessUnit = {
      name: data.brandName,
      code: newCode,
      status: 'active' as const,
      channels: data.channels,
    };

    setBusinessProfiles(prev => [...prev, newBusinessUnit]);
    
    toast({
      title: "Business Unit Created",
      description: `${data.brandName} has been successfully created with code ${newCode}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
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
                  onClick={() => navigate('/home')}
                  className="mr-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                
                <Separator orientation="vertical" className="h-6" />
                
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Business Profiles
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setBusinessCreationModalOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Business Unit
                </Button>
                
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
                
                {/* Settings Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setNotificationsOpen(true)}>
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguageOpen(true)}>
                      <Globe className="w-4 h-4 mr-2" />
                      Language & Region
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPrivacyOpen(true)}>
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy & Security
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDataManagementOpen(true)}>
                      <Database className="w-4 h-4 mr-2" />
                      Data Management
                    </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setKeyboardShortcutsOpen(true)}>
                    <Keyboard className="w-4 h-4 mr-2" />
                    Keyboard Shortcuts
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                      {mode === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                      {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Account Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
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
                      <Badge className="w-4 h-4 mr-2" />
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
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-heading font-heading-bold mb-4">Business Profiles</h2>
          <p className="text-lg font-body text-muted-foreground">
            Manage and configure business profiles for different banking and financial services.
          </p>
        </motion.div>

        {/* Business Profiles Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessProfiles.map((business, index) => (
                <motion.div
                  key={business.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Card className="border-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20 h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={business.status === 'active' ? 'default' : 'secondary'}
                              className={business.status === 'active' 
                                ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20' 
                                : 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20'
                              }
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              {business.status.toUpperCase()}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-heading font-heading-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
                            {business.name}
                          </CardTitle>
                          <CardDescription className="text-sm font-mono text-muted-foreground">
                            {business.code}
                          </CardDescription>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExtrasClick(business)}>
                              <User className="h-4 w-4 mr-2" />
                              Extras
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignRoute(business)}>
                              <GitBranch className="h-4 w-4 mr-2" />
                              Assign Route Plan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Active Channels</h4>
                        <div className="flex flex-wrap gap-2">
                          {business.channels.map((channel, idx) => {
                            const IconComponent = getChannelIcon(channel);
                            return (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className={`text-xs ${getChannelColor(channel)}`}
                              >
                                <IconComponent className="w-3 h-3 mr-1" />
                                {channel.toUpperCase()}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border/50">
              <div className="p-4 border-b border-border/50">
                <h2 className="text-lg font-semibold">All Business Profiles</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Business Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Active Channels</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessProfiles.map((business) => (
                    <TableRow key={business.code} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{business.name}</TableCell>
                      <TableCell className="font-mono text-sm">{business.code}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={business.status === 'active' ? 'default' : 'secondary'}
                          className={business.status === 'active' 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                            : 'bg-red-500/10 text-red-600 border-red-500/20'
                          }
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {business.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {business.channels.map((channel, idx) => {
                            const IconComponent = getChannelIcon(channel);
                            return (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className={`text-xs ${getChannelColor(channel)}`}
                              >
                                <IconComponent className="w-3 h-3 mr-1" />
                                {channel.toUpperCase()}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExtrasClick(business)}>
                              <User className="h-4 w-4 mr-2" />
                              Extras
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignRoute(business)}>
                              <GitBranch className="h-4 w-4 mr-2" />
                              Assign Route Plan
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

      {/* Extras Modal */}
      <Dialog open={extrasModalOpen} onOpenChange={setExtrasModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-heading-semibold">
              Business Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedBusiness && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Business Name</h3>
                  <p className="text-lg font-semibold">{selectedBusiness.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Business Code</h3>
                  <p className="text-lg font-mono">{selectedBusiness.code}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                <Badge 
                  variant={selectedBusiness.status === 'active' ? 'default' : 'secondary'}
                  className={selectedBusiness.status === 'active' 
                    ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                    : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {selectedBusiness.status.toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Active Channels</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedBusiness.channels.map((channel, idx) => {
                    const IconComponent = getChannelIcon(channel);
                    return (
                      <div key={idx} className={`p-3 rounded-lg border ${getChannelColor(channel)}`}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="font-medium">{channel.toUpperCase()}</span>
                        </div>
                        <p className="text-xs mt-1 opacity-70">
                          {channel === 'sms' && 'Text messaging service'}
                          {channel === 'email' && 'Email communication'}
                          {channel === 'voice' && 'Voice calls and IVR'}
                          {channel === 'whatsapp' && 'WhatsApp Business API'}
                          {channel === 'rcs' && 'Rich Communication Services'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Additional Details</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Created: {new Date().toLocaleDateString()}</p>
                  <p>• Last Updated: {new Date().toLocaleDateString()}</p>
                  <p>• Total Messages Sent: {Math.floor(Math.random() * 50000 + 10000).toLocaleString()}</p>
                  <p>• Success Rate: {(Math.random() * 10 + 90).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Account Modals */}
      <PersonalInfoModal isOpen={personalInfoOpen} onClose={() => setPersonalInfoOpen(false)} />
      <AccountSettingsModal isOpen={accountSettingsOpen} onClose={() => setAccountSettingsOpen(false)} />
      <BillingModal isOpen={billingOpen} onClose={() => setBillingOpen(false)} />
      
      {/* Settings Modals */}
      <NotificationsModal isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <LanguageModal isOpen={languageOpen} onClose={() => setLanguageOpen(false)} />
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <DataManagementModal isOpen={dataManagementOpen} onClose={() => setDataManagementOpen(false)} />
      <KeyboardShortcutsModal isOpen={keyboardShortcutsOpen} onClose={() => setKeyboardShortcutsOpen(false)} />
      
      <BusinessUnitCreationModal
        open={businessCreationModalOpen}
        onOpenChange={setBusinessCreationModalOpen}
        onSubmit={handleCreateBusinessUnit}
      />

      <RouteAssignmentModal
        isOpen={isRouteAssignmentModalOpen}
        onClose={() => setIsRouteAssignmentModalOpen(false)}
        businessProfileName={selectedBusinessForRoute?.name || ''}
        onAssign={handleRouteAssignment}
      />
    </div>
  );
};

export default UserProfiles;