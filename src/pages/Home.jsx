import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlayCircle, ArrowRight, Users, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FeaturedClasses from '@/components/FeaturedClasses';
import AboutUs from '@/components/AboutUs';
import Newsletter from '@/components/Newsletter';
import LatestCommunity from '@/components/LatestCommunity';

const Home = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="relative isolate overflow-hidden">
            {/* Mega Hero Section */}
            <div className="relative min-h-[90vh] flex items-center pt-20">
                {/* Dynamic Background */}
                <motion.div
                    style={{ y: y1, opacity }}
                    className="absolute inset-0 -z-10"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background z-10"></div>
                    <img
                        src="/hero.png"
                        alt="Fitness Hero"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl"
                    >
                        <motion.div variants={itemVariants} className="mb-8 flex">
                            <div className="relative rounded-full px-4 py-1.5 text-sm font-bold leading-6 text-primary-foreground bg-primary/20 backdrop-blur-md border border-primary/30 shadow-2xl shadow-primary/20">
                                <span className="mr-2">🔥</span> Launch special: Get 20% off all annual plans.{' '}
                                <Link to="/classes" className="font-black underline underline-offset-4 ml-2 hover:text-white transition-colors">
                                    Join Now <ArrowRight className="inline-block h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white leading-[0.95] italic"
                        >
                            ELITE PERFORMANCE <br />
                            <span className="text-primary not-italic stroke-text flex flex-wrap gap-x-[0.1em]">
                                {"STARTS HERE.".split("").map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, y: 20, rotateX: -90 }}
                                        animate={{
                                            opacity: 1,
                                            y: [0, -8, 0],
                                            rotateX: 0,
                                            textShadow: [
                                                "0 0 0px var(--primary)",
                                                "0 0 15px var(--primary)",
                                                "0 0 0px var(--primary)"
                                            ],
                                            color: [
                                                "var(--primary)",
                                                "#fff",
                                                "var(--primary)"
                                            ]
                                        }}
                                        transition={{
                                            opacity: { duration: 0.6, delay: 0.8 + (index * 0.05) },
                                            rotateX: { duration: 0.6, delay: 0.8 + (index * 0.05) },
                                            y: {
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 1.5 + (index * 0.1)
                                            },
                                            textShadow: {
                                                duration: 2.5,
                                                repeat: Infinity,
                                                delay: 1.5 + (index * 0.1)
                                            },
                                            color: {
                                                duration: 5,
                                                repeat: Infinity,
                                                delay: 1.5 + (index * 0.1)
                                            }
                                        }}
                                        className="inline-block"
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                ))}
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-xl font-medium tracking-tight"
                        >
                            Expert coaching, world-class facilities, and a community that pushes you to your absolute limits. Your transformation is our mission.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center gap-5"
                        >
                            <Button size="lg" className="h-14 px-8 text-base font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 rounded-xl" asChild>
                                <Link to="/register">
                                    Start Journey <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-8 text-base font-black uppercase tracking-widest bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10 transition-all rounded-xl group" asChild>
                                <Link to="/classes" className="flex items-center gap-2">
                                    <PlayCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                                    Experience
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Floating Cards (Glassmorphism) */}
                    <div className="absolute right-0 bottom-0 hidden xl:flex flex-col gap-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="p-5 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-3 group hover:bg-white/20 transition-all pointer-events-auto cursor-default"
                        >
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Users className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                                <p className="text-xl font-black text-white leading-none">12K+</p>
                                <p className="text-[9px] uppercase font-bold tracking-widest text-white/50">Athletes</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="p-5 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center gap-3 mr-10 group hover:bg-white/20 transition-all pointer-events-auto cursor-default"
                        >
                            <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Star className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-black text-white leading-none">5.0</p>
                                <p className="text-[9px] uppercase font-bold tracking-widest text-white/50">Rating</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Stats />

            <AboutUs />

            <FeaturedClasses />

            <Newsletter />
            <LatestCommunity />
        </div>
    );
};

const Stats = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 rounded-3xl border bg-card/50 backdrop-blur-sm p-8 md:p-12 shadow-sm">
            {[
                { label: 'Trainers', value: '50+' },
                { label: 'Active Members', value: '10k+' },
                { label: 'Workout Classes', value: '120+' },
                { label: 'Success Stories', value: '5k+' },
            ].map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                    <p className="text-3xl font-extrabold text-primary mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
            ))}
        </div>
    </div>
);

export default Home;
