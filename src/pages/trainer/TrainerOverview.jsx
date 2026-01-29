import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Calendar, Award, Zap, ArrowUpRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const TrainerOverview = () => {
    const { data: stats, isLoading: isStatsLoading } = useQuery({
        queryKey: ['trainerStats'],
        queryFn: async () => {
            const res = await api.get('/trainers/dashboard/stats');
            return res.data.data.stats;
        }
    });

    const { data: bookingsData, isLoading: isBookingsLoading } = useQuery({
        queryKey: ['trainerBookings'],
        queryFn: async () => {
            const res = await api.get('/trainers/dashboard/bookings');
            return res.data.data.bookings;
        }
    });

    return (
        <DashboardLayout>
            <SectionHeader
                title="Trainer Command Center"
                subtitle="Overview"
                description="Manage your schedule, track your students' progress, and grow your fitness community."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-8">
                <StatCard icon={<Users className="text-blue-500" />} label="Total Students" value={isStatsLoading ? '...' : stats?.totalStudents || 0} color="bg-blue-500/10" />
                <StatCard icon={<Calendar className="text-primary" />} label="Total Slots" value={isStatsLoading ? '...' : stats?.totalSlots || 0} color="bg-primary/10" />
                <StatCard icon={<Award className="text-amber-500" />} label="Booked Slots" value={isStatsLoading ? '...' : stats?.bookedSlots || 0} color="bg-amber-500/10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <h3 className="text-xl font-black italic flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" /> Recent Bookings
                    </h3>
                    <div className="space-y-4">
                        {isBookingsLoading ? (
                            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                        ) : bookingsData?.length > 0 ? (
                            bookingsData.map((booking) => (
                                <div key={booking._id} className="p-6 rounded-3xl border bg-card flex items-center justify-between group hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                            {booking.member?.name?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <p className="font-bold">{booking.member?.name}</p>
                                            <p className="text-xs text-muted-foreground font-black uppercase tracking-widest leading-none mt-1">
                                                {booking.slot?.className} • {booking.slot?.startTime}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-muted">
                                            {booking.packageType}
                                        </span>
                                        <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-primary/10 group-hover:text-primary">
                                            <ArrowUpRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-muted/5 rounded-3xl border-2 border-dashed border-muted/20">
                                <p className="text-sm font-bold opacity-40 uppercase tracking-widest">No recent bookings</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <Card className="rounded-3xl border-none shadow-2xl bg-primary text-primary-foreground p-8 overflow-hidden relative">
                        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                        <h4 className="text-xl font-black mb-4">Grow Your Influence</h4>
                        <p className="text-sm font-medium opacity-80 leading-relaxed mb-8">
                            Create more slots or share your profile to attract new students to your classes.
                        </p>
                        <Button className="w-full bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest rounded-xl h-12">Share Profile</Button>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <Card className="rounded-3xl border-none shadow-xl bg-card">
        <CardContent className="p-8 flex items-center gap-6">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground leading-none mb-2">{label}</p>
                <p className="text-2xl font-black">{value}</p>
            </div>
        </CardContent>
    </Card>
);

export default TrainerOverview;
