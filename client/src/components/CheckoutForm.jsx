import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/services/api';

const CheckoutForm = ({ price, trainerId, slotId, packageType, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (price > 0) {
            api.post('/payment/create-payment-intent', { amount: price, packageType })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error('Error creating payment intent:', err);
                    const msg = err.response?.data?.message || 'Could not initialize payment';
                    toast.error(msg);
                });
        }
    }, [price, packageType]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (card == null) return;

        setIsProcessing(true);
        setError(null);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setError(error.message);
            setIsProcessing(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                },
            },
        );

        if (confirmError) {
            setError(confirmError.message);
            setIsProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            // Confirm booking in backend
            try {
                await api.post('/payment/confirm-booking', {
                    trainerId,
                    slotId,
                    packageType,
                    amount: price,
                    paymentId: paymentIntent.id
                });
                onSuccess();
            } catch (err) {
                console.error('Error confirming booking:', err);
                toast.error('Payment succeeded but booking confirmation failed. Please contact support.');
            }
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#ffffff',
                                fontFamily: 'Inter, sans-serif',
                                '::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.4)',
                                },
                            },
                            invalid: {
                                color: '#ef4444',
                            },
                        },
                    }}
                />
            </div>

            {error && <div className="text-red-500 text-sm font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</div>}

            <Button
                type="submit"
                disabled={!stripe || !clientSecret || isProcessing}
                className="w-full h-20 rounded-[1.5rem] bg-white text-primary hover:bg-white/90 font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 text-lg transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50"
            >
                {isProcessing ? (
                    <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Processing...</>
                ) : (
                    <><Lock className="mr-3 h-6 w-6" /> Pay ${price}</>
                )}
            </Button>

            <div className="flex items-center justify-center gap-2 opacity-40">
                <Lock className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Encrypted Connection</span>
            </div>
        </form>
    );
};

export default CheckoutForm;
