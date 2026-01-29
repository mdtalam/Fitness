import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Mail, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const AdminNewsletter = () => {
    const { data: subscribers, isLoading, error } = useQuery({
        queryKey: ['newsletterSubscribers'],
        queryFn: async () => {
            const res = await api.get('/newsletter');
            return res.data.data.subscribers;
        }
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center text-red-500 font-bold">
                    Error loading subscribers: {error.response?.data?.message || error.message}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <SectionHeader
                title="Newsletter Subscribers"
                subtitle="Community"
                description="Manage and view all users subscribed to your newsletter."
            />

            <Card className="border-none shadow-xl bg-card rounded-3xl overflow-hidden">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Subscriber List
                    </CardTitle>
                    <CardDescription>
                        Total Subscribers: {subscribers?.length || 0}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-muted">
                                <TableHead className="w-[100px] pl-6">#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right pr-6">Subscribed Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscribers?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No subscribers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subscribers?.map((sub, index) => (
                                    <TableRow key={sub._id} className="hover:bg-muted/20 border-b border-muted last:border-0 group">
                                        <TableCell className="font-medium pl-6 text-muted-foreground">{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                    {sub.name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="font-bold text-sm">{sub.name || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-sm text-foreground/80">{sub.email}</TableCell>
                                        <TableCell className="text-right pr-6 text-sm text-muted-foreground font-medium">
                                            {sub.subscribedAt ? format(new Date(sub.subscribedAt), 'PPP') : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default AdminNewsletter;
