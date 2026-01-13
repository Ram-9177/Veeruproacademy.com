import { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  FolderKanban, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  Bell
} from 'lucide-react';
// Button import removed (not used)
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage?: string;
  onNavigate?: (_page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-accent' },
  { id: 'courses', label: 'Courses', icon: BookOpen, color: 'text-primary' },
  { id: 'lessons', label: 'Lessons', icon: FileText, color: 'text-success' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, color: 'text-warning' },
  { id: 'payments', label: 'Payments', icon: CreditCard, color: 'text-accent' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'text-primary' },
];

export function AdminLayout({ children, currentPage = 'dashboard', onNavigate }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (pageId: string) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:flex lg:w-80 lg:flex-col bg-primary shadow-xl border-r-2 border-primary-foreground/10">
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Veeru&apos;s Pro Academy</h1>
              <p className="text-white/70 text-sm font-medium">Admin Control Panel</p>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10">
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-primary font-bold text-lg shadow-md">
              AD
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Admin User</p>
              <p className="text-white/70 text-sm">admin@veerupro.academy</p>
            </div>
            <Bell className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider px-4 mb-3">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all font-medium group relative ${
                  isActive
                    ? 'bg-accent text-white shadow-xl shadow-accent/30 scale-105'
                    : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-102'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-white" />
                )}
                {item.id === 'payments' && (
                  <Badge className="bg-success text-white text-xs px-2 py-0.5">
                    7
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-4">
          <Separator className="mb-4 bg-white/10" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-white/80 hover:bg-destructive/20 hover:text-white transition-all font-medium group"
          >
            <LogOut className="h-5 w-5" />
            <span className="flex-1 text-left">Logout</span>
            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b-2 border-border shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
                <div>
                  <h1 className="text-primary font-bold text-lg">Veeru&apos;s Pro Academy</h1>
              <p className="text-xs text-muted-foreground font-medium">Admin Panel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-5 w-5 text-primary" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className="h-6 w-6 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="border-t-2 border-border bg-white px-4 py-4 space-y-2 shadow-lg">
            <div className="mb-4 p-3 rounded-xl bg-secondary border-2 border-border">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-md">
                  AD
                </div>
                <div>
                  <p className="text-primary font-semibold text-sm">Admin User</p>
                  <p className="text-muted-foreground text-xs">admin@veerupro.academy</p>
                </div>
              </div>
            </div>
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-foreground hover:bg-secondary border-2 border-transparent hover:border-primary/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === 'payments' && (
                    <Badge className="bg-success text-white text-xs">7</Badge>
                  )}
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </button>
              );
            })}
            
            <Separator className="my-3" />
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-destructive hover:bg-destructive/10 transition-all font-medium border-2 border-transparent hover:border-destructive/20"
            >
              <LogOut className="h-5 w-5" />
              <span className="flex-1 text-left">Logout</span>
            </button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen bg-secondary">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
