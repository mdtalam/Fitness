import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, Camera, Loader2, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const { user, login } = useAuth(); // Re-using login to update local state is a hack, better to have a generic updateUser or refetch
    // But since useAuth syncs from local storage, we can manually update local storage and state.
    // For now, let's assume we can update local state manually or refresh.

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Upload to ImgBB
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                const photoURL = data.data.url;

                // Update implementation in backend
                await api.put('/users/profile', { photoURL });

                // Update local storage and context (simplified)
                const updatedUser = { ...user, photoURL };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.location.reload(); // Simple reload to reflect changes in context

                toast.success('Profile photo updated!');
            } else {
                toast.error('Failed to upload image');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const name = formData.get('name');

        try {
            await api.put('/users/profile', { name });

            // Update local storage
            const updatedUser = { ...user, name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload(); // Simple reload to reflect changes

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            await api.put('/users/change-password', {
                currentPassword,
                newPassword
            });
            toast.success('Password changed successfully!');
            e.target.reset();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <SectionHeader
                title="Your Profile"
                subtitle="Account Settings"
                description="Manage your personal information and account preferences."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="lg:col-span-1 rounded-3xl border-none shadow-xl bg-card overflow-hidden h-fit">
                    <div className="bg-primary/10 h-32 relative"></div>
                    <div className="px-6 relative">
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                            <div className="relative group cursor-pointer" onClick={handleImageClick}>
                                <Avatar className="h-32 w-32 border-4 border-background shadow-xl rounded-2xl transition-opacity group-hover:opacity-80">
                                    {user?.photoURL && <AvatarImage src={user.photoURL} className="object-cover" />}
                                    <AvatarFallback className="text-4xl font-black bg-muted text-primary">
                                        {user?.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-2xl">
                                    <Camera className="h-8 w-8 text-white drop-shadow-lg" />
                                </div>
                                <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 rounded-xl shadow-lg h-10 w-10 pointer-events-none">
                                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    </div>
                    <CardContent className="pt-20 pb-8 text-center space-y-2">
                        <h2 className="text-2xl font-black tracking-tight">{user?.name}</h2>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                            {user?.role || 'Member'}
                        </div>
                        <p className="text-sm text-muted-foreground pt-2">{user?.email}</p>
                    </CardContent>
                </Card>

                {/* Details Form */}
                <Card className="lg:col-span-2 rounded-3xl border-none shadow-xl bg-card">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                        <CardDescription>Update your profile details here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                        <Input id="name" name="name" defaultValue={user?.name} className="pl-10 h-11 bg-muted/30 border-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                        <Input id="email" defaultValue={user?.email} disabled className="pl-10 h-11 bg-muted/30 border-none opacity-70" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Account Role</Label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                        <Input id="role" defaultValue={user?.role} disabled className="pl-10 h-11 bg-muted/30 border-none opacity-70 capitalize" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="font-bold shadow-lg shadow-primary/20" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Change Form */}
                <Card className="lg:col-span-3 rounded-3xl border-none shadow-xl bg-card">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Security</CardTitle>
                        <CardDescription>Manage your account password.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Current Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                        <Input id="currentPassword" name="currentPassword" type="password" required className="pl-10 h-11 bg-muted/30 border-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-xs font-black uppercase tracking-widest text-muted-foreground">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                        <Input id="newPassword" name="newPassword" type="password" required className="pl-10 h-11 bg-muted/30 border-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                        <Input id="confirmPassword" name="confirmPassword" type="password" required className="pl-10 h-11 bg-muted/30 border-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" variant="destructive" className="font-bold shadow-lg shadow-destructive/20" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
