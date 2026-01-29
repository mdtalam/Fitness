import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ThumbsUp, ThumbsDown, MessageSquare, Eye, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Forum = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page, setPage] = React.useState(1);
    const limit = 6;

    const { data, isLoading } = useQuery({
        queryKey: ['forumPosts', page],
        queryFn: async () => {
            const response = await api.get(`/forum?page=${page}&limit=${limit}`);
            return response.data.data;
        },
    });

    const posts = data?.posts || [];
    const pagination = data?.pagination || { totalPages: 1, totalPosts: 0 };

    const voteMutation = useMutation({
        mutationFn: async ({ postId, voteType }) => {
            const response = await api.patch(`/forum/${postId}/vote`, { voteType });
            return response.data.data;
        },
        onSuccess: (data, variables) => {
            // Optimistically update the cache or just invalidate
            queryClient.invalidateQueries(['forumPosts']);
            toast.success(variables.voteType === 'up' ? 'Upvoted!' : 'Downvoted!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error voting');
        }
    });

    const handleVote = (postId, voteType) => {
        if (!user) {
            toast.error('Please login to vote');
            navigate('/login');
            return;
        }
        voteMutation.mutate({ postId, voteType });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen pt-16 pb-24 bg-muted/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <SectionHeader
                    subtitle="Community Hub"
                    title="Fitness Insights & Advice"
                    description="Join the conversation. Learn from experts and share your fitness journey with the community."
                />

                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : posts?.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-lg text-muted-foreground mb-6">No community posts yet. Be the first to start a conversation!</p>
                        <Button className="shadow-lg shadow-primary/20">Create First Post</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Sidebar / Stats Stub */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="p-8 rounded-3xl border bg-card shadow-sm">
                                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                                    Community Stats
                                </h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b">
                                        <span className="text-sm text-muted-foreground font-medium">Total Posts</span>
                                        <span className="text-lg font-bold text-foreground">{posts.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b">
                                        <span className="text-sm text-muted-foreground font-medium">Active Members</span>
                                        <span className="text-lg font-bold text-foreground">1.2k</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground font-medium">Weekly Engagement</span>
                                        <span className="text-lg font-bold text-primary">+24%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl border bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
                                <h4 className="text-xl font-bold mb-4 italic">Want to share your expertise?</h4>
                                <p className="text-primary-foreground/80 text-sm mb-8 leading-relaxed font-medium">
                                    Certified trainers can create educational content to build their authority in the community.
                                </p>
                                <Button variant="secondary" className="w-full py-6 font-bold tracking-tight shadow-xl shadow-black/10 transition-transform hover:scale-[1.02]">Apply as Trainer</Button>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={page}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-8"
                                >
                                    {posts.map((post, index) => (
                                        <motion.div
                                            key={post._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card className="group overflow-hidden border bg-card hover:bg-card/80 hover:shadow-2xl transition-all duration-300 rounded-[2rem] p-2 sm:p-4">
                                                <CardHeader className="p-4 flex flex-row items-center justify-between gap-4 sm:p-5 sm:pb-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-background shadow-md rounded-xl">
                                                            <AvatarImage src={post.authorDetails?.photoURL || post.authorId?.photoURL} />
                                                            <AvatarFallback className="bg-muted text-foreground text-[10px] font-bold rounded-xl italic">
                                                                {(post.authorDetails?.name || post.authorId?.name || post.authorName)?.charAt(0) || 'A'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <p className="text-xs sm:text-sm font-black tracking-tight group-hover:text-primary transition-colors">{post.authorDetails?.name || post.authorId?.name || post.authorName}</p>
                                                                {(post.authorDetails?.role === 'trainer' || post.authorId?.role === 'trainer' || post.authorRole === 'trainer' || post.authorDetails?.role === 'admin' || post.authorId?.role === 'admin' || post.authorRole === 'admin') && (
                                                                    <Badge className="bg-primary/10 text-primary text-[8px] px-1.5 py-0 border-none uppercase font-black tracking-tighter shadow-none">
                                                                        {post.authorDetails?.role || post.authorId?.role || post.authorRole}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                                                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : 'Recently'} ago
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="hidden sm:inline-flex rounded-md px-2 py-0.5 text-[8px] uppercase font-black border-dashed opacity-60">
                                                        {post.category}
                                                    </Badge>
                                                </CardHeader>
                                                <CardContent className="p-4 sm:p-5 pt-0">
                                                    {post.imageURL && (
                                                        <div className="mb-3 rounded-xl overflow-hidden border shadow-md">
                                                            <img
                                                                src={post.imageURL}
                                                                alt={post.title}
                                                                className="w-full h-40 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    )}
                                                    <h3 className="text-lg sm:text-xl font-black mb-2 tracking-tight leading-tight group-hover:translate-x-1 transition-transform">{post.title}</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed opacity-85">{post.content}</p>
                                                </CardContent>
                                                <CardFooter className="flex items-center justify-between border-t border-dashed mt-2 p-4 sm:p-6 bg-muted/5 group-hover:bg-muted/10 transition-colors">
                                                    <div className="flex items-center gap-4 sm:gap-6">
                                                        <div className="flex items-center bg-muted/20 rounded-full p-1 border">
                                                            <button
                                                                onClick={() => handleVote(post._id, 'up')}
                                                                disabled={voteMutation.isPending}
                                                                className={cn(
                                                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-primary/10",
                                                                    post.votedBy?.find(v => v.userId === user?._id && v.voteType === 'up')
                                                                        ? "text-primary bg-primary/10"
                                                                        : "text-muted-foreground"
                                                                )}
                                                            >
                                                                <ThumbsUp className={cn("h-4 w-4", post.votedBy?.find(v => v.userId === user?._id && v.voteType === 'up') && "fill-current")} />
                                                                <span>{post.upVotes || 0}</span>
                                                            </button>
                                                            <div className="w-[1px] h-4 bg-border mx-1"></div>
                                                            <button
                                                                onClick={() => handleVote(post._id, 'down')}
                                                                disabled={voteMutation.isPending}
                                                                className={cn(
                                                                    "p-1.5 rounded-full text-xs font-bold transition-all hover:bg-destructive/10",
                                                                    post.votedBy?.find(v => v.userId === user?._id && v.voteType === 'down')
                                                                        ? "text-destructive bg-destructive/10"
                                                                        : "text-muted-foreground"
                                                                )}
                                                            >
                                                                <ThumbsDown className={cn("h-4 w-4", post.votedBy?.find(v => v.userId === user?._id && v.voteType === 'down') && "fill-current")} />
                                                            </button>
                                                        </div>

                                                        <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                                                            <MessageSquare className="h-4 w-4" />
                                                            {post.comments?.length || 0}
                                                        </button>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="group/read text-primary font-black hover:bg-transparent px-0" asChild>
                                                        <Link to={`/forum/${post._id}`} className="flex items-center">
                                                            Read Full Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/read:translate-x-2" />
                                                        </Link>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {pagination.totalPages > 1 && (
                                <div className="pt-12 flex justify-center items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="rounded-2xl h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(pagination.totalPages)].map((_, i) => (
                                            <Button
                                                key={i + 1}
                                                variant={page === i + 1 ? "default" : "outline"}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={cn(
                                                    "h-12 w-12 rounded-2xl font-bold transition-all",
                                                    page === i + 1 ? "shadow-lg shadow-primary/20" : "border-2"
                                                )}
                                            >
                                                {i + 1}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === pagination.totalPages}
                                        className="rounded-2xl h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Forum;
