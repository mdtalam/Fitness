import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Mail, Lock, Chrome, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            toast.success('Logged in with Google!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Google login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-background/80 backdrop-blur-xl">
                    <CardHeader className="space-y-4 pt-12 pb-8 text-center bg-primary/5">
                        <Link to="/" className="inline-flex justify-center mb-6 transition-transform hover:scale-110">
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                                <Lock className="h-7 w-7 text-primary-foreground" />
                            </div>
                        </Link>
                        <CardTitle className="text-3xl font-black tracking-tight">Login</CardTitle>
                        <CardDescription className="text-base font-medium">Access your fitness journey</CardDescription>
                    </CardHeader>

                    <CardContent className="p-8 pb-4">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        required
                                        className="pl-10 h-12 bg-muted/50 border-none ring-1 ring-border/50 focus:ring-primary"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        className="pl-10 h-12 bg-muted/50 border-none ring-1 ring-border/50 focus:ring-primary"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="text-right">
                                    <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                            </Button>
                        </form>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted-foreground/10"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-muted-foreground">
                                <span className="bg-background px-4">Or continue with</span>
                            </div>
                        </div>

                        <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-12 rounded-xl group transition-all hover:border-primary/30">
                            <Chrome className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" /> Google
                        </Button>
                    </CardContent>

                    <CardFooter className="p-8 pt-0 flex justify-center border-t border-dashed mt-8">
                        <p className="text-sm text-muted-foreground font-medium mt-6">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary font-black hover:underline inline-flex items-center gap-1 group">
                                Create one now <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Login;
