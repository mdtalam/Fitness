import React, { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft, Dumbbell, Image as ImageIcon, Info, Users, ShieldCheck, Sparkles, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { uploadImage } from '@/lib/upload';

const EditClass = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [difficulty, setDifficulty] = useState('beginner');
    const [selectedTrainers, setSelectedTrainers] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const { data: classData, isLoading: isLoadingClass } = useQuery({
        queryKey: ['class', id],
        queryFn: async () => {
            const res = await api.get(`/classes/${id}`);
            return res.data.data.class;
        }
    });

    const { data: trainersData, isLoading: isLoadingTrainers } = useQuery({
        queryKey: ['trainers'],
        queryFn: async () => {
            const res = await api.get('/trainers');
            return res.data.data.trainers;
        }
    });

    useEffect(() => {
        if (classData) {
            setValue('name', classData.name);
            setValue('description', classData.description);
            setValue('imageURL', classData.imageURL);
            setValue('requirements', classData.requirements || '');
            setDifficulty(classData.difficulty);
            setPreviewUrl(classData.imageURL);

            // Extract IDs from populated trainer objects
            if (classData.trainers && Array.isArray(classData.trainers)) {
                setSelectedTrainers(classData.trainers.map(t => typeof t === 'object' ? t._id : t));
            }
        }
    }, [classData, setValue]);

    const updateClassMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.put(`/classes/${id}`, {
                ...data,
                difficulty,
                trainers: selectedTrainers
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Class updated successfully!');
            queryClient.invalidateQueries(['classes']);
            queryClient.invalidateQueries(['class', id]);
            queryClient.invalidateQueries(['adminClasses']);
            navigate('/admin-dashboard/classes');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update class');
        }
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        setUploading(true);
        try {
            const url = await uploadImage(file);
            setValue('imageURL', url);
            toast.success('Image updated successfully!');
        } catch (error) {
            toast.error('Failed to upload image. Please try again.');
            setPreviewUrl(classData?.imageURL || '');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = (data) => {
        updateClassMutation.mutate(data);
    };

    const toggleTrainer = (trainerId) => {
        setSelectedTrainers(prev =>
            prev.includes(trainerId) ? prev.filter(t => t !== trainerId) : [...prev, trainerId]
        );
    };

    if (isLoadingClass) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                className="max-w-5xl mx-auto"
            >
                <div className="mb-8 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/admin-dashboard/classes')} className="gap-2 hover:bg-primary/5 rounded-xl transition-all">
                        <ArrowLeft className="h-4 w-4" /> Back to Library
                    </Button>
                </div>

                <div className="mb-12">
                    <SectionHeader
                        title="Refine the Experience"
                        subtitle="Edit Class"
                        description={`Updating details for "${classData?.name}"`}
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Side: Basic Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                            <Dumbbell className="h-6 w-6 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black uppercase tracking-tight">Essential Details</CardTitle>
                                            <CardDescription>Core information of the fitness class.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Class Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Zen Morning Vinyasa"
                                            className="h-14 rounded-2xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all text-lg font-medium"
                                            {...register('name', { required: 'Class name is required' })}
                                        />
                                        {errors.name && <p className="text-xs text-red-500 font-bold ml-1">{errors.name.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Class Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe the flow, energy, and results..."
                                            className="min-h-[160px] rounded-3xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all p-5 text-base leading-relaxed"
                                            {...register('description', { required: 'Description is required' })}
                                        />
                                        {errors.description && <p className="text-xs text-red-500 font-bold ml-1">{errors.description.message}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                            <Sparkles className="h-6 w-6 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black uppercase tracking-tight">Media & Intensity</CardTitle>
                                            <CardDescription>Visuals and intensity configurations.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                <ImageIcon className="h-3 w-3" /> Class Image
                                            </Label>
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`relative h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${previewUrl ? 'border-primary/50' : 'border-muted-foreground/20 hover:border-primary/50 bg-muted/30'
                                                    }`}
                                            >
                                                {previewUrl ? (
                                                    <>
                                                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                            <div className="flex flex-col items-center text-white">
                                                                <Camera className="h-8 w-8 mb-2" />
                                                                <span className="text-xs font-bold uppercase tracking-widest">Change Photo</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center text-muted-foreground">
                                                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                                                            {uploading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <ImageIcon className="h-6 w-6" />}
                                                        </div>
                                                        <p className="text-sm font-bold">Click to upload image</p>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            <input type="hidden" {...register('imageURL', { required: 'Please upload an image' })} />
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Sparkles className="h-3 w-3" /> Difficulty Level
                                                </Label>
                                                <Select value={difficulty} onValueChange={setDifficulty}>
                                                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-none shadow-2xl ring-1 ring-black/5 p-2">
                                                        <SelectItem value="beginner" className="rounded-xl focus:bg-primary/5 focus:text-primary">Beginner</SelectItem>
                                                        <SelectItem value="intermediate" className="rounded-xl focus:bg-primary/5 focus:text-primary">Intermediate</SelectItem>
                                                        <SelectItem value="advanced" className="rounded-xl focus:bg-primary/5 focus:text-primary">Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="requirements" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                                    <Info className="h-3 w-3" /> Requirements & Gear
                                                </Label>
                                                <Input
                                                    id="requirements"
                                                    placeholder="e.g. High-grip mat, Yoga blocks..."
                                                    className="h-12 rounded-xl bg-muted/50 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all"
                                                    {...register('requirements')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Side: Trainer Selection */}
                        <div className="space-y-8">
                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden sticky top-24">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                            <Users className="h-6 w-6 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black uppercase tracking-tight">Assign Trainers</CardTitle>
                                            <CardDescription>Instructors for this class.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    {isLoadingTrainers ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Available Champions</p>
                                            {trainersData?.map(trainer => (
                                                <div
                                                    key={trainer._id}
                                                    onClick={() => toggleTrainer(trainer._id)}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedTrainers.includes(trainer._id)
                                                            ? 'border-primary bg-primary/5 shadow-inner'
                                                            : 'border-transparent bg-muted/30 hover:bg-muted/50'
                                                        }`}
                                                >
                                                    <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0">
                                                        <img src={trainer.user?.photoURL} alt={trainer.user?.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-bold truncate">{trainer.user?.name}</p>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">
                                                            {trainer.skills?.slice(0, 2).join(' • ')}
                                                        </p>
                                                    </div>
                                                    {selectedTrainers.includes(trainer._id) && (
                                                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                                            <Sparkles className="h-3 w-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="pt-8">
                                        <Button
                                            type="submit"
                                            className="w-full h-16 rounded-[1.25rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            disabled={updateClassMutation.isPending || uploading}
                                        >
                                            {updateClassMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : uploading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldCheck className="mr-2 h-5 w-5" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </motion.div>
        </DashboardLayout>
    );
};

export default EditClass;
