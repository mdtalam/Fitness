import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, Database, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: Database,
            title: "Information We Collect",
            content: [
                "Personal information (name, email, phone number) when you register",
                "Payment information processed securely through Stripe",
                "Profile data including fitness goals and preferences",
                "Usage data and interaction with our platform",
                "Device information and IP addresses for security"
            ]
        },
        {
            icon: Lock,
            title: "How We Use Your Information",
            content: [
                "To provide and maintain our fitness services",
                "To process your bookings and payments",
                "To communicate with you about classes and updates",
                "To improve our platform and user experience",
                "To ensure security and prevent fraud"
            ]
        },
        {
            icon: Shield,
            title: "Data Protection",
            content: [
                "We use industry-standard encryption (SSL/TLS)",
                "Payment data is handled by PCI-compliant Stripe",
                "Regular security audits and monitoring",
                "Access controls and authentication measures",
                "Secure data storage with MongoDB Atlas"
            ]
        },
        {
            icon: Eye,
            title: "Information Sharing",
            content: [
                "We do NOT sell your personal information",
                "Trainers see only booking-related information",
                "Third-party services (Stripe, Firebase) as necessary",
                "Legal compliance when required by law",
                "Your consent for any other sharing"
            ]
        },
        {
            icon: UserCheck,
            title: "Your Rights",
            content: [
                "Access your personal data at any time",
                "Request correction of inaccurate information",
                "Delete your account and associated data",
                "Export your data in a portable format",
                "Opt-out of marketing communications"
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
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Last updated: February 2, 2026
                        </p>
                    </div>

                    {/* Introduction */}
                    <Card className="p-8 mb-12 border-primary/20 bg-primary/5">
                        <p className="text-lg leading-relaxed">
                            At <span className="font-bold text-primary">FitTracker</span>, we take your privacy seriously.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                            you use our fitness tracking platform. Please read this policy carefully.
                        </p>
                    </Card>

                    {/* Sections */}
                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-8 hover:shadow-xl transition-shadow">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <section.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h2 className="text-2xl font-black mt-2">{section.title}</h2>
                                    </div>
                                    <ul className="space-y-3 ml-16">
                                        {section.content.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                <span className="text-primary mt-1.5">•</span>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact */}
                    <Card className="p-8 mt-12 bg-muted/50">
                        <div className="flex items-start gap-4">
                            <Mail className="w-6 h-6 text-primary mt-1" />
                            <div>
                                <h3 className="text-xl font-bold mb-2">Questions About Privacy?</h3>
                                <p className="text-muted-foreground mb-4">
                                    If you have any questions or concerns about our privacy practices, please contact us:
                                </p>
                                <a
                                    href="mailto:privacy@fittracker.com"
                                    className="text-primary font-bold hover:underline"
                                >
                                    privacy@fittracker.com
                                </a>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
