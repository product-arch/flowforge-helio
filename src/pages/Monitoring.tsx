import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BarChart3, Activity, AlertTriangle, TrendingUp, Home, HelpCircle, Settings, User, Bell, Moon, Sun, Globe, Shield, Database, Keyboard, LogOut } from 'lucide-react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { THEMES, Theme } from '@/constants/themes';

const Monitoring: React.FC = () => {
  const navigate = useNavigate();
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();
  const [helpModalOpen, setHelpModalOpen] = React.useState(false);
  const [personalInfoOpen, setPersonalInfoOpen] = React.useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = React.useState(false);
  const [billingOpen, setBillingOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [dataManagementOpen, setDataManagementOpen] = React.useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = React.useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const themeName = THEMES.find(t => t.value === newTheme)?.name || 'Unknown';
    toast({
      title: "Theme Changed",
      description: `Switched to ${themeName}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 pt-4">
          <div className="container mx-auto px-6">
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/5 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      Monitoring Dashboard
                    </h1>
                  </div>

                  <nav className="hidden md:flex items-center gap-6">
                    <Button
                      variant="ghost"
                      className="text-sm"
                      onClick={() => navigate("/home")}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Button>
                  </nav>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHelpModalOpen(true)}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>

                  {/* Settings Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuItem
                        onClick={() => setNotificationsOpen(true)}
                      >
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
                      <DropdownMenuItem
                        onClick={() => setDataManagementOpen(true)}
                      >
                        <Database className="w-4 h-4 mr-2" />
                        Data Management
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setKeyboardShortcutsOpen(true)}
                      >
                        <Keyboard className="w-4 h-4 mr-2" />
                        Keyboard Shortcuts
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      <div className="px-2 py-1">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Themes
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {THEMES.map((themeOption) => (
                            <button
                              key={themeOption.value}
                              onClick={() =>
                                handleThemeChange(themeOption.value)
                              }
                              className={`w-6 h-6 rounded-full ${
                                themeOption.preview
                              } hover:scale-110 transition-transform ${
                                theme === themeOption.value
                                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                                  : ""
                              }`}
                              title={themeOption.name}
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex gap-1">
                          <button
                            onClick={() => setMode("light")}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === "light"
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setMode("dark")}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === "dark"
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          setMode(mode === "light" ? "dark" : "light")
                        }
                      >
                        {mode === "light" ? (
                          <Moon className="w-4 h-4 mr-2" />
                        ) : (
                          <Sun className="w-4 h-4 mr-2" />
                        )}
                        {mode === "light" ? "Dark Mode" : "Light Mode"}
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
                      <DropdownMenuItem
                        onClick={() => setPersonalInfoOpen(true)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Personal Info
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setAccountSettingsOpen(true)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setBillingOpen(true)}>
                        <Badge className="w-4 h-4 mr-2" />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      <div className="px-2 py-1">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Themes
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {THEMES.map((themeOption) => (
                            <button
                              key={themeOption.value}
                              onClick={() =>
                                handleThemeChange(themeOption.value)
                              }
                              className={`w-6 h-6 rounded-full ${
                                themeOption.preview
                              } hover:scale-110 transition-transform ${
                                theme === themeOption.value
                                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                                  : ""
                              }`}
                              title={themeOption.name}
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex gap-1">
                          <button
                            onClick={() => setMode("light")}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === "light"
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setMode("dark")}
                            className={`px-2 py-1 text-xs rounded ${
                              mode === "dark"
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent"
                            }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          setMode(mode === "light" ? "dark" : "light")
                        }
                      >
                        {mode === "light" ? (
                          <Moon className="w-4 h-4 mr-2" />
                        ) : (
                          <Sun className="w-4 h-4 mr-2" />
                        )}
                        {mode === "light" ? "Dark Mode" : "Light Mode"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-emerald-500/10 rounded-full">
                    <BarChart3 className="w-12 h-12 text-emerald-500" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-heading font-heading-bold mb-4">
                  Monitoring Module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg font-body text-muted-foreground">
                  Real-time analytics, performance tracking, and comprehensive
                  reporting dashboards for your communication flows.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-accent/30 rounded-lg flex flex-col items-center justify-center text-center">
                    <Activity className="w-6 h-6 text-emerald-500 mb-2" />
                    <div className="text-sm font-body-medium">
                      Real-time Metrics
                    </div>
                  </div>
                  <div className="p-4 bg-accent/30 rounded-lg flex flex-col items-center justify-center text-center">
                    <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
                    <div className="text-sm font-body-medium">
                      Performance Analytics
                    </div>
                  </div>
                  <div className="p-4 bg-accent/30 rounded-lg flex flex-col items-center justify-center text-center">
                    <AlertTriangle className="w-6 h-6 text-emerald-500 mb-2" />
                    <div className="text-sm font-body-medium">
                      Alert Management
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/50 group"
                    onClick={() => navigate("/analytics")}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                          <BarChart3 className="w-8 h-8 text-emerald-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-heading font-heading-semibold mb-2 text-center">
                        Live Analytics
                      </h3>
                      <p className="text-muted-foreground text-center font-body">
                        Get real time updates
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/50 group"
                    onClick={() => navigate("/dashboard")}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                          <TrendingUp className="w-8 h-8 text-emerald-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-heading font-heading-semibold mb-2 text-center">
                        Dashboards & Reports
                      </h3>
                      <p className="text-muted-foreground text-center font-body">
                        Get actionable insights
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        {/* Help Modal - Monitoring specific content */}
        <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                About Monitoring Dashboard
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Monitoring Features
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">
                      Real-time Analytics:
                    </strong>{" "}
                    Monitor your communication flows with live metrics, delivery
                    rates, and performance tracking across all channels.
                  </p>
                  <p>
                    <strong className="text-foreground">
                      Performance Tracking:
                    </strong>{" "}
                    Track response times, throughput, error rates, and vendor
                    performance to optimize your messaging workflows.
                  </p>
                  <p>
                    <strong className="text-foreground">
                      Alert Management:
                    </strong>{" "}
                    Configure intelligent alerts for performance issues,
                    delivery failures, and system anomalies with automated
                    notifications.
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Message Volume:</strong>{" "}
                    Track total messages sent, delivered, and failed across all
                    communication channels.
                  </p>
                  <p>
                    <strong className="text-foreground">Vendor Health:</strong>{" "}
                    Monitor the status and performance of your configured
                    vendors with real-time health checks.
                  </p>
                  <p>
                    <strong className="text-foreground">Cost Analytics:</strong>{" "}
                    Analyze messaging costs and optimize routing strategies for
                    better cost efficiency.
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Coming Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                    <span className="text-sm font-medium">
                      Dashboard Version
                    </span>
                    <Badge variant="secondary">v1.0.0 (In Development)</Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Upcoming Features</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Custom Dashboard Widgets</span>
                        <span>Q1 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advanced Analytics</span>
                        <span>Q1 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Report Generation</span>
                        <span>Q2 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Monitoring</span>
                        <span>Q2 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Monitoring;