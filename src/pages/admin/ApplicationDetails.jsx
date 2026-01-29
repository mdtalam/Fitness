import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Loader2,
    Check,
    X,
    User,
    Mail,
    Award,
    Clock,
    Briefcase,
    ArrowLeft,
    ShieldCheck,
    MessageSquare,
    Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const ApplicationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [feedback, setFeedback] = useState('');

    const { data: application, isLoading, isError } = useQuery({
        queryKey: ['adminApplication', id],
        queryFn: async () => {
            const res = await api.get(`/trainers/applications/${id}`);
            return res.data.data.application;
        }
    });

    const handleAction = useMutation({
        mutationFn: async ({ status, adminFeedback }) => {
            return api.patch(`/trainers/applications/${id}`, { status, adminFeedback });
        },
        onSuccess: (res, variables) => {
            const successMsg = variables.status === 'approved'
                ? 'Application confirmed! The user is now a trainer.'
                : 'Application rejected.';
            toast.success(successMsg);
            queryClient.invalidateQueries(['adminApplications']);
            navigate('/admin-dashboard/applications');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Action failed')
    });

    if (isLoading) return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        </DashboardLayout>
    );

    if (isError || !application) return (
        <DashboardLayout>
            <div className="p-12 text-center">
                <p className="text-destructive font-bold">Failed to load application details.</p>
                <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto mb-12">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Applications
                </Button>

                <SectionHeader
                    title="Review Applicant"
                    subtitle="Application Details"
                    description="Carefully review the candidate's expertise and profile before making a decision."
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">

                    {/* Left Panel: Profile */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-primary/5">
                            <CardContent className="p-8 text-center">
                                <Avatar className="h-32 w-32 mx-auto rounded-[2.5rem] border-4 border-background shadow-xl mb-6">
                                    <AvatarImage src={application.profileImage} className="object-cover" />
                                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-black">
                                        {application.fullName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-black tracking-tight">{application.fullName}</h2>
                                <p className="text-sm font-bold text-primary flex items-center justify-center gap-1.5 mt-1 uppercase tracking-widest opacity-70">
                                    <Award className="h-3 w-3" /> Potential Trainer
                                </p>

                                <div className="mt-8 space-y-4 text-left">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/50 border border-primary/5 group transition-colors">
                                        <Mail className="h-4 w-4 text-primary opacity-60" />
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Email</p>
                                            <p className="text-sm font-bold truncate">{application.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/50 border border-primary/5">
                                        <Clock className="h-4 w-4 text-primary opacity-60" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Experience</p>
                                            <p className="text-sm font-bold">{application.yearsOfExperience} Years</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-background/50 border border-primary/5">
                                        <Calendar className="h-4 w-4 text-primary opacity-60" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Age</p>
                                            <p className="text-sm font-bold">{application.age} Years Old</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel: Content & Actions */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                            <CardHeader className="bg-muted/10 p-8 border-b">
                                <CardTitle className="text-lg font-black flex items-center gap-3 uppercase tracking-tight">
                                    <Briefcase className="h-5 w-5 text-primary" /> Professional Background
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-60">Candidate Bio</p>
                                    <p className="text-base font-medium leading-relaxed italic border-l-4 border-primary/10 pl-6 text-foreground/80">
                                        "{application.bio}"
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-60">Expertise Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {application.skills?.map(skill => (
                                            <span
                                                key={skill}
                                                className="px-4 py-2 rounded-xl bg-primary/5 text-primary font-bold text-sm uppercase tracking-tight border border-primary/10"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-6 border-t">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 opacity-60">Available Days</p>
                                        <p className="text-sm font-black text-primary uppercase">{application.availableDays?.join(', ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 opacity-60">Daily Hours</p>
                                        <p className="text-sm font-black text-primary uppercase">{application.availableTime}</p>
                                    </div>
                                </div>

                                {application.otherInfo && (
                                    <div className="pt-6 border-t">
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-60">Additional Info</p>
                                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">{application.otherInfo}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-6">
                            <Button
                                onClick={() => setIsRejectModalOpen(true)}
                                variant="outline"
                                className="h-20 rounded-[1.5rem] border-destructive/20 text-destructive font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all shadow-xl shadow-destructive/5 gap-3"
                                disabled={handleAction.isLoading}
                            >
                                <X className="h-6 w-6 font-black" /> Reject Application
                            </Button>
                            <Button
                                onClick={() => handleAction.mutate({ status: 'approved' })}
                                className="h-20 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3"
                                disabled={handleAction.isLoading}
                            >
                                {handleAction.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ShieldCheck className="h-6 w-6" />}
                                Confirm Application
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8 max-w-lg">
                    <DialogHeader>
                        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                            <X className="h-8 w-8 text-destructive" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Rejection Feedback</DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground pt-2">
                            Reviewing rejection for <span className="font-bold text-foreground">{application.fullName}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 space-y-2">
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest opacity-60">
                                <span>Expertise</span>
                                <span className="text-primary">{application.skills?.join(', ')}</span>
                            </div>
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest opacity-60">
                                <span>Experience</span>
                                <span className="text-primary">{application.yearsOfExperience}y</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Rejection Reason / Feedback</p>
                            <Textarea
                                placeholder="Providing specific feedback helps the applicant improve..."
                                className="min-h-[120px] rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-destructive/30 p-4 transition-all"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:gap-0 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsRejectModalOpen(false)}
                            className="h-12 rounded-xl font-bold uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleAction.mutate({ status: 'rejected', adminFeedback: feedback })}
                            className="h-12 rounded-xl bg-destructive hover:bg-destructive/90 font-black uppercase tracking-widest text-xs shadow-lg shadow-destructive/20"
                            disabled={handleAction.isLoading || !feedback.trim()}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default ApplicationDetails;
