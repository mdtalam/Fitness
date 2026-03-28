import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, Settings, BarChart3, Shield, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CookiePolicy = () => {
    const cookieTypes = [
        {
            icon: Shield,
            title: "Essential Cookies",
            required: true,
            description: "These cookies are necessary for the website to function and cannot be disabled.",
            examples: [
                "Authentication and session management",
                "Security and fraud prevention",
                "Load balancing and performance",
                "User preferences (theme, language)"
            ]
        },
        {
            icon: BarChart3,
            title: "Analytics Cookies",
            required: false,
            description: "Help us understand how visitors interact with our website.",
            examples: [
                "Page views and navigation patterns",
                "Time spent on pages",
                "Click tracking and heatmaps",
                "Error tracking and debugging"
            ]
        },
        {
            icon: Settings,
            title: "Functional Cookies",
            required: false,
            description: "Enable enhanced functionality and personalization.",
            examples: [
                "Remember your login details",
                "Personalized content recommendations",
                "Video player preferences",
                "Chat widget functionality"
            ]
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-32 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                            <Cookie className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                            Cookie Policy
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Last updated: February 2, 2026
                        </p>
                    </div>

                    {/* Introduction */}
                    <Card className="p-8 mb-12 border-primary/20 bg-primary/5">
                        <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
                        <p className="text-lg leading-relaxed mb-4">
                            Cookies are small text files that are placed on your device when you visit our website.
                            They help us provide you with a better experience by remembering your preferences and
                            understanding how you use our platform.
                        </p>
                        <p className="text-lg leading-relaxed">
                            At <span className="font-bold text-primary">FitTracker</span>, we use cookies to enhance
                            your experience, analyze site traffic, and personalize content.
                        </p>
                    </Card>

                    {/* Cookie Types */}
                    <div className="space-y-8 mb-12">
                        {cookieTypes.map((type, index) => (
                            <motion.div
                                key={type.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-8 hover:shadow-xl transition-shadow">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <type.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black mb-2">{type.title}</h2>
                                                <p className="text-muted-foreground">{type.description}</p>
                                            </div>
                                        </div>
                                        {type.required ? (
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider shrink-0">
                                                Required
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider shrink-0">
                                                Optional
                                            </span>
                                        )}
                                    </div>
                                    <div className="ml-16">
                                        <h3 className="font-bold mb-3">Examples:</h3>
                                        <ul className="space-y-2">
                                            {type.examples.map((example, i) => (
                                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                    <span className="text-primary mt-1.5">•</span>
                                                    <span className="leading-relaxed">{example}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Managing Cookies */}
                    <Card className="p-8 mb-12">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <Settings className="w-6 h-6 text-primary" />
                            Managing Your Cookie Preferences
                        </h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                You have the right to decide whether to accept or reject cookies. You can exercise your
                                cookie preferences by:
                            </p>
                            <ul className="space-y-2 ml-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-primary mt-1.5">•</span>
                                    <span>Using our cookie consent banner when you first visit</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-primary mt-1.5">•</span>
                                    <span>Adjusting your browser settings to block or delete cookies</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-primary mt-1.5">•</span>
                                    <span>Using browser extensions for cookie management</span>
                                </li>
                            </ul>
                            <p className="pt-4">
                                <strong className="text-foreground">Note:</strong> Blocking essential cookies may affect
                                the functionality of our website and prevent you from using certain features.
                            </p>
                        </div>
                    </Card>

                    {/* Third-Party Cookies */}
                    <Card className="p-8 mb-12 bg-muted/50">
                        <h2 className="text-2xl font-black mb-4">Third-Party Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use services from trusted third parties that may set cookies on your device:
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1.5">•</span>
                                <span><strong className="text-foreground">Stripe:</strong> For secure payment processing</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1.5">•</span>
                                <span><strong className="text-foreground">Firebase:</strong> For authentication and analytics</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1.5">•</span>
                                <span><strong className="text-foreground">Google Analytics:</strong> For usage statistics (if enabled)</span>
                            </li>
                        </ul>
                    </Card>

                    {/* Contact */}
                    <Card className="p-8">
                        <h3 className="text-xl font-bold mb-2">Questions About Cookies?</h3>
                        <p className="text-muted-foreground mb-4">
                            If you have questions about our use of cookies, please contact us:
                        </p>
                        <a
                            href="mailto:privacy@fittracker.com"
                            className="text-primary font-bold hover:underline"
                        >
                            privacy@fittracker.com
                        </a>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default CookiePolicy;
