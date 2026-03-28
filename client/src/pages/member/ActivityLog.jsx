import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, FileText, AlertCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const ActivityLog = () => {
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['myApplication'],
        queryFn: async () => {
            const res = await api.get('/trainers/my-application');
            return res.data.data.application;
        }
    });

    const openFeedbackModal = (feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-[50vh]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    const application = data;

    return (
        <DashboardLayout>
            <SectionHeader
                title="Activity Log"
                subtitle="Application Status"
                description="Track the status of your trainer application and view feedback from administrators."
            />

            <div className="max-w-4xl mx-auto mt-12">
                {!application ? (
                    <Card className="rounded-[2.5rem] border-dashed border-2 p-12 text-center bg-muted/5">
                        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <FileText className="h-10 w-10 text-primary opacity-40" />
                        </div>
                        <h3 className="text-xl font-black mb-2 italic">No Application Found</h3>
                        <p className="text-muted-foreground mb-8">You haven't applied to be a trainer yet. Start your journey today!</p>
                        <Button asChild className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest">
                            <a href="/become-trainer">Apply Now</a>
                        </Button>
                    </Card>
                ) : (
                    <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                        <CardHeader className="bg-muted/10 p-8 border-b">
                            <CardTitle className="text-lg font-black flex items-center gap-3 uppercase tracking-tight">
                                <Clock className="h-5 w-5 text-primary" /> Application History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Applied Date</th>
                                            <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Role</th>
                                            <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Status</th>
                                            <th className="text-right py-4 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b last:border-0 hover:bg-muted/5 transition-colors group">
                                            <td className="py-6 px-2">
                                                <p className="text-sm font-bold">{application.createdAt ? format(new Date(application.createdAt), 'MMM dd, yyyy') : 'N/A'}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{application.createdAt ? format(new Date(application.createdAt), 'hh:mm a') : ''}</p>
                                            </td>
                                            <td className="py-6 px-2">
                                                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-primary/5 text-primary rounded-lg border border-primary/10">Trainer</span>
                                            </td>
                                            <td className="py-6 px-2">
                                                <div className="flex items-center gap-2">
                                                    {application.status === 'pending' && (
                                                        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 rounded-lg px-3 py-1 font-black uppercase text-[10px] tracking-widest gap-1.5 ring-0">
                                                            <Clock className="w-3 h-3" /> Pending
                                                        </Badge>
                                                    )}
                                                    {application.status === 'rejected' && (
                                                        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 rounded-lg px-3 py-1 font-black uppercase text-[10px] tracking-widest gap-1.5 ring-0">
                                                            <XCircle className="w-3 h-3" /> Rejected
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-6 px-2 text-right">
                                                {application.status === 'rejected' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 rounded-xl hover:bg-primary/5 text-primary group-hover:scale-110 transition-all border border-transparent hover:border-primary/10"
                                                        onClick={() => openFeedbackModal(application.adminFeedback)}
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {application?.status === 'rejected' && (
                    <div className="mt-8 p-6 rounded-[1.5rem] bg-destructive/5 border border-destructive/10 flex gap-4 items-start">
                        <XCircle className="h-6 w-6 text-destructive shrink-0" />
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-tight text-destructive mb-1">Application Rejected</h4>
                            <p className="text-sm text-destructive-foreground/60 font-medium leading-relaxed">
                                Unfortunately, your application was not successful this time.
                                {(() => {
                                    const rejectionDate = new Date(application.updatedAt);
                                    const oneMonthLater = new Date(rejectionDate.getTime());
                                    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
                                    return (
                                        <> You can try applying again after <span className="font-bold">{format(oneMonthLater, 'MMMM dd, yyyy')}</span>.</>
                                    );
                                })()}
                            </p>
                        </div>
                    </div>
                )}

                {application?.status === 'pending' && (
                    <div className="mt-8 p-6 rounded-[1.5rem] bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
                        <AlertCircle className="h-6 w-6 text-blue-500 shrink-0" />
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-tight text-blue-500 mb-1">Under Review</h4>
                            <p className="text-sm text-blue-900/60 font-medium leading-relaxed">
                                Our administrators are currently reviewing your application. This process usually takes 1-3 business days.
                                We'll notify you once a decision is made.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Rejection Feedback Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8 max-w-lg">
                    <DialogHeader>
                        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Admin Feedback</DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground pt-2">
                            The following feedback was provided regarding your recent application.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6">
                        <div className="p-6 rounded-[1.5rem] bg-muted/30 border border-primary/5 min-h-[120px]">
                            <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                                "{selectedFeedback || 'No specific feedback provided.'}"
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            onClick={() => setIsModalOpen(false)}
                            className="h-12 rounded-xl px-10 font-black uppercase tracking-widest text-xs shadow-lg"
                        >
                            Understood
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default ActivityLog;
