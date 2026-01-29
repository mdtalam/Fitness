import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const FeaturedClasses = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery({
        queryKey: ['featuredClasses'],
        queryFn: async () => {
            const response = await api.get('/classes');
            return response.data.data.classes.slice(0, 6);
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <section className="py-24 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    centered
                    subtitle="Our Top Classes"
                    title="Elevate Your Training"
                    description="Discover our most popular fitness classes designed to help you reach your goals faster."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data?.map((item) => (
                        <div key={item._id} className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                            <div className="aspect-[16/10] overflow-hidden">
                                <img
                                    src={item.imageURL || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'}
                                    alt={item.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge variant="secondary" className="bg-primary/5 text-primary">
                                        {item.difficulty}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                        <Users className="h-3 w-3" />
                                        {item.bookingCount} joined
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                                    {item.description}
                                </p>
                                {item.trainers && item.trainers.length > 0 && (
                                    <div
                                        className="group/trainer relative flex items-center gap-2 mb-6 pt-4 border-t cursor-pointer"
                                        onClick={() => navigate(`/trainers/${item.trainers[0]._id}`)}
                                    >
                                        <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-primary/20 group-hover/trainer:ring-primary transition-all">
                                            <AvatarImage src={item.trainers[0].photoURL} />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                {item.trainers[0].name?.charAt(0) || 'T'}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Hover Info Card */}
                                        <div className="absolute bottom-full left-0 mb-3 w-64 p-4 rounded-2xl bg-card border shadow-2xl opacity-0 invisible group-hover/trainer:opacity-100 group-hover/trainer:visible transition-all duration-300 z-50 scale-95 group-hover/trainer:scale-100 origin-bottom-left text-left">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border shadow-sm">
                                                    <img src={item.trainers[0].photoURL} className="h-full w-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black truncate">{item.trainers[0].name}</p>
                                                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full inline-block">
                                                        {item.trainers[0].experience || 0} Years Exp.
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
                                                {item.trainers[0].bio || "Certified trainer dedicated to helping you reach your peak performance."}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {item.trainers[0].skills?.slice(0, 3).map(skill => (
                                                    <Badge key={skill} variant="secondary" className="px-2 py-0.5 text-[9px] uppercase font-black bg-primary/5 text-primary border-none">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <Button variant="outline" className="w-full group/btn transition-all hover:bg-primary hover:text-primary-foreground" asChild>
                                    <Link to={`/classes/${item._id}`}>
                                        Join Class
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button variant="ghost" className="gap-2 text-primary font-bold hover:bg-primary/5" asChild>
                        <Link to="/classes">
                            View All Classes <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedClasses;
