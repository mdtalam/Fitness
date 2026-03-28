import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, ThumbsUp, ThumbsDown, MessageSquare, ArrowLeft, Share2, Clock, Calendar, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const PostDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = React.useState('');

    // Check if we came from manage forums page
    const fromManage = location.state?.from === 'manage';

    const { data: post, isLoading, error } = useQuery({
        queryKey: ['forumPost', id],
        queryFn: async () => {
            const response = await api.get(`/forum/${id}`);
            return response.data.data.post;
        },
    });

    const voteMutation = useMutation({
        mutationFn: async ({ voteType }) => {
            const response = await api.patch(`/forum/${id}/vote`, { voteType });
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['forumPost', id]);
            queryClient.invalidateQueries(['forumPosts']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error voting');
        }
    });

    const handleVote = (voteType) => {
        if (!user) {
            toast.error('Please login to vote');
            navigate('/login');
            return;
        }
        voteMutation.mutate({ voteType });
    };

    const commentMutation = useMutation({
        mutationFn: async (text) => {
            const response = await api.post(`/forum/${id}/comments`, { text });
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['forumPost', id]);
            toast.success('Comment added!');
            setCommentText('');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error adding comment');
        }
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to comment');
            navigate('/login');
            return;
        }
        if (!commentText.trim()) return;
        commentMutation.mutate(commentText);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24">
                <p className="text-xl font-bold text-destructive mb-4">Post not found</p>
                <Button asChild>
                    <Link to="/forum">Back to Forum</Link>
                </Button>
            </div>
        );
    }

    const userVote = post.votedBy?.find(v => v.userId === user?._id)?.voteType;

    return (
        <div className="min-h-screen pt-24 pb-24 bg-muted/5">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto px-4 max-w-4xl"
            >
                <Button
                    variant="ghost"
                    className="mb-8 hover:bg-transparent -ml-2 text-muted-foreground hover:text-primary transition-colors font-bold"
                    onClick={() => navigate(fromManage ? '/dashboard/manage-forums' : '/forum')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> {fromManage ? 'Back to Manage' : 'Back to Feed'}
                </Button>

                <article className="space-y-8">
                    {/* Header Section */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-none">
                                {post.category}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] text-foreground">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between py-6 border-y border-dashed">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-xl rounded-2xl">
                                    <AvatarImage src={post.author?.photoURL || post.authorDetails?.photoURL} />
                                    <AvatarFallback className="bg-muted text-foreground text-lg font-black italic">
                                        {(post.author?.name || post.authorDetails?.name)?.charAt(0) || 'A'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-black tracking-tight">{post.author?.name || post.authorDetails?.name}</p>
                                        {(post.author?.role === 'trainer' || post.authorDetails?.role === 'trainer' || post.author?.role === 'admin' || post.authorDetails?.role === 'admin' || post.authorRole === 'trainer' || post.authorRole === 'admin') && (
                                            <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0 border-none uppercase font-black tracking-tighter">
                                                {post.author?.role || post.authorDetails?.role || post.authorRole}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                        {post.author?.role || post.authorDetails?.role || 'Member'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="rounded-2xl border-2 hover:bg-primary hover:text-primary-foreground transition-all">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    {post.imageURL && (
                        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-black/5">
                            <img src={post.imageURL} alt={post.title} className="object-cover w-full h-full" />
                        </div>
                    )}

                    <div className="prose prose-xl dark:prose-invert max-w-none">
                        <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-medium">
                            {post.content}
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-12 border-t border-dashed">
                        <div className="flex items-center justify-between bg-card border rounded-[2rem] p-4 sm:p-6 shadow-xl shadow-black/5">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-muted/20 rounded-full p-1.5 border">
                                    <button
                                        onClick={() => handleVote('up')}
                                        disabled={voteMutation.isPending}
                                        className={cn(
                                            "flex items-center gap-3 px-6 py-2.5 rounded-full text-sm font-black transition-all",
                                            userVote === 'up'
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                        )}
                                    >
                                        <ThumbsUp className={cn("h-5 w-5", userVote === 'up' && "fill-current")} />
                                        <span>{post.upVotes || 0}</span>
                                    </button>
                                    <div className="w-[1px] h-6 bg-border mx-2"></div>
                                    <button
                                        onClick={() => handleVote('down')}
                                        disabled={voteMutation.isPending}
                                        className={cn(
                                            "p-2.5 rounded-full transition-all",
                                            userVote === 'down'
                                                ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20"
                                                : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                        )}
                                    >
                                        <ThumbsDown className={cn("h-5 w-5", userVote === 'down' && "fill-current")} />
                                    </button>
                                </div>

                                <div className="hidden sm:flex items-center gap-2 text-muted-foreground px-4 py-2 bg-muted/10 rounded-full font-bold text-sm">
                                    <MessageSquare className="h-4 w-4" />
                                    {post.comments?.length || 0} Comments
                                </div>
                            </div>

                            <div className="hidden md:flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest opacity-40">
                                <Clock className="h-4 w-4" />
                                5 Min Read
                            </div>
                        </div>
                    </div>
                </article>

                {/* Comments Section */}
                <div className="pt-16 space-y-12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black tracking-tight">
                            Discussions <span className="text-primary italic">({post.comments?.length || 0})</span>
                        </h2>
                    </div>

                    {/* Comment Form */}
                    <Card className="rounded-[2rem] border overflow-hidden shadow-2xl shadow-primary/5">
                        <CardContent className="p-6">
                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                <Textarea
                                    placeholder={user ? "Share your thoughts or ask a question..." : "Please login to join the discussion"}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    disabled={!user || commentMutation.isPending}
                                    className="min-h-[120px] rounded-2xl bg-muted/30 border-none ring-1 ring-border focus:ring-2 focus:ring-primary transition-all p-4 text-base resize-none"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={!user || !commentText.trim() || commentMutation.isPending}
                                        className="rounded-xl px-8 h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        {commentMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" /> Post Comment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {post.comments && post.comments.length > 0 ? (
                            [...post.comments].reverse().map((comment, index) => (
                                <motion.div
                                    key={comment.id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group"
                                >
                                    <Card className="rounded-[2rem] border-none bg-card/50 hover:bg-card transition-colors shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex gap-4">
                                                <Avatar className="h-10 w-10 ring-2 ring-background rounded-xl">
                                                    <AvatarImage src={comment.userPhoto} />
                                                    <AvatarFallback className="font-bold bg-muted">
                                                        {comment.userName?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-black text-sm">{comment.userName}</p>
                                                            <div className="h-1 w-1 rounded-full bg-muted-foreground opacity-30"></div>
                                                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">
                                                                {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                                                        {comment.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-muted/5 rounded-[2rem] border-2 border-dashed">
                                <MessageSquare className="h-10 w-10 text-muted-foreground opacity-20 mx-auto mb-4" />
                                <p className="text-muted-foreground font-bold">No discussions yet. Be the first to break the silence!</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PostDetail;
