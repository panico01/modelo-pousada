import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

const roomSchema = z.object({
    number: z.string().min(1, "Número é obrigatório"),
    type: z.string().min(1, "Selecione o tipo"),
    price_per_night: z.string().or(z.number()).transform((val) => Number(val)), // Converte para número
    status: z.string().min(1, "Status é obrigatório"),
});

export default function RoomForm({ room = null }) {
    const isEditing = !!room;

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            number: room?.number || '',
            type: room?.type || 'Standard',
            price_per_night: room?.price_per_night || '',
            status: room?.status || 'available',
        }
    });

    // Necessário para o componente Select do Shadcn funcionar com o React Hook Form
    const handleSelectChange = (field, value) => {
        setValue(field, value);
    };

    const onSubmit = (data) => {
        if (isEditing) {
            router.put(route('rooms.update', room.id), data);
        } else {
            router.post(route('rooms.store'), data);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {isEditing ? `Editar Quarto ${room.number}` : 'Novo Quarto'}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do Acomodação</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="number">Número / Nome do Quarto</Label>
                                        <Input id="number" {...register('number')} placeholder="Ex: 101" />
                                        {errors.number && <span className="text-red-500 text-sm">{errors.number.message}</span>}
                                    </div>

                                    <div>
                                        <Label>Tipo</Label>
                                        <Select onValueChange={(val) => handleSelectChange('type', val)} defaultValue={watch('type')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Standard">Standard</SelectItem>
                                                <SelectItem value="Luxo">Luxo</SelectItem>
                                                <SelectItem value="Suíte Master">Suíte Master</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Preço da Diária (R$)</Label>
                                        <Input id="price" type="number" step="0.01" {...register('price_per_night')} placeholder="0.00" />
                                        {errors.price_per_night && <span className="text-red-500 text-sm">{errors.price_per_night.message}</span>}
                                    </div>

                                    <div>
                                        <Label>Status Atual</Label>
                                        <Select onValueChange={(val) => handleSelectChange('status', val)} defaultValue={watch('status')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Disponível</SelectItem>
                                                <SelectItem value="occupied">Ocupado</SelectItem>
                                                <SelectItem value="cleaning">Limpeza</SelectItem>
                                                <SelectItem value="maintenance">Manutenção</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <span className="text-red-500 text-sm">{errors.status.message}</span>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => router.visit(route('rooms.index'))}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        Salvar
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
