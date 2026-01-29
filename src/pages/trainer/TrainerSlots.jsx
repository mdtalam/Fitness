import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Loader2, Plus, Calendar, Clock, Trash2, Dumbbell } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const TrainerSlots = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newSlot, setNewSlot] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '10:00',
        classId: '',
        className: ''
    });

    const { data: classes } = useQuery({
        queryKey: ['classes'],
        queryFn: async () => {
            const res = await api.get('/classes');
            return res.data.data.classes;
        }
    });

    const handleCreateSlot = useMutation({
        mutationFn: async (slotData) => {
            return api.post('/slots', slotData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['trainerSlots']);
            setIsAdding(false);
            toast.success('Slot created successfully!');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Creation failed')
    });

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-8">
                <SectionHeader
                    title="Time Slots"
                    subtitle="Trainer Dashboard"
                    description="Plan your week and manage your training availability."
                    className="mb-0"
                />
                <Button onClick={() => setIsAdding(!isAdding)} className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                    {isAdding ? 'Cancel' : <><Plus className="mr-2 h-5 w-5" /> Add New Slot</>}
                </Button>
            </div>

            {isAdding && (
                <Card className="rounded-3xl border-none shadow-2xl bg-primary text-primary-foreground mb-12 animate-in slide-in-from-top duration-500 overflow-hidden relative">
                    <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <CardHeader className="p-8">
                        <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                            <Clock className="h-6 w-6" /> Schedule New Session
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 font-medium">Session Date</label>
                            <Input type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })} className="h-12 bg-white/10 border-none text-white focus:ring-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 font-medium">Start Time</label>
                            <Input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} className="h-12 bg-white/10 border-none text-white focus:ring-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 font-medium">Class Category</label>
                            <Select onValueChange={(val) => {
                                const selected = classes?.find(c => c._id === val);
                                setNewSlot({ ...newSlot, classId: val, className: selected?.name });
                            }}>
                                <SelectTrigger className="h-12 bg-white/10 border-none text-white focus:ring-white">
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes?.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full h-12 bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest shadow-xl" onClick={() => handleCreateSlot.mutate({
                                ...newSlot,
                                trainerId: 'TEMP_ID', // Real implementation needed from user session
                                duration: 60,
                                trainerId: queryClient.getQueryData(['userAuth'])?.id // Hypothetical
                            })}>
                                Publish Slot
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="p-12 text-center rounded-3xl border-2 border-dashed bg-muted/20 opacity-60">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-black uppercase tracking-widest text-sm">Your active schedule will appear here</p>
                <p className="text-xs font-bold text-muted-foreground mt-2">Create your first slot to start getting bookings.</p>
            </div>
        </DashboardLayout>
    );
};

export default TrainerSlots;
