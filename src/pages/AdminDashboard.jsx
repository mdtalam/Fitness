import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Users, DollarSign, Activity, Mail, Loader2 } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const AdminDashboard = () => {
    const { data: stats, isLoading, isError, error } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const res = await api.get('/admin/stats');
            return res.data.data.stats;
        },
        retry: 1
    });

    if (isLoading) return <DashboardLayout><div className="flex justify-center p-24"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div></DashboardLayout>;

    if (isError) {
        const isDbError = error.response?.data?.message?.includes('Database Connection Failed');
        return (
            <DashboardLayout>
                <div className="p-12 text-center bg-destructive/10 rounded-[2.5rem] border border-destructive/20 max-w-2xl mx-auto mt-12 text-destructive">
                    <div className="h-16 w-16 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                        {isDbError ? 'Database Disconnected' : 'System Error'}
                    </h2>
                    <p className="text-muted-foreground font-medium mb-6">
                        {error.response?.data?.message || "We couldn't reach the server. Please ensure the backend is running and the database is connected."}
                    </p>

                    {isDbError && (
                        <div className="bg-background/80 p-6 rounded-2xl text-left border border-destructive/20 mb-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-destructive">Dashboard Diagnostics:</p>
                            <ul className="text-xs space-y-2 list-disc pl-4 opacity-90 font-medium text-destructive/80">
                                <li>The server is running but cannot reach your <b>MongoDB</b>.</li>
                                <li>Ensure your current IP is in <b>Atlas Network Access</b>.</li>
                                <li>Check if your ISP blocks <b>Port 27017</b> or <b>SRV records</b>.</li>
                            </ul>
                        </div>
                    )}

                    <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-xs border-destructive/20">
                        Try Again
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <SectionHeader
                title="Platform Overview"
                subtitle="Admin Dashboard"
                description="Manage users, trainers, and monitor the health of your fitness platform."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                <StatCard icon={<DollarSign className="text-emerald-500" />} label="Total Revenue" value={`$${stats?.totalRevenue || 0}`} color="bg-emerald-500/10" />
                <StatCard icon={<Users className="text-primary" />} label="Total Users" value={stats?.totalUsers || 0} color="bg-primary/10" />
                <StatCard icon={<Users className="text-blue-500" />} label="Total Trainers" value={stats?.totalTrainers || 0} color="bg-blue-500/10" />
                <Link to="/admin-dashboard/applications" className="block transition-transform hover:scale-105 active:scale-95">
                    <StatCard icon={<Users className="text-amber-500" />} label="Applied Trainers" value={stats?.totalPendingApplications || 0} color="bg-amber-500/10" />
                </Link>
                <StatCard icon={<Activity className="text-blue-500" />} label="Active Classes" value={stats?.totalClasses || 0} color="bg-blue-500/10" />
            </div>

            <h3 className="text-lg font-bold mb-4">Management Areas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <ManagementCard
                    title="Trainers"
                    description="Manage active fitness trainers."
                    link="/admin-dashboard/trainers"
                    icon={<Users className="h-6 w-6 text-blue-500" />}
                />
                <ManagementCard
                    title="Applied Trainers"
                    description="Review and approve trainer applications."
                    link="/admin-dashboard/applications"
                    icon={<Users className="h-6 w-6 text-amber-500" />}
                />
                <ManagementCard
                    title="Classes"
                    description="Manage fitness classes library."
                    link="/admin-dashboard/classes"
                    icon={<Activity className="h-6 w-6 text-primary" />}
                />
                <ManagementCard
                    title="Newsletter"
                    description="Manage subscribers and emails."
                    link="/admin-dashboard/newsletter"
                    icon={<Mail className="h-6 w-6 text-emerald-500" />}
                />
            </div>

            <div className="p-12 text-center rounded-3xl border-2 border-dashed bg-muted/20 opacity-60">
                <p className="font-black uppercase tracking-widest text-sm">More features coming soon</p>
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <Card className="rounded-3xl border-none shadow-xl bg-card overflow-hidden">
        <CardContent className="p-6 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div className="overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{label}</p>
                <p className="text-xl font-black truncate">{value}</p>
            </div>
        </CardContent>
    </Card>
);

import { Link } from 'react-router-dom';

const ManagementCard = ({ title, description, link, icon }) => (
    <Link to={link} className="block group">
        <Card className="h-full rounded-2xl border transition-all hover:shadow-lg hover:border-primary/50 relative overflow-hidden">
            <CardContent className="p-6 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </CardContent>
        </Card>
    </Link>
);

export default AdminDashboard;
