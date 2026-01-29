import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Loader2,
    Check,
    ArrowRight,
    ShieldCheck,
    Zap,
    Crown,
    CreditCard,
    Clock,
    Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PACKAGES = [
    {
        id: 'basic',
        name: 'Basic Membership',
        price: 10,
        icon: <Zap className="h-6 w-6 text-blue-500" />,
        description: 'Access to gym facilities during regular operating hours.',
        features: [
            'Access to gym facilities during regular operating hours',
            'Use of cardio and strength training equipment',
            'Access to locker rooms and showers'
        ],
        color: 'border-blue-500/20 hover:border-blue-500'
    },
    {
        id: 'standard',
        name: 'Standard Membership',
        price: 50,
        icon: <ShieldCheck className="h-6 w-6 text-primary" />,
        description: 'All benefits of the basic membership + more.',
        features: [
            'All benefits of the basic membership',
            'Access to group fitness classes (Yoga, Spinning, Zumba)',
            'Use of additional amenities like a sauna or steam room'
        ],
        color: 'border-primary/20 hover:border-primary shadow-xl shadow-primary/5'
    },
    {
        id: 'premium',
        name: 'Premium Membership',
        price: 100,
        icon: <Crown className="h-6 w-6 text-amber-500" />,
        description: 'All benefits of the standard membership + elite services.',
        features: [
            'All benefits of the standard membership',
            'Access to personal training sessions with certified trainers',
            'Discounts on massage therapy or nutrition counseling'
        ],
        color: 'border-amber-500/20 hover:border-amber-500'
    }
];
const BookingPage = () => {
    const { trainerId, slotId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const { data: trainer, isLoading: isTrainerLoading } = useQuery({
        queryKey: ['trainer', trainerId],
        queryFn: async () => {
            const response = await api.get(`/trainers/${trainerId}`);
            return response.data.data.trainer;
        },
    });

    const { data: slot, isLoading: isSlotLoading } = useQuery({
        queryKey: ['slot', slotId],
        queryFn: async () => {
            // In a real app, we'd have a GET /api/slots/:id
            const response = await api.get(`/slots/trainer/${trainerId}`);
            return response.data.data.slots.find(s => s._id === slotId);
        },
    });

    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg);
        setStep(2);
        toast.success(`${pkg.name} selected!`);
    };

    if (isTrainerLoading || isSlotLoading) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-32 bg-muted/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Stepper */}
                <div className="max-w-xl mx-auto mb-16 px-4">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-muted -translate-y-1/2 -z-10"></div>
                        <div className={`absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 -z-10 transition-all duration-500`} style={{ width: step === 1 ? '0%' : '100%' }}></div>

                        {[1, 2].map((i) => (
                            <div key={i} className={`h-10 w-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${step >= i ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-background border-muted text-muted-foreground'}`}>
                                {step > i ? <Check className="h-5 w-5" /> : i}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                        <span className={`text-xs font-black uppercase tracking-widest ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Membership</span>
                        <span className={`text-xs font-black uppercase tracking-widest ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Review & Pay</span>
                    </div>
                </div>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <SectionHeader
                            centered
                            subtitle="Step 1: Choose Your Plan"
                            title="Select a Membership Package"
                            description="Pick the plan that best fits your fitness goals and budget."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            {PACKAGES.map((pkg) => (
                                <Card
                                    key={pkg.id}
                                    className={`group relative flex flex-col border-2 transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer ${pkg.color}`}
                                    onClick={() => handlePackageSelect(pkg)}
                                >
                                    {pkg.id === 'standard' && (
                                        <div className="absolute top-4 right-4 animate-pulse">
                                            <Badge className="bg-primary hover:bg-primary text-[10px] uppercase font-black px-3 py-1">Best Value</Badge>
                                        </div>
                                    )}

                                    <CardHeader className="p-8 pb-4">
                                        <div className="mb-6 h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-primary/5">
                                            {pkg.icon}
                                        </div>
                                        <CardTitle className="text-2xl font-black">{pkg.name}</CardTitle>
                                        <CardDescription className="text-sm font-medium mt-2 leading-relaxed">
                                            {pkg.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-8 pt-0 flex-grow">
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-5xl font-black italic">${pkg.price}</span>
                                            <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs">/ month</span>
                                        </div>

                                        <ul className="space-y-4">
                                            {pkg.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3">
                                                    <div className="p-1 rounded-full bg-primary/10 text-primary mt-0.5"> <Check className="h-3 w-3" /> </div>
                                                    <span className="text-sm font-semibold text-muted-foreground">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter className="p-8 pt-0">
                                        <Button
                                            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all group-hover:scale-[1.02] group-hover:bg-primary active:scale-95 border-none"
                                            onClick={() => handlePackageSelect(pkg)}
                                        >
                                            Choose {pkg.name.split(' ')[0]} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Booking Review */}
                            <div className="lg:col-span-12">
                                <SectionHeader
                                    centered
                                    subtitle="Step 2: Review Your Booking"
                                    title="Finalize Your Details"
                                    description="Please review your trainer, slot, and membership details before proceeding to payment."
                                />
                            </div>

                            <div className="lg:col-span-7 space-y-8 text-left">
                                <Card className="rounded-3xl border-none shadow-xl shadow-black/5 overflow-hidden">
                                    <div className="p-8 bg-card flex flex-col sm:flex-row items-center gap-8">
                                        <div className="h-24 w-24 rounded-2xl p-1 bg-primary/10">
                                            <Avatar className="h-full w-full rounded-xl border-2 border-background">
                                                <AvatarImage src={trainer.user?.photoURL} className="object-cover" />
                                                <AvatarFallback className="text-2xl font-bold bg-muted">{trainer.user?.name?.charAt(0) || 'T'}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="text-center sm:text-left flex-grow">
                                            <h3 className="text-2xl font-black italic">{trainer.user?.name}</h3>
                                            <p className="text-sm font-bold text-primary uppercase tracking-widest">{slot?.className}</p>
                                            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-muted-foreground font-bold text-xs uppercase tracking-tighter">
                                                <span className="flex items-center gap-1"> <Clock className="h-3 w-3" /> {slot?.startTime} {slot?.endTime ? `- ${slot.endTime}` : `(${slot?.slotTime})`} </span>
                                                <span className="flex items-center gap-1"> <Calendar className="h-3 w-3" /> {slot?.date ? new Date(slot.date).toLocaleDateString() : slot?.selectedDays?.join(', ')} </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="p-8 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <CreditCard className="h-8 w-8 text-primary" />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest opacity-60">Selected Plan</p>
                                            <p className="text-xl font-black">{selectedPackage.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black italic text-primary">${selectedPackage.price}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="ghost" onClick={() => setStep(1)} className="font-bold text-muted-foreground hover:bg-muted">Change Plan</Button>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <Card className="rounded-3xl border-none shadow-2xl bg-primary text-primary-foreground p-8 h-full flex flex-col justify-center overflow-hidden relative">
                                    <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                                    <h4 className="text-2xl font-black mb-8 italic flex items-center gap-2">
                                        <ShieldCheck className="h-6 w-6" /> Secure Checkout
                                    </h4>
                                    <p className="font-semibold text-primary-foreground/80 mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
                                        Redirection to our highly secure payment gateway... Your session details are ready.
                                    </p>
                                    <Button className="w-full h-16 rounded-2xl bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95" onClick={() => {
                                        const { icon, ...serializablePackage } = selectedPackage;
                                        navigate(`/payment/${trainerId}/${slotId}/${selectedPackage.id}`, { state: { package: serializablePackage } });
                                    }}>
                                        Join Now & Pay ${selectedPackage.price}
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
