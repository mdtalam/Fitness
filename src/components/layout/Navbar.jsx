import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Dumbbell, Menu, X, LayoutDashboard, LogOut, Settings, UserCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Trainers', path: '/trainers' },
        { name: 'Classes', path: '/classes' },
        { name: 'Community', path: '/forum' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <Dumbbell className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="hidden text-xl font-black tracking-tighter sm:block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        FitTracker
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-bold transition-all duration-300 relative py-1 ${isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-primary'
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-underline"
                                        className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                    {user && user.role === 'member' && (
                        <Link
                            to="/become-trainer"
                            className={`text-sm font-bold transition-all relative py-1 ${location.pathname === '/become-trainer' ? 'text-primary' : 'text-primary/80 hover:text-primary'
                                }`}
                        >
                            Become a Trainer
                            {location.pathname === '/become-trainer' && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary rounded-full"
                                />
                            )}
                        </Link>
                    )}
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="hidden md:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border/50 shadow-sm transition-all hover:border-primary/30 p-0 overflow-hidden">
                                        <Avatar className="h-full w-full">
                                            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.name} className="object-cover" />}
                                            <AvatarFallback className="bg-primary/5 text-primary">
                                                {user.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-none bg-background/95 backdrop-blur-xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
                                    <div className="px-3 py-3 mb-2 bg-muted/30 rounded-xl">
                                        <p className="text-sm font-black italic">{user.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-widest">{user.role}</p>
                                    </div>
                                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="flex items-center gap-3 cursor-pointer rounded-xl py-2.5 transition-all focus:bg-primary focus:text-primary-foreground m-1">
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span className="font-bold text-sm">Dashboard</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/dashboard/profile')} className="flex items-center gap-3 cursor-pointer rounded-xl py-2.5 transition-all focus:bg-primary focus:text-primary-foreground m-1">
                                        <UserCircle className="h-4 w-4" />
                                        <span className="font-bold text-sm">Profile Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 cursor-pointer text-destructive focus:bg-destructive focus:text-white rounded-xl py-2.5 transition-all m-1">
                                        <LogOut className="h-4 w-4" />
                                        <span className="font-bold text-sm">Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="hidden items-center gap-3 md:flex">
                            <Button variant="ghost" asChild className="hover:bg-primary/5 hover:text-primary transition-colors font-bold rounded-xl px-6">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 rounded-xl px-6 font-bold">
                                <Link to="/register">Join Now</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/5 transition-colors rounded-xl h-10 w-10"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute left-0 top-16 w-full bg-background border-b shadow-2xl md:hidden overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isActive
                                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                                : 'hover:bg-muted font-bold'
                                            }`}
                                    >
                                        <span className="font-black italic uppercase tracking-widest">{link.name}</span>
                                        <ArrowRight className={`h-4 w-4 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                    </Link>
                                );
                            })}

                            {user && user.role === 'member' && (
                                <Link
                                    to="/become-trainer"
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${location.pathname === '/become-trainer'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-primary/5 text-primary hover:bg-primary/10'
                                        }`}
                                >
                                    <span className="font-black italic uppercase tracking-widest text-sm">Become a Trainer</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}

                            <div className="pt-4 border-t">
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                                            <Avatar className="h-12 w-12 rounded-xl">
                                                <AvatarImage src={user.photoURL} />
                                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-black italic leading-none mb-1">{user.name}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user.role}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="outline" asChild className="rounded-xl h-12 font-black uppercase tracking-widest text-[10px]">
                                                <Link to="/dashboard">Dashboard</Link>
                                            </Button>
                                            <Button onClick={handleLogout} variant="ghost" className="rounded-xl h-12 font-black uppercase tracking-widest text-[10px] text-destructive hover:bg-destructive/10">
                                                Sign Out
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button variant="ghost" asChild className="rounded-xl h-14 font-black uppercase tracking-widest">
                                            <Link to="/login">Login</Link>
                                        </Button>
                                        <Button asChild className="rounded-xl h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                            <Link to="/register">Join Now</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
