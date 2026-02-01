import React, { useEffect, useState } from 'react';
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
import dayjs from 'dayjs';

const reservationSchema = z.object({
    guest_id: z.string().min(1, "Selecione um hóspede"),
    room_id: z.string().min(1, "Selecione um quarto"),
    check_in: z.string().min(1, "Data de entrada obrigatória"),
    check_out: z.string().min(1, "Data de saída obrigatória"),
});

export default function CreateReservation({ guests, rooms }) { // <--- RECEBE GUESTS E ROOMS
    const [totalEstimate, setTotalEstimate] = useState(0);
    const [daysCount, setDaysCount] = useState(0);

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(reservationSchema),
    });

    // Observar mudanças para calcular preço em tempo real
    const selectedRoomId = watch('room_id');
    const checkInDate = watch('check_in');
    const checkOutDate = watch('check_out');

    useEffect(() => {
        if (selectedRoomId && checkInDate && checkOutDate) {
            // Verifica se rooms existe antes de buscar
            if(rooms && rooms.length > 0) {
                const room = rooms.find(r => String(r.id) === String(selectedRoomId));
                const start = dayjs(checkInDate);
                const end = dayjs(checkOutDate);

                if (room && end.isAfter(start)) {
                    let diff = end.diff(start, 'day');
                    if (diff < 1) diff = 1;

                    setDaysCount(diff);
                    setTotalEstimate(diff * parseFloat(room.price_per_night));
                } else {
                    setTotalEstimate(0);
                    setDaysCount(0);
                }
            }
        }
    }, [selectedRoomId, checkInDate, checkOutDate, rooms]);

    const handleSelectChange = (field, value) => setValue(field, value);

    const onSubmit = (data) => {
        router.post(route('reservations.store'), data);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nova Reserva</h2>}
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados da Estadia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label>Hóspede</Label>
                                    <Select onValueChange={(val) => handleSelectChange('guest_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o hóspede..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* SE GUESTS FOR UNDEFINED, AQUI DARIA ERRO SE ESTIVESSE NO ARQUIVO ERRADO */}
                                            {guests && guests.map((g) => (
                                                <SelectItem key={g.id} value={String(g.id)}>{g.name} (Doc: {g.document})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.guest_id && <span className="text-red-500 text-sm">{errors.guest_id.message}</span>}
                                </div>

                                <div>
                                    <Label>Quarto Disponível</Label>
                                    <Select onValueChange={(val) => handleSelectChange('room_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Escolha o quarto..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms && rooms.length > 0 ? (
                                                rooms.map((r) => (
                                                    <SelectItem key={r.id} value={String(r.id)}>
                                                        Quarto {r.number} ({r.type}) - R$ {parseFloat(r.price_per_night).toFixed(2)}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="none" disabled>Sem quartos disponíveis</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.room_id && <span className="text-red-500 text-sm">{errors.room_id.message}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Check-in</Label>
                                        <Input type="date" {...register('check_in')} />
                                        {errors.check_in && <span className="text-red-500 text-sm">{errors.check_in.message}</span>}
                                    </div>
                                    <div>
                                        <Label>Check-out</Label>
                                        <Input type="date" {...register('check_out')} />
                                        {errors.check_out && <span className="text-red-500 text-sm">{errors.check_out.message}</span>}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                                    Confirmar Reserva
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* (Omiti a parte do resumo lateral para brevidade, mas ela vai aqui) */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
