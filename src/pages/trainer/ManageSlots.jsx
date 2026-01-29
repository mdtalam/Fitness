import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Loader2,
    Trash2,
    Edit,
    User,
    Mail,
    Clock,
    Calendar,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
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

const ManageSlots = () => {
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState(null);

    const { data: slots, isLoading } = useQuery({
        queryKey: ['manageSlots'],
        queryFn: async () => {
            const res = await api.get('/slots/manage');
            return res.data.data.slots;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return api.delete(`/slots/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['manageSlots']);
            toast.success('Slot deleted successfully');
            setDeletingId(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete slot');
            setDeletingId(null);
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

    return (
        <DashboardLayout>
            <SectionHeader
                title="Manage Slots"
                subtitle="Trainer Dashboard"
                description="View and manage your training availability and student bookings."
            />

            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden bg-card">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-muted/20">
                                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slot Info</TableHead>
                                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Schedule</TableHead>
                                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Booking Status</TableHead>
                                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Student</TableHead>
                                <TableHead className="py-6 px-8 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {slots?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-60 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-40">
                                            <Calendar className="h-12 w-12 mb-2" />
                                            <p className="font-black uppercase tracking-widest text-sm">No slots found</p>
                                            <p className="text-xs font-bold text-muted-foreground">Start by adding a new slot to your schedule.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                slots?.map((slot) => (
                                    <TableRow key={slot._id} className="group hover:bg-muted/10 transition-colors border-muted/20">
                                        <TableCell className="py-6 px-8">
                                            <div>
                                                <p className="font-black text-foreground items-center gap-2 flex">
                                                    {slot.slotName || 'Regular Session'}
                                                </p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                                                    {slot.className || 'General Training'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6 px-8">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                                    {slot.startTime} - {slot.slotTime || '1 Hour'}
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {slot.selectedDays?.map(day => (
                                                        <Badge key={day} variant="outline" className="text-[9px] font-black uppercase tracking-tighter px-2 py-0 h-4 border-primary/20 text-primary/70">
                                                            {day.substring(0, 3)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6 px-8">
                                            {slot.status === 'booked' ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-none px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest flex w-fit gap-1 items-center">
                                                    <CheckCircle2 className="h-3 w-3" /> Booked
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-primary/10 text-primary border-none px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest flex w-fit gap-1 items-center">
                                                    <AlertCircle className="h-3 w-3" /> Available
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-6 px-8">
                                            {slot.student ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {slot.student.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground lowercase tracking-tight">
                                                        <Mail className="h-3 w-3" />
                                                        {slot.student.email}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">No Student</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-6 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    disabled={slot.status === 'booked'}
                                                    className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                                >
                                                    <Link to={`/trainer-dashboard/edit-slot/${slot._id}`}>
                                                        <Edit className="h-5 w-5" />
                                                    </Link>
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={slot.status === 'booked'}
                                                            className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 transition-all"
                                                            onClick={() => setDeletingId(slot._id)}
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-[2rem] p-8 border-none shadow-2xl">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-2xl font-black italic">Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-muted-foreground font-medium">
                                                                This action cannot be undone. This will permanently delete your session slot for {slot.slotName || 'this session'} at {slot.startTime}.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="mt-6">
                                                            <AlertDialogCancel className="h-12 rounded-2xl font-black uppercase tracking-widest border-muted-foreground/20 hover:bg-muted/10 transition-colors">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="h-12 rounded-2xl font-black uppercase tracking-widest bg-destructive hover:bg-destructive/90 shadow-xl shadow-destructive/20"
                                                                onClick={() => deleteMutation.mutate(slot._id)}
                                                            >
                                                                Confirm Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
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

export default ManageSlots;
