import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, UserX, Scale, CreditCard, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

const TermsOfService = () => {
    const sections = [
        {
            icon: UserX,
            title: "Account Terms",
            content: [
                "You must be 18 years or older to use this service",
                "You are responsible for maintaining account security",
                "One person or legal entity per account",
                "You must provide accurate and complete information",
                "Notify us immediately of any unauthorized use"
            ]
        },
        {
            icon: CreditCard,
            title: "Payment & Billing",
            content: [
                "All fees are in USD and non-refundable unless stated",
                "Subscription fees are billed in advance",
                "You authorize us to charge your payment method",
                "Cancellations take effect at the end of billing period",
                "We reserve the right to change pricing with notice"
            ]
        },
        {
            icon: Shield,
            title: "User Conduct",
            content: [
                "Use the service only for lawful purposes",
                "Do not harass, abuse, or harm other users",
                "Do not share inappropriate content",
                "Respect intellectual property rights",
                "Follow trainer instructions and safety guidelines"
            ]
        },
        {
            icon: AlertCircle,
            title: "Liability & Disclaimers",
            content: [
                "Fitness activities carry inherent risks",
                "Consult a physician before starting any program",
                "We are not liable for injuries during workouts",
                "Service provided 'as is' without warranties",
                "Maximum liability limited to fees paid"
            ]
        },
        {
            icon: Scale,
            title: "Termination",
            content: [
                "We may suspend or terminate accounts for violations",
                "You may cancel your account at any time",
                "Termination does not waive payment obligations",
                "We reserve the right to refuse service",
                "Certain provisions survive termination"
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
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Last updated: February 2, 2026
                        </p>
                    </div>

                    {/* Introduction */}
                    <Card className="p-8 mb-12 border-primary/20 bg-primary/5">
                        <p className="text-lg leading-relaxed mb-4">
                            Welcome to <span className="font-bold text-primary">FitTracker</span>. By accessing or using
                            our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                        </p>
                        <p className="text-lg leading-relaxed">
                            If you do not agree with any of these terms, you are prohibited from using or accessing this site.
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

                    {/* Additional Terms */}
                    <Card className="p-8 mt-12">
                        <h2 className="text-2xl font-black mb-6">Additional Terms</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                <strong className="text-foreground">Intellectual Property:</strong> All content, features,
                                and functionality are owned by FitTracker and protected by international copyright, trademark,
                                and other intellectual property laws.
                            </p>
                            <p>
                                <strong className="text-foreground">Modifications:</strong> We reserve the right to modify
                                these terms at any time. Continued use of the service constitutes acceptance of modified terms.
                            </p>
                            <p>
                                <strong className="text-foreground">Governing Law:</strong> These terms are governed by
                                the laws of the jurisdiction in which FitTracker operates, without regard to conflict of law provisions.
                            </p>
                        </div>
                    </Card>

                    {/* Contact */}
                    <Card className="p-8 mt-12 bg-muted/50">
                        <h3 className="text-xl font-bold mb-2">Questions About These Terms?</h3>
                        <p className="text-muted-foreground mb-4">
                            If you have any questions about our Terms of Service, please contact us:
                        </p>
                        <a
                            href="mailto:legal@fittracker.com"
                            className="text-primary font-bold hover:underline"
                        >
                            legal@fittracker.com
                        </a>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
