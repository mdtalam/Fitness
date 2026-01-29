import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ArrowRight, Star, Quote, Facebook, Instagram, Twitter, Linkedin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Trainers = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['trainers'],
        queryFn: async () => {
            const response = await api.get('/trainers');
            return response.data.data.trainers;
        },
    });

    return (
        <div className="min-h-screen pt-16 pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center lg:text-left">
                <SectionHeader
                    subtitle="Expert Guidance"
                    title="Meet Our Elite Trainers"
                    description="Learn from the best in the industry. Our certified trainers are here to guide your transformation."
                />

                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-lg text-muted-foreground">Our trainer community is growing. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                        {data?.map((trainer) => (
                            <div key={trainer._id} className="group relative pt-12">
                                {/* Background Decor */}
                                <div className="absolute inset-0 top-0 translate-y-12 bg-card border rounded-3xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:-translate-y-1"></div>

                                {/* Content */}
                                <div className="relative px-8 pt-0 pb-12 flex flex-col items-center text-center">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                        <div className="relative h-24 w-24 rounded-3xl p-1 bg-gradient-to-tr from-primary to-primary/20 shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                                            <Avatar className="h-full w-full rounded-2xl border-2 border-background">
                                                <AvatarImage src={trainer.user?.photoURL} alt={trainer.user?.name} className="object-cover" />
                                                <AvatarFallback className="rounded-2xl bg-muted text-foreground text-2xl font-bold">
                                                    {trainer.user?.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>

                                    <div className="mt-16 w-full flex flex-col items-center">
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("h-3 w-3", i < Math.floor(trainer.rating) ? "text-primary fill-primary" : "text-muted fill-muted")} />
                                            ))}
                                            <span className="text-xs font-bold text-muted-foreground ml-1">({trainer.rating})</span>
                                        </div>

                                        <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors tracking-tight">
                                            {trainer.user?.name}
                                        </h3>

                                        <div className="flex flex-col items-center gap-1 mb-6">
                                            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] opacity-80">
                                                Elite Trainer
                                            </p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                {trainer.experience} Years Experience
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                                            {trainer.skills?.slice(0, 3).map((skill) => (
                                                <Badge key={skill} variant="secondary" className="px-3 py-0.5 rounded-full text-[9px] uppercase font-black bg-primary/5 text-primary border-none">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-center gap-4 mb-8">
                                            <a href={trainer.socialLinks?.facebook || "#"} className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                                                <Facebook className="h-4 w-4" />
                                            </a>
                                            <a href={trainer.socialLinks?.instagram || "#"} className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                                                <Instagram className="h-4 w-4" />
                                            </a>
                                            <a href={trainer.socialLinks?.twitter || "#"} className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                                                <Twitter className="h-4 w-4" />
                                            </a>
                                            <a href={trainer.socialLinks?.linkedin || "#"} className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                                                <Linkedin className="h-4 w-4" />
                                            </a>
                                        </div>

                                        <div className="w-full pt-6 border-t border-dashed flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Users className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Availability</p>
                                                    <p className="text-xs font-bold">{trainer.availableSlotsCount} Slots Left</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase">
                                                Top Rated
                                            </Badge>
                                        </div>

                                        <Button className="w-full h-14 rounded-2xl shadow-lg shadow-primary/10 group/btn transition-all hover:scale-[1.02] uppercase font-black tracking-widest text-xs" asChild>
                                            <Link to={`/trainers/${trainer._id}`}>
                                                Know More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple utility for lucide-react scale color if needed
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default Trainers;
