import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft, Clock, Activity, Flame, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ClassDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: classItem, isLoading, error, isError } = useQuery({
        queryKey: ['class', id],
        queryFn: async () => {
            try {
                const response = await api.get(`/classes/${id}`);
                return response.data.data.class;
            } catch (err) {
                console.error('Class fetch error:', err);
                throw err;
            }
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container py-24 text-center">
                <h2 className="text-2xl font-bold text-red-500">Error loading class</h2>
                <p className="text-muted-foreground mt-2">{error.message}</p>
                <Button asChild className="mt-4">
                    <Link to="/classes">Back to Classes</Link>
                </Button>
            </div>
        );
    }

    if (!classItem) {
        return (
            <div className="container py-24 text-center">
                <h2 className="text-2xl font-bold">Class not found</h2>
                <Button asChild className="mt-4">
                    <Link to="/classes">Back to Classes</Link>
                </Button>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen pb-32 bg-background">
            {/* Hero Header */}
            <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={classItem.imageURL || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop'}
                        alt={classItem.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/40"></div>
                </motion.div>

                <div className="container relative h-full flex flex-col justify-between pb-12 pt-28 px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Button variant="ghost" size="sm" asChild className="w-fit hover:bg-white/10 text-white font-bold backdrop-blur-sm border border-white/10">
                            <Link to="/classes"> <ArrowLeft className="h-4 w-4 mr-2" /> Back to Classes </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl"
                    >
                        <motion.div variants={itemVariants}>
                            <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90 border-none text-sm font-black uppercase tracking-widest px-4 py-1.5 shadow-lg shadow-primary/20">
                                {classItem.difficulty}
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[0.9] drop-shadow-sm"
                        >
                            {classItem.name}
                        </motion.h1>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap gap-4 sm:gap-8 text-white/90 font-bold text-sm uppercase tracking-widest backdrop-blur-md bg-white/5 p-4 rounded-2xl border border-white/10 w-fit"
                        >
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" /> {classItem.duration} Mins
                            </span>
                            <div className="w-px h-4 bg-white/20 hidden sm:block"></div>
                            <span className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" /> {classItem.difficulty}
                            </span>
                            <div className="w-px h-4 bg-white/20 hidden sm:block"></div>
                            <span className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" /> <CountUp to={classItem.bookingCount} /> Joined
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="container mt-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Left Column: Description & Details */}
                    <div className="lg:col-span-8 space-y-16">
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                                <span className="text-primary/20 font-black italic text-4xl">01.</span>
                                About this Class
                            </h2>
                            <div className="prose prose-lg prose-slate max-w-none text-muted-foreground leading-relaxed">
                                {classItem.description}
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black flex items-center gap-4">
                                    <span className="text-primary/20 font-black italic text-4xl">02.</span>
                                    Key Benefits
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {classItem.benefits?.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -5 }}
                                        className="flex items-start gap-5 p-6 rounded-3xl bg-card border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                                    >
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary shadow-inner">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg mb-1">Targeted Result {index + 1}</p>
                                            <p className="text-muted-foreground leading-snug">{benefit}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                {(!classItem.benefits || classItem.benefits.length === 0) && (
                                    <p className="text-muted-foreground italic col-span-2 text-center py-8">No specific benefits listed for this class.</p>
                                )}
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Column: Trainers */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="sticky top-28"
                        >
                            <div className="p-8 rounded-[2.5rem] bg-card border shadow-2xl shadow-primary/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                <h2 className="text-2xl font-black mb-2 relative z-10">Instructors</h2>
                                <p className="text-muted-foreground text-sm mb-8 relative z-10 font-medium">
                                    Expert guidance for this session.
                                </p>

                                <div className="space-y-4 relative z-10">
                                    {classItem.trainers && classItem.trainers.length > 0 ? (
                                        classItem.trainers.map((trainer) => (
                                            <Card
                                                key={trainer._id}
                                                className="group cursor-pointer overflow-hidden border-transparent bg-muted/40 hover:bg-primary transition-all duration-500 p-4 flex items-center gap-4 hover:shadow-xl hover:shadow-primary/20"
                                                onClick={() => navigate(`/trainers/${trainer._id}`)}
                                            >
                                                <Avatar className="h-14 w-14 border-2 border-background ring-2 ring-primary/20 group-hover:ring-white/50 transition-all">
                                                    <AvatarImage src={trainer.photoURL} className="object-cover" />
                                                    <AvatarFallback className="bg-primary/20 text-primary group-hover:text-primary font-black">
                                                        {trainer.name?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0 space-y-0.5">
                                                    <h4 className="font-black truncate group-hover:text-white transition-colors text-lg">
                                                        {trainer.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-background/50 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                                            Trainer
                                                        </Badge>
                                                        <p className="text-xs text-muted-foreground group-hover:text-white/80 truncate font-bold">
                                                            View Profile
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-background/50 group-hover:bg-white/20 flex items-center justify-center transition-all group-hover:translate-x-1">
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                                                </div>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 bg-muted/30 rounded-3xl border border-dashed border-muted-foreground/20">
                                            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                            <p className="text-sm font-bold text-muted-foreground">No trainers assigned yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetail;
