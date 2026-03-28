import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, ThumbsUp, Loader2 } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';

const LatestCommunity = () => {
    const { data: posts, isLoading } = useQuery({
        queryKey: ['latestForumPosts'],
        queryFn: async () => {
            const response = await api.get('/forum?limit=3');
            return response.data.data.posts;
        },
    });

    return (
        <section className="py-24 bg-card/30 backdrop-blur-3xl overflow-hidden">
            <div className="container mx-auto px-4">
                <SectionHeader
                    subtitle="Our Community"
                    title="Latest Insights from Experts"
                    description="Stay updated with the latest trends and advice from our community of fitness trainers and enthusiasts."
                />

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {posts?.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/forum/${post._id}`}>
                                    <Card className="h-full group hover:shadow-2xl transition-all duration-500 border rounded-[2.5rem] overflow-hidden bg-background">
                                        <CardHeader className="p-0">
                                            {post.imageURL ? (
                                                <div className="aspect-[16/10] overflow-hidden">
                                                    <img
                                                        src={post.imageURL}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                    <div className="h-16 w-16 rounded-3xl bg-primary/20 flex items-center justify-center">
                                                        <MessageSquare className="h-8 w-8 text-primary" />
                                                    </div>
                                                </div>
                                            )}
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                    {post.category}
                                                </span>
                                                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground opacity-60">
                                                    <div className="flex items-center gap-1">
                                                        <ThumbsUp className="h-3 w-3" />
                                                        {post.upVotes || 0}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MessageSquare className="h-3 w-3" />
                                                        {post.comments?.length || 0}
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black mb-3 leading-tight tracking-tight group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center text-xs font-black uppercase tracking-widest text-primary group-hover:gap-2 transition-all">
                                                Read More <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <Button size="lg" className="rounded-full px-12 h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all" asChild>
                        <Link to="/forum">Explore Full Forum</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default LatestCommunity;
