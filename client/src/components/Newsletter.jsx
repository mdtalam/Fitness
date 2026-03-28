import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

import api from '@/services/api';
import { Loader2 } from 'lucide-react';

const Newsletter = () => {
    const [email, setEmail] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await api.post('/newsletter/subscribe', { email });
            toast.success(response.data.message || 'Thanks for subscribing!');
            setEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error subscribing to newsletter');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative isolate overflow-hidden bg-primary px-6 py-16 shadow-2xl rounded-3xl sm:px-24 sm:py-24">
                    {/* Background Decor */}
                    <div className="absolute -top-24 -left-20 -z-10 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl opacity-50"></div>
                    <div className="absolute top-1/2 -right-20 -z-10 h-96 w-96 rounded-full bg-primary-foreground/5 blur-3xl opacity-50"></div>

                    <div className="mx-auto max-w-2xl text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles className="h-3 w-3" />
                            Join the inner circle
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                            Don't Miss a Single Beat.
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
                            Get exclusive workout tips, early access to new classes, and member-only rewards delivered straight to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className="mx-auto mt-10 flex max-w-md gap-x-4">
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <div className="relative flex-auto">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-50" />
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="min-w-0 w-full rounded-md border-0 bg-primary-foreground px-10 py-2 text-primary shadow-sm ring-1 ring-inset ring-primary-foreground/10 focus:ring-2 focus:ring-inset focus:ring-primary-foreground/50 sm:text-sm sm:leading-6"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="secondary"
                                className="shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-70"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Subscribing...
                                    </>
                                ) : (
                                    'Subscribe'
                                )}
                            </Button>
                        </form>
                        <p className="mt-4 text-xs text-primary-foreground/60 leading-relaxed">
                            We care about your data. Read our <a href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
