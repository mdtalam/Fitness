import React from 'react';
import SectionHeader from '@/components/SectionHeader';
import { CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
    const benefits = [
        'Certified expert trainers with years of experience',
        'Customized workout plans tailored to your goals',
        'Modern facilities and premium equipment',
        'Supporative community of like-minded enthusiasts',
        'Detailed progress tracking and analytics',
        'Flexible scheduling that fits your busy life'
    ];

    return (
        <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative group">
                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 to-transparent blur-2xl transition-opacity opacity-0 group-hover:opacity-100"></div>
                        <img
                            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop"
                            alt="About Us"
                            className="relative rounded-3xl shadow-2xl border bg-card transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute -bottom-8 -right-8 bg-primary p-8 rounded-2xl shadow-2xl hidden md:block animate-in slide-in-from-right duration-700">
                            <p className="text-4xl font-black text-primary-foreground mb-1">10+</p>
                            <p className="text-xs font-bold text-primary-foreground uppercase tracking-wider opacity-80">Years Excellence</p>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div>
                        <SectionHeader
                            subtitle="Why Choose Us"
                            title="We Build Stronger Versions of You"
                            description="At FitTracker, we believe fitness is more than just exercise—it's a lifestyle transformation. Our holistic approach combines expert guidance with a supportive environment."
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                                    <span className="text-sm font-medium text-muted-foreground">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-6 mb-8">
                            "FitTracker hasn't just changed my body, it's changed my mindset. The trainers here are genuinely invested in your success."
                            <span className="block mt-2 font-bold text-foreground not-italic">— Sarah Mitchell, Elite Member</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
