import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Pencil,
    Trash2,
    Loader2,
    Eye,
    MessageSquare,
    ThumbsUp,
    Calendar,
    Search
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ManageForums = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [postToDelete, setPostToDelete] = useState(null);

    const isAdmin = user?.role === 'admin';
    const userId = user?.id || user?._id; // Support both id and _id

    const { data, isLoading, error } = useQuery({
        queryKey: ['manageForumPosts', userId, user?.role],
        queryFn: async () => {
            if (!userId) {
                return [];
            }

            // Admins see all posts to manage, trainers see only their own
            const url = isAdmin
                ? '/forum?limit=100'
                : `/forum?authorId=${userId}&limit=100`;

            const response = await api.get(url);

            return response.data.data.posts;
        },
        enabled: !!userId
    });

    const deleteMutation = useMutation({
        mutationFn: async (postId) => {
            await api.delete(`/forum/${postId}`);
        },
        onSuccess: () => {
            toast.success('Post deleted successfully');
            queryClient.invalidateQueries(['manageForumPosts']);
            queryClient.invalidateQueries(['forumPosts']);
            setPostToDelete(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error deleting post');
        }
    });

    const filteredPosts = data?.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <SectionHeader
                        title="Community Governance"
                        subtitle="Manage Forum Posts"
                        description={isAdmin ? "Oversee all community discussions and maintain quality." : "Manage your contributions and keep your insights updated."}
                    />
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-12 rounded-2xl bg-card border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-card rounded-[2.5rem] border shadow-2xl shadow-black/5 overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">Summoning your content...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-black mb-2">No posts found</h3>
                            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">It seems there are no posts matching your search or quest items yet.</p>
                            <Button asChild className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest">
                                <Link to="/dashboard/add-forum">Create Your First Post</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 border-none hover:bg-muted/30">
                                        <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Post Info</TableHead>
                                        <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Engagement</TableHead>
                                        <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                                        <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPosts.map((post) => (
                                        <TableRow key={post._id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                                            <TableCell className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    {post.imageURL ? (
                                                        <img src={post.imageURL} alt={post.title} className="h-14 w-14 rounded-2xl object-cover ring-1 ring-border shadow-sm" />
                                                    ) : (
                                                        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
                                                            <MessageSquare className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="max-w-xs md:max-w-md">
                                                        <h4 className="font-black text-base truncate mb-1 group-hover:text-primary transition-colors">{post.title}</h4>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold">
                                                            <Badge variant="outline" className="text-[10px] font-black border-primary/20 bg-primary/5 text-primary tracking-tighter rounded-lg">
                                                                {post.category}
                                                            </Badge>
                                                            <div className="flex items-center gap-1.5 opacity-60">
                                                                <Calendar className="h-3 w-3" />
                                                                {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-8">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                                            <ThumbsUp className="h-3 w-3" /> Upvotes
                                                        </div>
                                                        <p className="text-lg font-black">{post.upVotes || 0}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                                            <MessageSquare className="h-3 w-3" /> Comments
                                                        </div>
                                                        <p className="text-lg font-black">{post.comments?.length || 0}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-8">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">Author</p>
                                                    <p className="text-xs font-bold">{post.authorName}</p>
                                                    <span className="text-[9px] font-black uppercase tracking-tighter text-primary">{post.authorRole}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all" asChild>
                                                        <Link to={`/forum/${post._id}`} state={{ from: 'manage' }}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-amber-500/10 hover:text-amber-500 transition-all" asChild>
                                                        <Link to={`/dashboard/edit-forum/${post._id}`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
                                                        onClick={() => setPostToDelete(post)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
                <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl max-w-md p-8">
                    <AlertDialogHeader>
                        <div className="h-16 w-16 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6">
                            <Trash2 className="h-8 w-8 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight">Vanish Post Forever?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium leading-relaxed">
                            Are you certain you wish to delete <span className="text-foreground font-black italic">"{postToDelete?.title}"</span>? This action is irreversible and the knowledge will be lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8">
                        <AlertDialogCancel className="h-14 rounded-2xl border-none bg-muted hover:bg-muted font-black uppercase tracking-widest">Wait, Go Back</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteMutation.mutate(postToDelete?._id)}
                            className="h-14 rounded-2xl bg-destructive hover:bg-destructive shadow-xl shadow-destructive/20 font-black uppercase tracking-widest"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Yes, Delete It'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
};

export default ManageForums;
