import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Shield, Rocket } from 'lucide-react';

const AboutSection = () => {
    const stats = [
        { icon: Trophy, label: 'Excellence', text: 'Top-rated facilities and expert certified trainers.' },
        { icon: Users, label: 'Community', text: 'A diverse and supportive network of fitness enthusiasts.' },
        { icon: Shield, label: 'Reliability', text: 'Consistent results backed by science-driven methods.' },
        { icon: Rocket, label: 'Innovation', text: 'The latest fitness technology and modern equipment.' }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/2 -z-10" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <span className="text-primary font-bold uppercase tracking-[0.3em] block mb-4">Our Legacy</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            Elevating Fitness to an <span className="text-primary italic">ART FORM.</span>
                        </h2>
                        <div className="space-y-6 text-muted-foreground text-lg leading-relaxed mb-10">
                            <p>
                                Founded in 2015, <span className="text-foreground font-bold italic">ANTIGRAVITY</span> was born from a simple yet powerful vision: to create a fitness environment that defies traditional limitations. We don't just provide equipment; we provide the blueprint for your physical and mental evolution.
                            </p>
                            <p>
                                Our mission is to empower every individual who walks through our doors to shatter their own glass ceilings. Through extreme dedication, elite coaching, and a community that never settles for average, we've helped thousands redefine what's possible for their bodies.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {stats.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground mb-1">{item.label}</h4>
                                        <p className="text-xs text-muted-foreground leading-snug">{item.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-primary/20 bg-card">
                            <img
                                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
                                alt="Organization History"
                                className="w-full h-[600px] object-cover transition-transform duration-700 hover:scale-110"
                            />
                            {/* Overlay tag */}
                            <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                                <p className="text-primary font-black text-2xl">EST. 2015</p>
                                <p className="text-white text-[10px] uppercase font-bold tracking-widest opacity-70">A Decade of Power</p>
                            </div>
                        </div>

                        {/* Decorative floating elements */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
