import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, Lock, User, Image, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        photoURL: '',
        role: 'member'
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (value) => {
        setFormData({ ...formData, role: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData.email, formData.password, formData.name, formData.photoURL, formData.role);
            toast.success('Account created successfully!');
            navigate(formData.role === 'admin' ? '/admin-dashboard' : formData.role === 'trainer' ? '/trainer-dashboard' : '/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[150px]"></div>
            </div>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-background/80 backdrop-blur-xl">
                    <CardHeader className="space-y-4 pt-12 pb-8 text-center bg-primary/5">
                        <div className="inline-flex justify-center mb-6">
                            <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 transform -rotate-3">
                                <User className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">Join Us</CardTitle>
                        <CardDescription className="text-base font-medium">Start your fitness transformation today</CardDescription>
                    </CardHeader>

                    <CardContent className="p-8 pb-4">
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="space-y-1">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                    <Input
                                        name="name"
                                        placeholder="Full Name"
                                        required
                                        className="pl-10 h-12 bg-muted/30 border-none ring-1 ring-border focus:ring-primary"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="relative">
                                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                    <Input
                                        name="photoURL"
                                        placeholder="Photo URL (Optional)"
                                        className="pl-10 h-12 bg-muted/30 border-none ring-1 ring-border focus:ring-primary"
                                        value={formData.photoURL}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Email address"
                                        required
                                        className="pl-10 h-12 bg-muted/30 border-none ring-1 ring-border focus:ring-primary"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50 z-10" />
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="Create Password"
                                        required
                                        className="pl-10 h-12 bg-muted/30 border-none ring-1 ring-border focus:ring-primary"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Select value={formData.role} onValueChange={handleRoleChange}>
                                    <SelectTrigger className="h-12 bg-muted/30 border-none ring-1 ring-border focus:ring-primary">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="trainer">Trainer</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] mt-4" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center pt-10 pb-10">
                                <span className="w-full border-t border-muted-foreground/10"></span>
                            </div>
                        </div>


                    </CardContent>

                    <CardFooter className="p-8 pt-0 flex justify-center border-t border-dashed mt-8">
                        <p className="text-sm text-muted-foreground font-medium mt-6">
                            Already a member?{' '}
                            <Link to="/login" className="text-primary font-black hover:underline inline-flex items-center gap-1 group">
                                Sign in instead <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Register;
