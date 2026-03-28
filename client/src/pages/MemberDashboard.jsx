import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Trophy, Zap, ArrowRight, ShieldCheck, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
    const { data: bookings, isLoading } = useQuery({
        queryKey: ['my-bookings'],
        queryFn: async () => {
            const response = await api.get('/bookings/my-bookings');
            return response.data.data.bookings;
        }
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    const upcomingSessions = bookings?.filter(b => b.status === 'upcoming') || [];
    const uniqueTrainers = Array.from(new Set(bookings?.map(b => b.trainerId.toString()) || [])).map(id => {
        return bookings.find(b => b.trainerId.toString() === id);
    });

    return (
        <DashboardLayout>
            <SectionHeader
                title="Welcome Back, Champion!"
                subtitle="Member Dashboard"
                description="Monitor your progress and manage your upcoming training sessions."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-8">
                <StatCard
                    icon={<Trophy className="text-amber-500" />}
                    label="Completed"
                    value={bookings?.filter(b => b.status === 'completed').length || 0}
                    color="bg-amber-500/10"
                />
                <StatCard
                    icon={<Calendar className="text-primary" />}
                    label="Upcoming"
                    value={upcomingSessions.length}
                    color="bg-primary/10"
                />
                <StatCard
                    icon={<ShieldCheck className="text-blue-500" />}
                    label="Active Plans"
                    value={uniqueTrainers.length}
                    color="bg-blue-500/10"
                />
            </div>

            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">My Trainers</h3>
                <Link
                    to="/dashboard/bookings"
                    className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                >
                    View All Bookings <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {uniqueTrainers.length > 0 ? (
                    uniqueTrainers.map((booking) => (
                        <Card key={booking._id} className="rounded-[2.5rem] border-none shadow-xl shadow-black/5 p-8 flex flex-col items-center text-center group hover:scale-[1.05] transition-all bg-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap className="h-24 w-24 text-primary" />
                            </div>
                            <Avatar className="h-28 w-28 rounded-3xl mb-6 border-4 border-background shadow-2xl transition-transform group-hover:rotate-3">
                                <AvatarImage src={booking.trainerUser?.photoURL} className="object-cover" />
                                <AvatarFallback className="bg-muted text-2xl font-black">{booking.trainerUser?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h4 className="text-xl font-black italic">{booking.trainerUser?.name}</h4>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-2 px-4 py-1.5 rounded-full bg-muted/50">
                                {booking.slot?.className || 'Fitness Trainer'}
                            </p>
                            <div className="mt-8 pt-6 border-t border-muted w-full">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Next Session</p>
                                <p className="font-bold text-sm flex items-center justify-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-primary" /> {booking.slot?.startTime}
                                </p>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-muted/5 rounded-[2.5rem] border-2 border-dashed border-muted/20">
                        <User className="h-12 w-12 text-muted mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest">No trainers booked yet</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <Card className="rounded-[2.5rem] border-none shadow-xl bg-card transition-all hover:shadow-2xl hover:-translate-y-1">
        <CardContent className="p-10 flex items-center gap-8">
            <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center ${color}`}>
                {React.cloneElement(icon, { className: `h-8 w-8 ${icon.props.className}` })}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
                <p className="text-4xl font-black italic">{value}</p>
            </div>
        </CardContent>
    </Card>
);

export default MemberDashboard;
