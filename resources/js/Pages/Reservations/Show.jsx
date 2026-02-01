import React from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function ReservationShow({ reservation, products }) {
    // Form para adicionar consumo
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        quantity: 1
    });

    const handleAddConsumption = (e) => {
        e.preventDefault();
        post(route('reservations.consumption.store', reservation.id), {
            onSuccess: () => reset()
        });
    };

    // Cálculos de totais
    const totalConsumo = reservation.consumptions.reduce((acc, item) => acc + parseFloat(item.total_price), 0);
    const totalDiarias = parseFloat(reservation.total_amount);
    const totalGeral = totalDiarias + totalConsumo;

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestão da Reserva #{reservation.id}</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Botão Voltar */}
                    <Button variant="outline" onClick={() => router.visit(route('reservations.index'))}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista
                    </Button>

                    {/* Cabeçalho e Informações Básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Informações do Hóspede</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <p><span className="font-bold">Nome:</span> {reservation.guest.name}</p>
                                <p><span className="font-bold">Doc:</span> {reservation.guest.document}</p>
                                <p><span className="font-bold">Email:</span> {reservation.guest.email || 'Não informado'}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Informações da Estadia</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <p><span className="font-bold">Quarto:</span> {reservation.room.number} ({reservation.room.type})</p>
                                <p><span className="font-bold">Status:</span> {reservation.status.toUpperCase()}</p>
                                <p><span className="font-bold">Diárias (Total):</span> R$ {totalDiarias.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Área de Consumo */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Coluna Esquerda: Lista de Itens Consumidos */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Extrato de Consumo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>Qtd</TableHead>
                                            <TableHead>Unitário</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservation.consumptions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                                                    Nenhum consumo lançado nesta reserva.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            reservation.consumptions.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.product.name}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>R$ {parseFloat(item.unit_price_snapshot).toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-medium">R$ {parseFloat(item.total_price).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Coluna Direita: Adicionar Novo Item + Resumo Final */}
                        <div className="space-y-6">

                            {/* Formulário de Adicionar Consumo */}
                            <Card className={reservation.status !== 'confirmed' ? 'opacity-50 pointer-events-none' : ''}>
                                <CardHeader>
                                    <CardTitle className="text-sm">Lançar Novo Item</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAddConsumption} className="space-y-4">
                                        <div>
                                            <Select onValueChange={(val) => setData('product_id', val)} value={data.product_id}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o produto" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.length === 0 ? (
                                                        <SelectItem value="none" disabled>Sem produtos no estoque</SelectItem>
                                                    ) : (
                                                        products.map((p) => (
                                                            <SelectItem key={p.id} value={String(p.id)}>
                                                                {p.name} (R$ {parseFloat(p.price).toFixed(2)})
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.product_id && <span className="text-red-500 text-xs">{errors.product_id}</span>}
                                        </div>

                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                min="1"
                                                value={data.quantity}
                                                onChange={e => setData('quantity', e.target.value)}
                                                placeholder="Qtd"
                                                className="w-20"
                                            />
                                            <Button type="submit" disabled={processing} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                                <Plus className="w-4 h-4 mr-2" /> Adicionar
                                            </Button>
                                        </div>
                                        {errors.quantity && <span className="text-red-500 text-xs">{errors.quantity}</span>}
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Card de Fechamento da Conta */}
                            <Card className="bg-slate-900 text-white border-none">
                                <CardHeader>
                                    <CardTitle>Total a Pagar</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Diárias</span>
                                        <span>R$ {totalDiarias.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Consumo</span>
                                        <span>R$ {totalConsumo.toFixed(2)}</span>
                                    </div>
                                    <Separator className="bg-slate-700 my-2" />
                                    <div className="flex justify-between text-xl font-bold text-green-400">
                                        <span>Total</span>
                                        <span>R$ {totalGeral.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
