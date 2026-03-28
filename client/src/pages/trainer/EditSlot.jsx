import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select as UiSelect,
    SelectContent as UiSelectContent,
    SelectItem as UiSelectItem,
    SelectTrigger as UiSelectTrigger,
    SelectValue as UiSelectValue
} from '@/components/ui/select';
import Select from 'react-select';
import {
    Loader2,
    Info,
    Clock,
    Briefcase,
    Mail,
    UserCircle,
    Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const EditSlot = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        slotName: '',
        slotTime: '1 Hour',
        startTime: '09:00',
        selectedDays: [],
        classId: '',
        className: '',
        otherInfo: ''
    });

    // 1. Fetch Slot Details
    const { data: slot, isLoading: isSlotLoading } = useQuery({
        queryKey: ['slot', id],
        queryFn: async () => {
            const res = await api.get(`/slots/${id}`);
            return res.data.data.slot;
        }
    });

    useEffect(() => {
        if (slot) {
            setFormData({
                slotName: slot.slotName || '',
                slotTime: slot.slotTime || '1 Hour',
                startTime: slot.startTime || '09:00',
                selectedDays: slot.selectedDays?.map(day => ({ value: day, label: day })) || [],
                classId: slot.classId?.toString() || '',
                className: slot.className || '',
                otherInfo: slot.otherInfo || ''
            });
        }
    }, [slot]);

    // 2. Fetch Trainer Application for Read-only data and days
    const { data: appData, isLoading: isAppLoading } = useQuery({
        queryKey: ['trainerApplication'],
        queryFn: async () => {
            const res = await api.get('/trainers/my-application');
            return res.data.data.application;
        }
    });

    // 3. Fetch All Classes for selection
    const { data: classes, isLoading: isClassesLoading } = useQuery({
        queryKey: ['classes'],
        queryFn: async () => {
            const res = await api.get('/classes');
            return res.data.data.classes;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (slotData) => {
            return api.patch(`/slots/${id}`, slotData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['manageSlots']);
            queryClient.invalidateQueries(['slot', id]);
            toast.success('Slot updated successfully!');
            navigate('/trainer-dashboard/slots');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update slot');
        }
    });

    const dayOptions = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
        { value: 'Sunday', label: 'Sunday' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.slotName || !formData.startTime || !formData.classId || formData.selectedDays.length === 0) {
            toast.error('Please fill in all required fields');
            return;
        }

        const submissionData = {
            ...formData,
            selectedDays: formData.selectedDays.map(d => d.value)
        };

        updateMutation.mutate(submissionData);
    };

    if (isSlotLoading || isAppLoading || isClassesLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (slot?.status === 'booked') {
        return (
            <DashboardLayout>
                <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
                    <Info className="h-16 w-16 text-amber-500" />
                    <h2 className="text-2xl font-black italic uppercase">Slot Already Booked</h2>
                    <p className="text-muted-foreground font-bold">This slot cannot be edited because it has been booked by a student.</p>
                    <Button onClick={() => navigate('/trainer-dashboard/slots')} className="rounded-xl px-8 h-12 font-black uppercase tracking-widest mt-4">
                        Back to Slots
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <SectionHeader
                title="Edit Training Slot"
                subtitle="Trainer Dashboard"
                description={`Modify your training session: ${slot?.slotName || 'Regular Session'}`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Read Only Trainer Info */}
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-muted/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <UserCircle className="h-32 w-32" />
                    </div>
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Trainer Profile</CardTitle>
                        <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Fixed application details</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Full Name</Label>
                                <p className="text-sm font-black text-foreground">{appData?.fullName}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Email Address</Label>
                                <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                    <Mail className="h-3 w-3" /> {appData?.email}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Experience</Label>
                                <p className="text-sm font-black text-foreground flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-primary" /> {appData?.experience} Years
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-muted/50">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2 block">Available Days (Original)</Label>
                            <div className="flex flex-wrap gap-2">
                                {appData?.availableDays?.map(day => (
                                    <Badge key={day} variant="secondary" className="bg-white/50 border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                        {day}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Slot Form */}
                <div className="lg:col-span-2">
                    <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-card overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Slot Name */}
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase tracking-widest ml-1">Slot Name</Label>
                                        <Input
                                            placeholder="e.g. Morning Strength Session"
                                            className="h-14 rounded-2xl border-muted/30 focus:border-primary/50 transition-all font-bold"
                                            value={formData.slotName}
                                            onChange={(e) => setFormData({ ...formData, slotName: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* Slot Time / Duration */}
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase tracking-widest ml-1">Slot Duration</Label>
                                        <UiSelect
                                            value={formData.slotTime}
                                            onValueChange={(val) => setFormData({ ...formData, slotTime: val })}
                                        >
                                            <UiSelectTrigger className="h-14 rounded-2xl border-muted/30 focus:border-primary/50 transition-all font-bold">
                                                <UiSelectValue placeholder="Select Duration" />
                                            </UiSelectTrigger>
                                            <UiSelectContent className="rounded-2xl border-none shadow-2xl">
                                                <UiSelectItem value="45 Minutes">45 Minutes</UiSelectItem>
                                                <UiSelectItem value="1 Hour">1 Hour</UiSelectItem>
                                                <UiSelectItem value="1.5 Hours">1.5 Hours</UiSelectItem>
                                                <UiSelectItem value="2 Hours">2 Hours</UiSelectItem>
                                            </UiSelectContent>
                                        </UiSelect>
                                    </div>

                                    {/* Start Time */}
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase tracking-widest ml-1">Start Time</Label>
                                        <div className="relative">
                                            <Input
                                                type="time"
                                                className="h-14 rounded-2xl border-muted/30 focus:border-primary/50 transition-all font-bold"
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                                required
                                            />
                                            <Clock className="absolute right-4 top-4 h-5 w-5 text-muted-foreground/30 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Select Days (React Select) */}
                                    <div className="space-y-3 md:col-span-2">
                                        <Label className="text-[11px] font-black uppercase tracking-widest ml-1">Applicable Days</Label>
                                        <Select
                                            isMulti
                                            options={dayOptions}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            value={formData.selectedDays}
                                            onChange={(selected) => setFormData({ ...formData, selectedDays: selected })}
                                            placeholder="Choose which days this slot applies to..."
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: '1rem',
                                                    padding: '0.4rem',
                                                    borderColor: 'rgba(0,0,0,0.1)',
                                                    boxShadow: 'none',
                                                    '&:hover': { borderColor: 'var(--primary)' }
                                                }),
                                                multiValue: (base) => ({
                                                    ...base,
                                                    backgroundColor: 'var(--primary)',
                                                    borderRadius: '0.5rem',
                                                    padding: '0 4px',
                                                }),
                                                multiValueLabel: (base) => ({
                                                    ...base,
                                                    color: 'white',
                                                    fontSize: '10px',
                                                    fontWeight: '900',
                                                    textTransform: 'uppercase',
                                                }),
                                                multiValueRemove: (base) => ({
                                                    ...base,
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)' }
                                                })
                                            }}
                                        />
                                        <p className="text-[10px] font-bold text-muted-foreground ml-1">Update availability from your pre-approved list.</p>
                                    </div>

                                    {/* Classes Include */}
                                    <div className="space-y-3 md:col-span-2">
                                        <Label className="text-[11px] font-black uppercase tracking-widest ml-1">Classes Include</Label>
                                        <UiSelect
                                            value={formData.classId}
                                            onValueChange={(val) => {
                                                const selected = classes?.find(c => c._id === val);
                                                setFormData({ ...formData, classId: val, className: selected?.name });
                                            }}
                                        >
                                            <UiSelectTrigger className="h-14 rounded-2xl border-muted/30 focus:border-primary/50 transition-all font-bold">
                                                <UiSelectValue placeholder="Select an Admin Approved Class" />
                                            </UiSelectTrigger>
                                            <UiSelectContent className="rounded-2xl border-none shadow-2xl">
                                                {classes?.map(c => (
                                                    <UiSelectItem key={c._id?.toString()} value={c._id?.toString()} className="font-bold py-3">
                                                        {c.name}
                                                    </UiSelectItem>
                                                ))}
                                            </UiSelectContent>
                                        </UiSelect>
                                        <p className="text-[10px] font-bold text-muted-foreground ml-1 flex items-center gap-1">
                                            <Info className="h-3 w-3" /> Note: Only admin-approved classes can be selected.
                                        </p>
                                    </div>

                                    {/* Other Info */}
                                    <div className="space-y-3 md:col-span-2">
                                        <Label className="text-[11px] font-black uppercase tracking-widest ml-1">Optional Notes</Label>
                                        <textarea
                                            className="w-full min-h-[120px] rounded-2xl border border-muted/30 focus:border-primary/50 transition-all font-bold p-4 outline-none"
                                            placeholder="Any special instructions or details about this slot..."
                                            value={formData.otherInfo}
                                            onChange={(e) => setFormData({ ...formData, otherInfo: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/trainer-dashboard/slots')}
                                        className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest border-muted-foreground/20 hover:bg-muted/10 transition-all"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={updateMutation.isPending}
                                        className="flex-[2] h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {updateMutation.isPending ? (
                                            <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Saving...</>
                                        ) : (
                                            <><Save className="mr-2 h-6 w-6" /> Save Changes</>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </form>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EditSlot;
