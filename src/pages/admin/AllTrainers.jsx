import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2, Star, Mail, Award, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const AllTrainers = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: trainers, isLoading, isError, error } = useQuery({
        queryKey: ['adminTrainers'],
        queryFn: async () => {
            const res = await api.get('/trainers');
            return res.data.data.trainers;
        },
        retry: 1
    });

    const removeTrainerMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/trainers/${id}`);
        },
        onSuccess: () => {
            toast.success('Trainer removed successfully and reverted to member');
            queryClient.invalidateQueries(['adminTrainers']);
            queryClient.invalidateQueries(['trainers']); // Also invalidate public list
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to remove trainer');
        }
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (isError) {
        return (
            <DashboardLayout>
                <div className="p-12 text-center bg-destructive/10 rounded-[2.5rem] border border-destructive/20 max-w-2xl mx-auto mt-12">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-destructive">Failed to Load Trainers</h2>
                    <p className="text-muted-foreground font-medium mb-6">
                        {error.response?.data?.message || "Ensure your database is connected and trials are active."}
                    </p>
                    <Button onClick={() => navigate('/admin-dashboard')} variant="outline" className="rounded-xl">
                        Back to Dashboard
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SectionHeader
                    title="Active Trainers"
                    subtitle="Elite Team"
                    description="Manage current trainers. Removing a trainer reverts their role to Member."
                />

                <div className="bg-card rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-primary/5">
                            <TableRow className="hover:bg-transparent border-primary/10">
                                <TableHead className="py-6 px-8 text-xs font-black uppercase tracking-widest">Trainer</TableHead>
                                <TableHead className="py-6 text-xs font-black uppercase tracking-widest">Expertise</TableHead>
                                <TableHead className="py-6 text-xs font-black uppercase tracking-widest">Performance</TableHead>
                                <TableHead className="py-6 text-xs font-black uppercase tracking-widest text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trainers?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-48 text-muted-foreground font-medium">
                                        No active trainers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                trainers?.map((trainer) => (
                                    <TableRow key={trainer._id} className="hover:bg-muted/30 transition-colors border-primary/5 group">
                                        <TableCell className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 rounded-2xl border-2 border-background shadow-lg transition-transform group-hover:scale-110">
                                                    <AvatarImage src={trainer.user?.photoURL} alt={trainer.user?.name} className="object-cover" />
                                                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                                                        {trainer.user?.name?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-black text-sm uppercase tracking-tight">{trainer.user?.name}</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                                                        <Mail className="h-3 w-3" />
                                                        {trainer.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex flex-wrap gap-1.5">
                                                {trainer.skills?.slice(0, 3).map((skill, idx) => (
                                                    <Badge key={idx} variant="secondary" className="px-2 py-0 rounded-md text-[9px] uppercase font-black bg-primary/5 text-primary border-none">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                                {trainer.skills?.length > 3 && (
                                                    <span className="text-[10px] font-black text-muted-foreground opacity-60">+{trainer.skills.length - 3}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/5 text-amber-600 border border-amber-500/10">
                                                    <Star className="h-3 w-3 fill-amber-500" />
                                                    <span className="text-xs font-black">{trainer.rating || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-muted-foreground opacity-60">
                                                    <Award className="h-3 w-3" />
                                                    {trainer.experience}y exp
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6 text-right pr-8">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8 max-w-md">
                                                    <AlertDialogHeader>
                                                        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                                                            <Trash2 className="h-8 w-8 text-destructive" />
                                                        </div>
                                                        <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight">Revoke Role?</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-base text-muted-foreground pt-2">
                                                            This will remove <span className="font-bold text-foreground">"{trainer.user?.name}"</span> from the trainer pool. Their role will be reverted to <span className="font-bold text-primary">Member</span> immediately.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="pt-8 gap-4">
                                                        <AlertDialogCancel className="h-12 rounded-xl border-none bg-muted hover:bg-muted/80 font-bold uppercase tracking-widest text-xs">Stay Trainer</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => removeTrainerMutation.mutate(trainer._id)}
                                                            className="h-12 rounded-xl bg-destructive hover:bg-destructive/90 font-black uppercase tracking-widest text-xs shadow-lg shadow-destructive/20"
                                                        >
                                                            Confirm Removal
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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

export default AllTrainers;
