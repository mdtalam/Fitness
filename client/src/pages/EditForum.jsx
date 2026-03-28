import React, { useRef, useState, useEffect } from 'react';
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
import { Loader2, ArrowLeft, FileText, Image as ImageIcon, Sparkles, Save, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { uploadImage } from '@/lib/upload';

const EditForum = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [category, setCategory] = useState('General');
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    const { data: post, isLoading: isLoadingPost } = useQuery({
        queryKey: ['forumPost', id],
        queryFn: async () => {
            const response = await api.get(`/forum/${id}`);
            return response.data.data.post;
        },
    });

    useEffect(() => {
        if (post) {
            reset({
                title: post.title,
                content: post.content,
                imageURL: post.imageURL
            });
            setCategory(post.category);
            setPreviewUrl(post.imageURL);
        }
    }, [post, reset]);

    const editForumMutation = useMutation({
        mutationFn: async (data) => {
            const res = await api.patch(`/forum/${id}`, {
                ...data,
                category
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Forum post updated successfully!');
            queryClient.invalidateQueries(['forumPosts']);
            queryClient.invalidateQueries(['manageForumPosts']);
            queryClient.invalidateQueries(['forumPost', id]);
            navigate(-1);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update forum post');
        }
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        setUploading(true);
        try {
            const url = await uploadImage(file);
            setValue('imageURL', url);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            toast.error('Failed to upload image. Please try again.');
            setPreviewUrl(post?.imageURL || '');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = (data) => {
        editForumMutation.mutate(data);
    };

    if (isLoadingPost) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
                className="max-w-4xl mx-auto"
            >
                <div className="mb-8 items-center justify-between flex">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 hover:bg-primary/5 rounded-xl transition-all">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                </div>

                <div className="mb-12">
                    <SectionHeader
                        title="Refine Your Message"
                        subtitle="Edit Forum Post"
                        description="Polishing your insights ensures the community gets the best version of your knowledge."
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                            <FileText className="h-6 w-6 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black uppercase tracking-tight">Post Content</CardTitle>
                                            <CardDescription>Edit your story or advice.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Post Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. 5 Myths About Cardio"
                                            className="h-14 rounded-2xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all text-lg font-bold"
                                            {...register('title', { required: 'Title is required' })}
                                        />
                                        {errors.title && <p className="text-xs text-red-500 font-bold ml-1">{errors.title.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Content</Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Write your detailed post content here..."
                                            className="min-h-[250px] rounded-3xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all p-5 text-base leading-relaxed"
                                            {...register('content', { required: 'Content is required' })}
                                        />
                                        {errors.content && <p className="text-xs text-red-500 font-bold ml-1">{errors.content.message}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-8">
                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
                                <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                                    <CardTitle className="text-xl font-black uppercase tracking-tight">Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                                        <Select value={category} onValueChange={setCategory}>
                                            <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl ring-1 ring-black/5 p-2">
                                                <SelectItem value="Tips & Advice" className="rounded-xl focus:bg-primary/5 focus:text-primary">Tips & Advice</SelectItem>
                                                <SelectItem value="Success Stories" className="rounded-xl focus:bg-primary/5 focus:text-primary">Success Stories</SelectItem>
                                                <SelectItem value="Questions" className="rounded-xl focus:bg-primary/5 focus:text-primary">Questions</SelectItem>
                                                <SelectItem value="General" className="rounded-xl focus:bg-primary/5 focus:text-primary">General</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Cover Image</Label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`relative h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${previewUrl ? 'border-primary/50' : 'border-muted-foreground/20 hover:border-primary/50 bg-muted/30'
                                                }`}
                                        >
                                            {previewUrl ? (
                                                <>
                                                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <Camera className="h-8 w-8 text-white" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-muted-foreground">
                                                    {uploading ? (
                                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="h-8 w-8 mb-2" />
                                                            <p className="text-xs font-bold">Add Photo</p>
                                                        </>
                                                    )}
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
                                        <input type="hidden" {...register('imageURL')} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        disabled={editForumMutation.isPending || uploading}
                                    >
                                        {editForumMutation.isPending ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" /> Save Changes
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </motion.div>
        </DashboardLayout>
    );
};

export default EditForum;
