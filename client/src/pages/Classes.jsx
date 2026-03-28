import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import SectionHeader from '@/components/SectionHeader';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, Users, ArrowRight, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Classes = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('all');

    const { data, isLoading } = useQuery({
        queryKey: ['classes', search, difficulty],
        queryFn: async () => {
            const response = await api.get('/classes');
            let classes = response.data.data.classes;

            // Client-side filtering for simplicity, though backend filtering is better for scale
            if (search) {
                classes = classes.filter(c =>
                    c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.description.toLowerCase().includes(search.toLowerCase())
                );
            }
            if (difficulty !== 'all') {
                classes = classes.filter(c => c.difficulty === difficulty);
            }

            return classes;
        },
    });

    return (
        <div className="min-h-screen pt-16 pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <SectionHeader
                    subtitle="Workout Library"
                    title="Find Your Perfect Class"
                    description="Browse our diverse range of classes designed for every fitness level and goal."
                />

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-12 p-6 rounded-2xl border bg-card/50 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search classes..."
                            className="pl-10 h-12 bg-background border-none ring-1 ring-border focus-visible:ring-primary"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground shrink-0 hidden sm:flex">
                            <Filter className="h-4 w-4" />
                            Filter by:
                        </div>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger className="w-full md:w-[180px] h-12 bg-background border-none ring-1 ring-border focus:ring-primary">
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All levels</SelectItem>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-lg text-muted-foreground">No classes found matching your criteria.</p>
                        <Button variant="link" onClick={() => { setSearch(''); setDifficulty('all'); }} className="mt-2 text-primary">
                            Clear all filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data?.map((item) => (
                            <Card key={item._id} className="group overflow-hidden border bg-card transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 rounded-2xl">
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={item.imageURL || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <CardHeader className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="secondary" className="bg-primary/5 text-primary">
                                            {item.difficulty}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                            <Users className="h-3 w-3" />
                                            {item.bookingCount} joined
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                        {item.name}
                                    </CardTitle>
                                    <CardDescription className="text-sm line-clamp-2 mt-2">
                                        {item.description}
                                    </CardDescription>
                                    {item.trainers && item.trainers.length > 0 && (
                                        <div
                                            className="group/trainer relative flex items-center gap-2 mt-4 pt-4 border-t cursor-pointer"
                                            onClick={() => navigate(`/trainers/${item.trainers[0]._id}`)}
                                        >
                                            <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-primary/20 group-hover/trainer:ring-primary transition-all">
                                                <AvatarImage src={item.trainers[0].photoURL} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                    {item.trainers[0].name?.charAt(0) || 'T'}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Hover Info Card */}
                                            <div className="absolute bottom-full left-0 mb-3 w-64 p-4 rounded-2xl bg-card border shadow-2xl opacity-0 invisible group-hover/trainer:opacity-100 group-hover/trainer:visible transition-all duration-300 z-50 scale-95 group-hover/trainer:scale-100 origin-bottom-left">
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
                                </CardHeader>
                                <CardFooter className="p-6 pt-0">
                                    <Button className="w-full group/btn transition-all hover:bg-primary shadow-lg shadow-primary/5" asChild>
                                        <Link to={`/classes/${item._id}`}>
                                            Book Your Spot <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Classes;
