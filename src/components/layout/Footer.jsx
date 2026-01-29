import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted/30 pt-16 pb-8 border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                                <Dumbbell className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">FitTracker</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Empowering your fitness journey with expert trainers and cutting-edge classes. Join our community today.
                        </p>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary transition-colors">
                                <Youtube className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Home', 'Trainers', 'Classes', 'Community', 'About Us'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={`/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                                    >
                                        <span className="h-1 w-0 bg-primary mr-0 transition-all group-hover:w-2 group-hover:mr-2 rounded-full"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <p className="text-sm text-muted-foreground">123 Fitness Ave, Wellness City, CA 90210</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <p className="text-sm text-muted-foreground">+1 (555) 000-FIT</p>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <p className="text-sm text-muted-foreground">hello@fittracker.com</p>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Stub */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Newsletter</h4>
                        <p className="text-sm text-muted-foreground">Get the latest fitness tips and platform updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <Button size="sm" className="shrink-0 shadow-lg shadow-primary/15 transition-all hover:scale-105">Join</Button>
                        </div>
                    </div>
                </div>

                <Separator className="bg-border/50 mb-8" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {currentYear} FitTracker Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                        <Link to="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
