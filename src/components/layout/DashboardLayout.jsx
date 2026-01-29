import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
    BarChart3,
    Users,
    BookOpen,
    LayoutDashboard,
    Settings,
    LogOut,
    ChevronRight,
    UserCircle,
    FileText,
    CalendarCheck,
    CreditCard,
    Bell,
    Home,
    Menu,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = {
        member: [
            { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
            { name: 'My Bookings', path: '/dashboard/bookings', icon: CalendarCheck },
            { name: 'Profile', path: '/dashboard/profile', icon: UserCircle },
            { name: 'Activity Log', path: '/dashboard/activity-log', icon: FileText },
        ],
        trainer: [
            { name: 'Overview', path: '/trainer-dashboard', icon: LayoutDashboard },
            { name: 'Manage Slots', path: '/trainer-dashboard/slots', icon: CalendarCheck },
            { name: 'Add New Slot', path: '/trainer-dashboard/add-slot', icon: Plus },
            { name: 'My Students', path: '/trainer-dashboard/students', icon: Users },
            { name: 'Add New Forum', path: '/dashboard/add-forum', icon: FileText },
            { name: 'Manage Forums', path: '/dashboard/manage-forums', icon: BookOpen },
            { name: 'Profile', path: '/dashboard/profile', icon: UserCircle },
        ],
        admin: [
            { name: 'Statistics', path: '/admin-dashboard', icon: BarChart3 },
            { name: 'Trainers', path: '/admin-dashboard/trainers', icon: Users },
            { name: 'Applied Trainers', path: '/admin-dashboard/applications', icon: FileText },
            { name: 'Classes', path: '/admin-dashboard/classes', icon: BookOpen },
            { name: 'Newsletter', path: '/admin-dashboard/newsletter', icon: Bell },
            { name: 'Add New Forum', path: '/dashboard/add-forum', icon: Plus },
            { name: 'Manage Forums', path: '/dashboard/manage-forums', icon: BookOpen },
            { name: 'Profile', path: '/dashboard/profile', icon: UserCircle },
        ]
    };

    const currentMenu = menuItems[user?.role || 'member'];

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-72 bg-card border-r hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl shadow-black/5">
                <div className="p-8 pb-4">
                    <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Home className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-widest tracking-tighter">FitTracker</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <p className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-4">Main Menu</p>
                    {currentMenu?.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 transform scale-[1.02]'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-primary/60 group-hover:text-primary transition-colors'}`} />
                                    <span className="text-sm font-bold">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight className="h-4 w-4 opacity-40" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-10 w-10 border-2 border-background rounded-xl">
                                <AvatarImage src={user?.photoURL} />
                                <AvatarFallback className="font-bold bg-muted">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                                <p className="text-sm font-black truncate">{user?.name || 'Guest'}</p>
                                <Badge variant="outline" className="text-[9px] h-4 px-1 leading-none uppercase font-black opacity-60">{user?.role || 'member'}</Badge>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full justify-start text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive h-10 px-3 rounded-xl" onClick={() => logout()}>
                            <LogOut className="h-4 w-4 mr-2" /> Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden">
                <header className="h-20 bg-background/50 backdrop-blur-md border-b sticky top-0 z-40 px-8 flex items-center justify-between lg:justify-end">
                    <Button variant="ghost" size="icon" className="lg:hidden"> <Menu className="h-6 w-6" /> </Button>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full"> <Bell className="h-5 w-5 text-muted-foreground" /> </Button>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">User Dashboard</p>
                                <p className="text-sm font-bold italic">{user?.name || 'Champion'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 lg:p-12 animate-in fade-in duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
