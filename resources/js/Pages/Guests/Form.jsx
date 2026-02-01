import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

// Schema de Validação (Frontend)
const guestSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    document: z.string().min(1, "Documento é obrigatório"),
    email: z.string().email("Email inválido").optional().or(z.literal('')),
    phone: z.string().min(1, "Telefone é obrigatório"),
});

export default function GuestForm({ guest = null }) {
    const isEditing = !!guest;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(guestSchema),
        defaultValues: {
            name: guest?.name || '',
            document: guest?.document || '',
            email: guest?.email || '',
            phone: guest?.phone || '',
        }
    });

    const onSubmit = (data) => {
        if (isEditing) {
            router.put(route('guests.update', guest.id), data);
        } else {
            router.post(route('guests.store'), data);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {isEditing ? 'Editar Hóspede' : 'Novo Hóspede'}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{isEditing ? `Editando: ${guest.name}` : 'Dados do Hóspede'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                <div>
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input id="name" {...register('name')} placeholder="Ex: João Silva" />
                                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="document">CPF / Passaporte</Label>
                                        <Input id="document" {...register('document')} placeholder="000.000.000-00" />
                                        {errors.document && <span className="text-red-500 text-sm">{errors.document.message}</span>}
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Telefone</Label>
                                        <Input id="phone" {...register('phone')} placeholder="(11) 99999-9999" />
                                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email (Opcional)</Label>
                                    <Input id="email" type="email" {...register('email')} placeholder="cliente@email.com" />
                                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => router.visit(route('guests.index'))}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Salvando...' : 'Salvar Hóspede'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
