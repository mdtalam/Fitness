import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, DollarSign, ArrowUpRight, Calendar, CreditCard, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import CountUp from '@/components/ui/CountUp';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminBalance = () => {
    const { data: statsData, isLoading, isError, error } = useQuery({
        queryKey: ['adminBalance'],
        queryFn: async () => {
            const res = await api.get('/payments/admin-stats');
            return res.data.data;
        },
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (isError) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-red-500">
                    <p>Error loading stats: {error.message}</p>
                </div>
            </DashboardLayout>
        );
    }

    const { totalBalance, lastTransactions, chartData, newsletterSubscribersCount, paidMembersCount } = statsData;

    const COLORS = ['#10b981', '#3b82f6']; // Emerald (Newsletter), Blue (Paid Members)

    return (
        <DashboardLayout>
            <SectionHeader
                title="Financial Overview"
                subtitle="Admin Balance"
                description="Monitor your platform's financial health and recent booking transactions."
            />

            {/* Top Row: Balance & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Total Balance Card */}
                <Card className="lg:col-span-1 rounded-[2rem] border-none shadow-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" /> Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black text-foreground mb-2 tracking-tight">
                            $<CountUp to={totalBalance} decimals={2} duration={2} />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Live</span> updated from booking payments
                        </p>
                    </CardContent>
                </Card>

                {/* Subscribers vs Paid Members Chart */}
                <Card className="lg:col-span-2 rounded-[2rem] border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            Audience Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions Table */}
            <Card className="rounded-[2rem] border shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-6 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                Recent Transactions
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">Last 6 booking payments</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-bold uppercase text-xs tracking-wider pl-6">Member</TableHead>
                                <TableHead className="font-bold uppercase text-xs tracking-wider">Date</TableHead>
                                <TableHead className="font-bold uppercase text-xs tracking-wider">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lastTransactions.map((tx) => (
                                <TableRow key={tx._id} className="hover:bg-muted/20">
                                    <TableCell className="font-medium pl-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">{tx.memberName}</span>
                                            <span className="text-xs text-muted-foreground">{tx.memberEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground/60 font-mono">
                                            {new Date(tx.createdAt).toLocaleTimeString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-base">
                                        ${tx.amount.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {lastTransactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground font-medium italic">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default AdminBalance;
