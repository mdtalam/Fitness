import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import api from '@/services/api';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Loader2,
    User,
    Mail,
    Briefcase,
    Award,
    Clock,
    ShieldCheck,
    Image as ImageIcon,
    Camera,
    Calendar,
    CheckCircle2,
    Sparkles,
    Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { uploadImage } from '@/lib/upload';

const dayOptions = [
    { value: 'Sunday', label: 'Sunday' },
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
];

const availableSkills = ['Yoga', 'HIIT', 'Strength', 'Cardio', 'Nutrition', 'Pilates', 'CrossFit', 'Personal Training', 'Boxing', 'Zumba'];

const BeATrainer = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(user?.photoURL || '');
    const fileInputRef = useRef(null);

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            fullName: user?.name || '',
            email: user?.email || '',
            skills: [],
            availableDays: []
        }
    });

    const selectedSkills = watch('skills');

    // Check for existing application
    const { data: appData, isLoading: isLoadingApp } = useQuery({
        queryKey: ['myApplication'],
        queryFn: async () => {
            const res = await api.get('/trainers/my-application');
            return res.data.data.application;
        },
        retry: false, // Do not retry if application not found (404)
        refetchOnWindowFocus: false,
    });

    const hasShownAlert = useRef(false);

    // Handle already-applied and rejection timing redirection
    useEffect(() => {
        if (appData && !hasShownAlert.current) {
            if (appData.status === 'pending') {
                toast.error("You have already submitted a trainer application!");
                hasShownAlert.current = true;
                navigate('/dashboard/activity-log', { replace: true });
            } else if (appData.status === 'rejected') {
                const rejectionDate = new Date(appData.updatedAt);
                const oneMonthLater = new Date(rejectionDate.getTime());
                oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

                if (new Date() < oneMonthLater) {
                    toast.error(`You can apply again after ${oneMonthLater.toLocaleDateString()}`);
                    hasShownAlert.current = true;
                    navigate('/dashboard/activity-log', { replace: true });
                }
            }
        }
    }, [appData, navigate]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
        setUploading(true);

        try {
            const url = await uploadImage(file);
            setValue('profileImage', url);
            toast.success('Profile image uploaded!');
        } catch (error) {
            toast.error('Upload failed. Using previous image.');
            setPreviewUrl(user?.photoURL || '');
        } finally {
            setUploading(false);
        }
    };

    const toggleSkill = (skill) => {
        const current = selectedSkills || [];
        const updated = current.includes(skill)
            ? current.filter(s => s !== skill)
            : [...current, skill];
        setValue('skills', updated);
    };

    const onSubmit = async (data) => {
        if (!data.profileImage && !user.photoURL) return toast.error('Please upload a profile image');
        if (data.skills.length === 0) return toast.error('Please select at least one skill');
        if (data.availableDays.length === 0) return toast.error('Please select your available days');

        setLoading(true);
        try {
            // Mapping availableDays to just the values
            const formattedData = {
                ...data,
                availableDays: data.availableDays.map(d => d.value),
                status: 'pending' // Default status
            };

            await api.post('/trainers/apply', formattedData);
            toast.success('Your application has been submitted! We will review it soon.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isLoadingApp || appData) {
        return (
            <div className="min-h-screen pt-48 bg-muted/20 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
                    {appData ? 'Redirecting...' : 'Verifying application status...'}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 bg-muted/20">
            <div className="container mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <SectionHeader
                        centered
                        subtitle="Impact Others"
                        title="Become a Certified Trainer"
                        description="Join our elite team of fitness professionals. Share your expertise and build your community with FitTracker."
                    />
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-16 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column: Profile & Basics */}
                        <div className="lg:col-span-4 space-y-8">
                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                            <Camera className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                        Profile Identity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 flex flex-col items-center">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative group cursor-pointer mb-6"
                                    >
                                        <div className="h-40 w-40 rounded-[2.5rem] overflow-hidden border-4 border-background shadow-2xl transition-all group-hover:scale-105">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-muted flex items-center justify-center flex-col text-muted-foreground">
                                                    <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex flex-col items-center text-white">
                                                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
                                                <span className="text-[8px] font-black uppercase tracking-widest mt-1">Change photo</span>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-background">
                                            {uploading ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : <Camera className="h-4 w-4 text-white" />}
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <input type="hidden" {...register('profileImage')} />
                                    </div>
                                    <div className="w-full space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <Input
                                                    {...register('fullName', { required: 'Full name is required' })}
                                                    placeholder="Your name as it should appear"
                                                    className="h-14 pl-12 rounded-2xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all font-medium"
                                                />
                                            </div>
                                            {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.fullName.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <Input
                                                    {...register('email')}
                                                    readOnly
                                                    className="h-14 pl-12 rounded-2xl bg-muted/10 border-none ring-1 ring-border opacity-70 cursor-not-allowed font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                            <Award className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                        Experience Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Your Age</Label>
                                        <Input
                                            type="number"
                                            {...register('age', {
                                                required: 'Age is required',
                                                min: { value: 18, message: 'Must be at least 18' }
                                            })}
                                            placeholder="e.g. 28"
                                            className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all"
                                        />
                                        {errors.age && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.age.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Years of Experience</Label>
                                        <Input
                                            type="number"
                                            {...register('yearsOfExperience', {
                                                required: 'Experience is required',
                                                min: { value: 0, message: 'Cannot be negative' }
                                            })}
                                            placeholder="e.g. 5"
                                            className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all"
                                        />
                                        {errors.yearsOfExperience && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.yearsOfExperience.message}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Expertise & Availability */}
                        <div className="lg:col-span-8 space-y-8">
                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                            <Briefcase className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                        Expertise & Qualifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-10">
                                    <div className="space-y-6">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                            <CheckCircle2 className="h-3 w-3" /> Select Your Professional Skills
                                        </Label>
                                        <div className="flex flex-wrap gap-3">
                                            {availableSkills.map(skill => (
                                                <div
                                                    key={skill}
                                                    onClick={() => toggleSkill(skill)}
                                                    className={`px-6 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all flex items-center gap-2 select-none border-2 ${selectedSkills?.includes(skill)
                                                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                                                        : 'bg-muted/30 border-transparent hover:bg-muted/50 text-muted-foreground'
                                                        }`}
                                                >
                                                    {selectedSkills?.includes(skill) && <Check className="h-4 w-4" />}
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-muted-foreground/10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" /> Available Days
                                                </Label>
                                                <Controller
                                                    name="availableDays"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            isMulti
                                                            options={dayOptions}
                                                            placeholder="Select days..."
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                            styles={{
                                                                control: (base, state) => ({
                                                                    ...base,
                                                                    borderRadius: '1rem',
                                                                    padding: '4px 8px',
                                                                    backgroundColor: 'rgba(243, 244, 246, 0.4)',
                                                                    border: 'none',
                                                                    boxShadow: state.isFocused ? '0 0 0 2px var(--primary)' : '0 0 0 1px hsl(var(--border))',
                                                                    '&:hover': {
                                                                        boxShadow: '0 0 0 2px var(--primary)'
                                                                    }
                                                                }),
                                                                multiValue: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: 'hsl(var(--primary))',
                                                                    borderRadius: '8px',
                                                                    color: 'white'
                                                                }),
                                                                multiValueLabel: (base) => ({
                                                                    ...base,
                                                                    color: 'white',
                                                                    fontWeight: '700',
                                                                    fontSize: '12px'
                                                                }),
                                                                multiValueRemove: (base) => ({
                                                                    ...base,
                                                                    color: 'white',
                                                                    '&:hover': {
                                                                        backgroundColor: 'transparent',
                                                                        color: 'rgba(255,255,255,0.8)'
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.availableDays && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">Please select at least one day</p>}
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Clock className="h-3 w-3" /> Daily Availability
                                                </Label>
                                                <Input
                                                    {...register('availableTime', { required: 'Time availability is required' })}
                                                    placeholder="e.g. 6:00 AM - 10:00 PM"
                                                    className="h-14 rounded-2xl bg-muted/40 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all"
                                                />
                                                {errors.availableTime && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase text-right">{errors.availableTime.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                            <Sparkles className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                        Additional Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Other Professional Background / Portfolio Links</Label>
                                        <Textarea
                                            {...register('otherInfo')}
                                            placeholder="Tell us about your certifications, past achievements, or anything else that makes you a great fit..."
                                            className="min-h-[160px] rounded-3xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all p-5 text-base leading-relaxed"
                                        />
                                    </div>

                                    <div className="pt-6">
                                        <Button
                                            type="submit"
                                            className="w-full h-18 rounded-2xl text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            disabled={loading || uploading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldCheck className="mr-3 h-6 w-6" />
                                                    Submit Application
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-center text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-60 flex items-center justify-center gap-2">
                                            <CheckCircle2 className="h-3 w-3" /> Status will be pending until admin review
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .react-select__menu { z-index: 50 !important; }
            ` }} />
        </div>
    );
};

export default BeATrainer;
