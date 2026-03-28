import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CountUp from '@/components/ui/CountUp';
import { Loader2, ArrowLeft, Star, Clock, Calendar, CheckCircle2, Award, Zap, Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

const TrainerDetail = () => {
    const { id } = useParams();

    const { data: trainer, isLoading: isTrainerLoading } = useQuery({
        queryKey: ['trainer', id],
        queryFn: async () => {
            const response = await api.get(`/trainers/${id}`);
            return response.data.data.trainer;
        },
    });

    const { data: slots, isLoading: isSlotsLoading } = useQuery({
        queryKey: ['slots', id],
        queryFn: async () => {
            const response = await api.get(`/slots/trainer/${id}`);
            return response.data.data.slots;
        },
        enabled: !!id,
    });

    if (isTrainerLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!trainer) {
        return (
            <div className="container py-24 text-center">
                <h2 className="text-2xl font-bold">Trainer not found</h2>
                <Button asChild className="mt-4">
                    <Link to="/trainers">Back to Trainers</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24">
            {/* Hero Header */}
            <div className="relative h-[35vh] overflow-hidden">
                <div className="absolute inset-0 bg-primary/10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-background"></div>

                {/* Abstract Shapes */}
                <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-10 left-[5%] w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-30"></div>

                <div className="container relative h-full flex items-end pb-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-8 invisible lg:visible">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-background/20 font-bold">
                            <Link to="/trainers"> <ArrowLeft className="h-4 w-4 mr-2" /> Back to Team </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container relative -mt-32 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Trainer Information Section */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                        <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-card/80 backdrop-blur-xl ring-1 ring-white/10">
                            <div className="h-24 bg-gradient-to-tr from-primary to-primary/40"></div>
                            <div className="px-8 pb-10">
                                <div className="relative -mt-16 flex justify-center">
                                    <div className="p-1 rounded-[2rem] bg-background shadow-2xl ring-4 ring-primary/5">
                                        <Avatar className="h-40 w-40 rounded-[1.8rem] border-4 border-background">
                                            <AvatarImage src={trainer.user?.photoURL} className="object-cover" />
                                            <AvatarFallback className="text-5xl font-black bg-muted text-primary">
                                                {trainer.user?.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                <div className="mt-8 text-center px-2">
                                    <h1 className="text-3xl font-black tracking-tight leading-tight">{trainer.user?.name}</h1>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <div className="h-1 w-1 rounded-full bg-primary/40"></div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-80">Certified Expert Trainer</p>
                                        <div className="h-1 w-1 rounded-full bg-primary/40"></div>
                                    </div>

                                    <div className="flex items-center justify-center gap-1.5 mt-5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(trainer.rating) ? 'text-primary fill-primary' : 'text-muted fill-muted'}`} />
                                        ))}
                                        <span className="text-xs font-black ml-1.5 text-foreground/80">
                                            <CountUp to={trainer.rating} decimals={1} suffix=" / 5.0" duration={1.5} />
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-center gap-3 mt-8">
                                        <a href="#" className="h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                            <Facebook className="h-5 w-5" />
                                        </a>
                                        <a href="#" className="h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                            <Instagram className="h-5 w-5" />
                                        </a>
                                        <a href="#" className="h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                            <Twitter className="h-5 w-5" />
                                        </a>
                                        <a href="#" className="h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                                            <Mail className="h-5 w-5" />
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-10 grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 text-center">
                                        <Award className="h-5 w-5 text-primary mx-auto mb-2" />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Experience</p>
                                        <p className="text-xl font-black">
                                            <CountUp to={trainer.experience} suffix="+" duration={2} /> Yrs
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 text-center">
                                        <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Status</p>
                                        <p className="text-xl font-black uppercase text-primary text-sm mt-1">Active</p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 text-center">Specializations</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {trainer.skills?.map(skill => (
                                            <Badge key={skill} variant="secondary" className="px-3 py-1 rounded-xl text-[10px] uppercase font-black bg-primary/5 text-primary border-none">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Detailed Bio & Available Slots Section */}
                    <div className="lg:col-span-8 flex flex-col gap-12 pt-8 lg:pt-0">
                        {/* Section 1: About */}
                        <section className="p-10 rounded-[2.5rem] bg-card border shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
                            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                                <span className="text-primary/20 font-black italic">01.</span>
                                Profile Summary
                            </h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                                    {trainer.bio}
                                </p>
                            </div>

                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 rounded-3xl bg-muted/20 border border-muted-foreground/5">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-primary">Expertise & Focus</h4>
                                    <ul className="space-y-3">
                                        {trainer.skills?.map(skill => (
                                            <li key={skill} className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                                {skill} Program Design
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-primary">Qualifications</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            Certified Personal Trainer (CPT)
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            Advanced Fitness Specialist
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Available Slots Section */}
                        <section className="p-10 rounded-[2.5rem] bg-card border shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20"></div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                                <h2 className="text-3xl font-black flex items-center gap-4">
                                    <span className="text-primary/20 font-black italic">02.</span>
                                    Available Schedule
                                </h2>
                                <Badge className="w-fit h-8 px-4 bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest flex items-center">
                                    <Zap className="h-3 w-3 mr-2 animate-pulse" />
                                    Book Live Sessions
                                </Badge>
                            </div>

                            {isSlotsLoading ? (
                                <div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary/50" /></div>
                            ) : slots?.length === 0 ? (
                                <div className="py-20 px-8 text-center rounded-[2rem] border border-dashed border-muted-foreground/20 bg-muted/5">
                                    <Calendar className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                    <p className="text-lg font-bold text-muted-foreground">No available slots for booking currently.</p>
                                    <p className="text-sm text-muted-foreground/60 mt-1 uppercase tracking-widest font-black">Check back later for updates</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {slots.map((slot) => (
                                        <Card key={slot._id} className="group border-none bg-muted/30 hover:bg-primary transition-all duration-500 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-primary/30 relative overflow-hidden">
                                            <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>

                                            <div className="relative z-10 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Badge className="bg-primary/10 text-primary group-hover:bg-white/20 group-hover:text-white border-none text-[10px] font-black uppercase px-3 py-1">
                                                        {slot.slotName || 'Fitness Session'}
                                                    </Badge>
                                                    <div className="text-[10px] font-black text-muted-foreground group-hover:text-white/60 uppercase tracking-widest">
                                                        Available
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-2xl font-black group-hover:text-white transition-colors">{slot.startTime}</h3>
                                                    <p className="text-[10px] font-bold text-primary group-hover:text-white/80 uppercase tracking-widest mt-1">
                                                        Duration: {slot.slotTime}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-4 text-muted-foreground group-hover:text-white/80 font-bold text-xs uppercase tracking-tighter">
                                                        <Calendar className="h-3 w-3" />
                                                        {slot.selectedDays?.join(', ')}
                                                    </div>
                                                </div>

                                                <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 group-hover:shadow-xl shadow-sm rounded-xl font-black uppercase tracking-widest text-[10px] h-12" asChild>
                                                    <Link to={`/booking/${trainer._id}/${slot._id}`}>Book Session</Link>
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="p-10 rounded-[2.5rem] bg-primary relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                <div className="h-20 w-20 shrink-0 rounded-[1.5rem] bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <CheckCircle2 className="h-10 w-10 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black text-white">Commit to Your Growth.</h4>
                                    <p className="text-white/80 font-bold text-lg mt-1 leading-relaxed">Choose a strategic time slot above and take the first step towards your transformation with {trainer.user?.name.split(' ')[0]}.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerDetail;
