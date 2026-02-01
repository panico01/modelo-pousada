import React from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Eye, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import dayjs from 'dayjs';

// --- ADICIONE ESTAS LINHAS QUE FALTAVAM ---
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const getStatusBadge = (status) => {
    switch(status) {
        case 'confirmed': return <Badge className="bg-blue-600">Confirmada</Badge>;
        case 'completed': return <Badge className="bg-green-600">Concluída</Badge>;
        case 'cancelled': return <Badge variant="destructive">Cancelada</Badge>;
        default: return <Badge variant="outline">Pendente</Badge>;
    }
};

export default function ReservationIndex({ reservations }) {

    const handleCheckout = (id) => {
        if(confirm('Confirmar Check-out e liberar quarto para limpeza?')) {
            router.post(route('reservations.checkout', id));
        }
    };

    const handleCancel = (id) => {
        if(confirm('Tem certeza que deseja cancelar esta reserva?')) {
            router.post(route('reservations.cancel', id));
        }
    };

    const [searchParams, setSearchParams] = React.useState({
        status: new URLSearchParams(window.location.search).get('status') || 'all',
        date_start: new URLSearchParams(window.location.search).get('date_start') || '',
        date_end: new URLSearchParams(window.location.search).get('date_end') || '',
        search: new URLSearchParams(window.location.search).get('search') || '',
    });

    // Função que dispara a busca no Laravel
    const applyFilters = () => {
        const params = {};
        if (searchParams.status && searchParams.status !== 'all') params.status = searchParams.status;
        if (searchParams.date_start) params.date_start = searchParams.date_start;
        if (searchParams.date_end) params.date_end = searchParams.date_end;
        if (searchParams.search) params.search = searchParams.search;

        router.get(route('reservations.index'), params, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reservas</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4">
                    {/* BARRA DE FILTROS */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                                {/* Busca por Nome */}
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Buscar Hóspede</label>
                                    <Input
                                        placeholder="Nome..."
                                        value={searchParams.search}
                                        onChange={(e) => setSearchParams({...searchParams, search: e.target.value})}
                                    />
                                </div>

                                {/* Filtro de Status */}
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Status</label>
                                    <Select
                                        value={searchParams.status}
                                        onValueChange={(val) => setSearchParams({...searchParams, status: val})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="pending">Pendente</SelectItem>
                                            <SelectItem value="confirmed">Confirmada</SelectItem>
                                            <SelectItem value="completed">Concluída</SelectItem>
                                            <SelectItem value="cancelled">Cancelada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Data Início */}
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Data Check-in (De)</label>
                                    <Input
                                        type="date"
                                        value={searchParams.date_start}
                                        onChange={(e) => setSearchParams({...searchParams, date_start: e.target.value})}
                                    />
                                </div>

                                {/* Botão Filtrar */}
                                <div>
                                    <Button className="w-full" onClick={applyFilters}>Filtrar Resultados</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Histórico de Reservas</CardTitle>
                            <Link href={route('reservations.create')}>
                                <Button>Nova Reserva</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Quarto</TableHead>
                                        <TableHead>Hóspede</TableHead>
                                        <TableHead>Check-in / Check-out</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservations.data.map((res) => (
                                        <TableRow key={res.id}>
                                            <TableCell className="font-medium">#{res.room.number}</TableCell>
                                            <TableCell>{res.guest.name}</TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {dayjs(res.check_in).format('DD/MM/YYYY')} <br/>
                                                até {dayjs(res.check_out).format('DD/MM/YYYY')}
                                            </TableCell>
                                            <TableCell>R$ {parseFloat(res.total_amount).toFixed(2)}</TableCell>
                                            <TableCell>{getStatusBadge(res.status)}</TableCell>

                                            {/* CÉLULA DE AÇÕES UNIFICADA */}
                                            <TableCell className="text-right space-x-2">

                                                {/* Botão Gerenciar (Leva para o Show) */}
                                                <Link href={route('reservations.show', res.id)}>
                                                    <Button size="sm" variant="default" className="bg-slate-800 hover:bg-slate-700">
                                                        <ShoppingBag className="w-4 h-4 mr-2" /> Gerenciar
                                                    </Button>
                                                </Link>

                                                {/* Ações Extras (Só aparecem se confirmada) */}
                                                {res.status === 'confirmed' && (
                                                    <>
                                                        <Button size="sm" variant="outline" onClick={() => handleCheckout(res.id)}>
                                                            Check-out
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleCancel(res.id)}>
                                                            Cancelar
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
