import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarCheck, ShieldCheck, Star, Loader2, MessageSquare, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const MemberBookings = () => {
    const queryClient = useQueryClient();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['my-bookings'],
        queryFn: async () => {
            const response = await api.get('/bookings/my-bookings');
            return response.data.data.bookings;
        }
    });

    const reviewMutation = useMutation({
        mutationFn: async (reviewData) => {
            return await api.post(`/bookings/${selectedBooking._id}/review`, reviewData);
        },
        onSuccess: () => {
            toast.success('Thank you for your feedback!');
            queryClient.invalidateQueries(['my-bookings']);
            setIsDialogOpen(false);
            setFeedback('');
            setRating(5);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    });

    const handleReviewSubmit = () => {
        if (!feedback.trim()) {
            toast.error('Please provide some feedback');
            return;
        }
        reviewMutation.mutate({ rating, feedback });
    };

    const openReviewDialog = (booking) => {
        setSelectedBooking(booking);
        setIsDialogOpen(true);
    };

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
                title="My Training Journey"
                subtitle="Member Bookings"
                description="View your upcoming and past training sessions."
            />

            <div className="grid grid-cols-1 gap-6 mt-8">
                {bookings?.length > 0 ? (
                    bookings.map((booking) => (
                        <Card key={booking._id} className="rounded-3xl border-none shadow-xl shadow-black/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:scale-[1.01] transition-all bg-card">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <CalendarCheck className="h-10 w-10" />
                                </div>
                                <div className="text-left space-y-2">
                                    <h4 className="text-2xl font-black italic">{booking.slot?.className || 'Training Session'}</h4>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-muted-foreground font-bold text-xs uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> {booking.trainerUser?.name}</span>
                                        <span className="hidden sm:inline opacity-20">•</span>
                                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {booking.slot?.startTime}</span>
                                        <span className="hidden sm:inline opacity-20">•</span>
                                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="pt-1">
                                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold px-3">
                                            {booking.packageType} Package
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                <Badge className={`
                                    ${booking.status === 'upcoming' ? 'bg-amber-500/10 text-amber-500' :
                                        booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                            'bg-blue-500/10 text-blue-500'} 
                                    font-black tracking-widest px-4 py-2 rounded-xl border-none
                                `}>
                                    {booking.status}
                                </Badge>

                                {booking.review ? (
                                    <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-primary/5 text-primary font-bold text-sm">
                                        <Star className="h-4 w-4 fill-primary" /> {booking.review.rating}
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => openReviewDialog(booking)}
                                        className="h-12 px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Star className="h-4 w-4 mr-2" /> Review Session
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/5 rounded-[3rem] border-2 border-dashed border-muted">
                        <CalendarCheck className="h-16 w-16 text-muted mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-black italic uppercase text-muted-foreground">No bookings found</h3>
                        <p className="text-sm font-semibold opacity-60 mt-2">Start your fitness journey by booking a session with our expert trainers!</p>
                        <Button className="mt-8 rounded-2xl" onClick={() => window.location.href = '/trainers'}>Explore Trainers</Button>
                    </div>
                )}
            </div>

            {/* Review Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic uppercase">Review Your Session</DialogTitle>
                        <DialogDescription className="font-semibold text-muted-foreground pt-2">
                            How was your training with {selectedBooking?.trainerUser?.name}? Your feedback helps our community.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-8 space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-xs font-black uppercase tracking-widest opacity-60">Your Rating</span>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="transition-all hover:scale-125 focus:outline-none"
                                    >
                                        <Star
                                            className={`h-10 w-10 ${rating >= star ? 'fill-primary text-primary' : 'text-muted-foreground/20'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" /> Your Experience
                            </span>
                            <Textarea
                                placeholder="Tell us about the workout, the trainer's expertise, or anything else..."
                                className="min-h-[120px] rounded-2xl border-muted bg-muted/20 focus:bg-background transition-all p-4 font-semibold text-sm leading-relaxed"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="rounded-2xl font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReviewSubmit}
                            disabled={reviewMutation.isPending}
                            className="rounded-2xl font-black uppercase tracking-widest px-8 bg-primary shadow-xl shadow-primary/20"
                        >
                            {reviewMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Review'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default MemberBookings;
