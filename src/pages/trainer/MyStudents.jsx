import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Loader2,
    Mail,
    Calendar,
    Dumbbell,
    Star,
    MessageSquare,
    User
} from 'lucide-react';

const MyStudents = () => {
    const { data: students, isLoading } = useQuery({
        queryKey: ['trainerStudents'],
        queryFn: async () => {
            const res = await api.get('/trainers/dashboard/students');
            return res.data.data.students;
        }
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <SectionHeader
                title="My Students"
                subtitle="Trainer Dashboard"
                description="Manage your student roster and monitor their training progress."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
                {students?.length > 0 ? (
                    students.map((student) => (
                        <Card key={student._id} className="rounded-[2.5rem] border-none shadow-xl shadow-black/5 bg-card group hover:scale-[1.02] transition-all overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-6 mb-8">
                                    <Avatar className="h-20 w-20 rounded-2xl border-4 border-background shadow-lg transition-transform group-hover:rotate-3">
                                        <AvatarImage src={student.photoURL} className="object-cover" />
                                        <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">
                                            {student.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <h4 className="text-xl font-black italic truncate">{student.name}</h4>
                                        <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mt-1">
                                            <Mail className="h-3 w-3" /> {student.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 rounded-2xl bg-muted/30">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Sessions</p>
                                        <p className="text-lg font-black flex items-center gap-2">
                                            <Dumbbell className="h-4 w-4 text-primary" /> {student.totalBookings}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/30">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Last Active</p>
                                        <p className="text-xs font-bold flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-primary" /> {new Date(student.lastBookingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 ml-1">Enrolled In</p>
                                    <div className="flex flex-wrap gap-2">
                                        {student.classes?.map((className, idx) => (
                                            <Badge key={idx} variant="secondary" className="rounded-xl px-3 py-1 font-bold text-[10px] uppercase border-none bg-primary/5 text-primary">
                                                {className}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-muted/5 rounded-[3rem] border-2 border-dashed border-muted/20">
                        <User className="h-16 w-16 text-muted mx-auto mb-4 opacity-10" />
                        <h3 className="text-xl font-black italic uppercase text-muted-foreground">No students yet</h3>
                        <p className="text-sm font-semibold opacity-40 mt-2">Open more slots to start growing your community!</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyStudents;
