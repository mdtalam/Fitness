import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import {
    Loader2,
    CreditCard,
    ShieldCheck,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Calendar,
    Target,
    User,
    Mail,
    Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
    const { trainerId, slotId, packageId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [isSuccess, setIsSuccess] = useState(false);

    // Get package from state or fallback
    const selectedPackage = location.state?.package || {
        id: packageId,
        name: packageId ? `${packageId.charAt(0).toUpperCase() + packageId.slice(1)} Membership` : 'Basic Membership',
        price: packageId === 'basic' ? 10 : packageId === 'standard' ? 50 : 100
    };

    const { data: trainer, isLoading: isTrainerLoading } = useQuery({
        queryKey: ['trainer', trainerId],
        queryFn: async () => {
            const res = await api.get(`/trainers/${trainerId}`);
            return res.data.data.trainer;
        }
    });

    const { data: slot, isLoading: isSlotLoading } = useQuery({
        queryKey: ['slot', slotId],
        queryFn: async () => {
            const res = await api.get(`/slots/trainer/${trainerId}`);
            return res.data.data.slots.find(s => s._id === slotId);
        }
    });

    const handleSuccess = () => {
        setIsSuccess(true);
        toast.success('Your booking session is confirmed!');
        setTimeout(() => navigate('/dashboard/bookings'), 3000);
    };

    if (isTrainerLoading || isSlotLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-32 pb-32 flex items-center justify-center bg-muted/10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="max-w-md w-full rounded-[3rem] border-none shadow-2xl p-12 text-center bg-card">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="h-24 w-24 rounded-[2rem] bg-green-500/10 flex items-center justify-center mx-auto mb-8"
                        >
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </motion.div>
                        <CardTitle className="text-3xl font-black italic uppercase mb-4">Payment Successful!</CardTitle>
                        <p className="text-muted-foreground font-bold mb-10">
                            Thank you for choosing {trainer?.user?.name}. Your booking for the {selectedPackage.name} is now confirmed.
                        </p>
                        <div className="space-y-4">
                            <Badge variant="outline" className="rounded-full px-6 py-2 border-green-500/20 text-green-600 font-black tracking-widest uppercase text-[10px]">Active Booking</Badge>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Redirecting to your dashboard...</p>
                        </div>
                    </Card>
                </motion.div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-32 pb-32 bg-muted/10 text-left">
            <motion.div
                className="container max-w-5xl mx-auto px-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Button
                        variant="ghost"
                        className="mb-8 font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/50 rounded-xl"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Review
                    </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <SectionHeader
                        title="Complete Your Payment"
                        subtitle="Secure Checkout"
                        description="Enter your payment details to confirm your membership and start your training journey with our expert trainers."
                    />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
                    {/* Summary Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-7 space-y-8">
                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-card overflow-hidden">
                            <CardHeader className="p-10 pb-0">
                                <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                { /* Trainer Info */}
                                <div className="flex items-center gap-6 p-6 rounded-3xl bg-muted/30">
                                    <Avatar className="h-16 w-16 rounded-2xl border-2 border-background shadow-lg">
                                        <AvatarImage src={trainer?.user?.photoURL} className="object-cover" />
                                        <AvatarFallback className="bg-primary text-primary-foreground font-black">{trainer?.user?.name?.charAt(0) || 'T'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="text-lg font-black italic">{trainer?.user?.name}</h4>
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            <Target className="h-3 w-3 text-primary" /> {slot?.className || slot?.slotName}
                                        </div>
                                    </div>
                                </div>

                                {/* User Read-only Info */}
                                <div className="space-y-4 pt-4 border-t border-muted/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Your Name</Label>
                                            <div className="relative">
                                                <Input value={user?.name} readOnly className="h-12 rounded-xl bg-muted/20 border-muted/50 pl-10 font-bold" />
                                                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Your Email</Label>
                                            <div className="relative">
                                                <Input value={user?.email} readOnly className="h-12 rounded-xl bg-muted/20 border-muted/50 pl-10 font-bold" />
                                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/50" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Slot Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-3xl border border-muted/50 flex flex-col gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Session Time</Label>
                                        <div className="flex items-center gap-2 font-black text-sm">
                                            <Clock className="h-4 w-4 text-primary" /> {slot?.startTime}
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-3xl border border-muted/50 flex flex-col gap-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Assigned Days</Label>
                                        <div className="flex items-center gap-2 font-black text-xs">
                                            <Calendar className="h-4 w-4 text-primary" /> {slot?.selectedDays?.join(', ')}
                                        </div>
                                    </div>
                                </div>

                                {/* Package Detail */}
                                <div className="pt-8 border-t border-muted/50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-primary/60 opacity-60">Plan Selection</p>
                                        <p className="text-2xl font-black italic uppercase">{selectedPackage.name}</p>
                                    </div>
                                    <Badge className="h-10 px-6 rounded-2xl bg-primary/10 text-primary border-none font-black text-lg shadow-none">
                                        ${selectedPackage.price}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-3 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 mb-8">
                            <ShieldCheck className="h-6 w-6 text-amber-500 shrink-0" />
                            <p className="text-[11px] font-bold text-amber-900/60 leading-relaxed uppercase">
                                Secure transactions powered by Stripe. Your sensitive payment info never touches our servers.
                            </p>
                        </div>
                    </motion.div>

                    {/* Payment Form Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-5">
                        <Card className="rounded-[3rem] border-none shadow-2xl bg-primary text-primary-foreground p-12 overflow-hidden relative sticky top-32">
                            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                                <CreditCard className="h-48 w-48" />
                            </div>

                            <div className="relative z-10 space-y-10">
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black italic uppercase leading-none">Payment</h3>
                                    <p className="text-primary-foreground/70 font-bold uppercase tracking-widest text-xs">Enter your card details</p>
                                </div>

                                <div className="p-2 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10">
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm
                                            price={selectedPackage.price}
                                            trainerId={trainerId}
                                            slotId={slotId}
                                            packageType={selectedPackage.id}
                                            onSuccess={handleSuccess}
                                        />
                                    </Elements>
                                </div>

                                <div className="flex items-center justify-center gap-4 py-4 border-t border-white/10">
                                    <div className="flex -space-x-2">
                                        <div className="h-8 w-12 rounded bg-white/20 border border-white/20 flex items-center justify-center text-[8px] font-bold">VISA</div>
                                        <div className="h-8 w-12 rounded bg-white/20 border border-white/20 flex items-center justify-center text-[8px] font-bold">MC</div>
                                        <div className="h-8 w-12 rounded bg-white/20 border border-white/20 flex items-center justify-center text-[8px] font-bold">AMEX</div>
                                    </div>
                                    <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">All Major Cards Accepted</div>
                                </div>

                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Secured with 256-bit SSL encryption</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Payment;
