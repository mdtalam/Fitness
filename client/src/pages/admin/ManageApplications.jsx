import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Loader2, Check, X, Eye, Clock, User, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManageApplications = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: applications, isLoading, isError, error } = useQuery({
        queryKey: ['adminApplications'],
        queryFn: async () => {
            const response = await api.get('/trainers/applications');
            return response.data.data.applications;
        },
        retry: 1
    });

    if (isLoading) return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        </DashboardLayout>
    );

    if (isError) {
        const isDbError = error.response?.data?.message?.includes('Database Connection Failed');
        return (
            <DashboardLayout>
                <div className="p-12 text-center bg-destructive/10 rounded-[2.5rem] border border-destructive/20 max-w-2xl mx-auto mt-12 text-destructive">
                    <X className="h-12 w-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                        {isDbError ? 'Database Disconnected' : 'Failed to Load Applications'}
                    </h2>
                    <p className="font-medium mb-6 opacity-80">
                        {error.response?.data?.message || "Ensure your database (MongoDB) is connected and accessible."}
                    </p>

                    {isDbError && (
                        <div className="bg-background/80 p-6 rounded-2xl text-left border border-destructive/20 mb-6 space-y-3">
                            <p className="text-xs font-black uppercase tracking-widest opacity-60">Troubleshooting Guide:</p>
                            <ul className="text-sm space-y-2 list-disc pl-4 opacity-90 font-medium">
                                <li>Check if your <b>IP Address</b> is whitelisted in <b>MongoDB Atlas</b> (Network Access).</li>
                                <li>Verify that your MongoDB cluster is <b>Active</b> and not paused.</li>
                                <li>Ensure your network isn't blocking <b>SRV records</b> (try a different Wi-Fi/Hotspot).</li>
                            </ul>
                        </div>
                    )}

                    <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-xs border-destructive/20 hover:bg-destructive/10">
                        Retry Connection
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const pendingApplications = applications?.filter(app => app.status === 'pending') || [];

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SectionHeader
                    title="Applied Trainers"
                    subtitle="Pending Review"
                    description="Carefully review each fitness expert's application. Approve to grant trainer status or Reject with feedback."
                />

                <div className="bg-card rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-primary/5">
                            <TableRow className="hover:bg-transparent border-primary/10">
                                <TableHead className="py-6 px-8 text-xs font-black uppercase tracking-widest">Applicant</TableHead>
                                <TableHead className="py-6 text-xs font-black uppercase tracking-widest">Expertise</TableHead>
                                <TableHead className="py-6 text-xs font-black uppercase tracking-widest">Experience</TableHead>
                                <TableHead className="py-6 text-xs font-black uppercase tracking-widest text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingApplications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-48 text-muted-foreground font-black italic uppercase tracking-widest opacity-40">
                                        No pending applications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingApplications.map((app) => (
                                    <TableRow key={app._id} className="hover:bg-muted/30 transition-colors border-primary/5 group">
                                        <TableCell className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 rounded-2xl border-2 border-background shadow-lg transition-transform group-hover:scale-110">
                                                    <AvatarImage src={app.profileImage} alt={app.fullName} className="object-cover" />
                                                    <AvatarFallback className="bg-primary text-white text-xs font-black">
                                                        {app.fullName?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-black text-sm uppercase tracking-tight">{app.fullName}</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold italic">
                                                        <Mail className="h-3 w-3" />
                                                        {app.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex flex-wrap gap-1.5">
                                                {app.skills?.slice(0, 2).map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary" className="px-2 py-0 rounded-md text-[9px] uppercase font-black bg-primary/5 text-primary border-none">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                                {app.skills?.length > 2 && (
                                                    <span className="text-[10px] font-black text-muted-foreground opacity-60">+{app.skills.length - 2}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/5 text-emerald-600 border border-emerald-500/10">
                                                    <Clock className="h-3 w-3" />
                                                    <span className="text-xs font-black">{app.experience}y</span>
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-muted-foreground opacity-60 italic">Experience</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6 text-right pr-8">
                                            <Button
                                                onClick={() => navigate(`/admin-dashboard/applications/${app._id}`)}
                                                variant="outline"
                                                className="h-10 rounded-xl px-4 font-black uppercase tracking-widest text-[10px] shadow-sm hover:bg-primary hover:text-white transition-all border-primary/20"
                                            >
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default ManageApplications;
