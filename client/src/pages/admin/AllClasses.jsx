import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const AllClasses = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = React.useState('');

    const { data: classes, isLoading } = useQuery({
        queryKey: ['adminClasses'],
        queryFn: async () => {
            const res = await api.get('/classes');
            return res.data.data.classes;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/classes/${id}`);
        },
        onSuccess: () => {
            toast.success('Class deleted successfully');
            queryClient.invalidateQueries(['adminClasses']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete class');
        }
    });

    const filteredClasses = classes?.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <SectionHeader
                    title="Manage Classes"
                    subtitle="Library"
                    description="View, edit, and delete fitness classes."
                    className="mb-0"
                />
                <Button onClick={() => navigate('/admin-dashboard/add-class')} className="gap-2 shrink-0">
                    <Plus className="h-4 w-4" /> Add New Class
                </Button>
            </div>

            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search classes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs border-none bg-transparent focus-visible:ring-0 px-0"
                    />
                </div>

                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead>Join Count</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClasses?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No classes found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClasses?.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>
                                                <img
                                                    src={item.imageURL}
                                                    alt={item.name}
                                                    className="h-12 w-20 object-cover rounded-md bg-muted"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="capitalize">
                                                    {item.difficulty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{item.bookingCount} students</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/admin-dashboard/classes/edit/${item._id}`)}
                                                    >
                                                        <Pencil className="h-4 w-4 text-blue-500" />
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the class
                                                                    "{item.name}" from the database.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => deleteMutation.mutate(item._id)}
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AllClasses;
