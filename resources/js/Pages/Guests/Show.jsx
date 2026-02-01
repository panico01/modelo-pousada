import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ArrowLeft, User } from 'lucide-react';

export default function GuestShow({ guest }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfil do Hóspede</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Cartão de Dados Pessoais */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 rounded-full">
                                    <User className="w-8 h-8 text-slate-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{guest.name}</CardTitle>
                                    <p className="text-muted-foreground">{guest.email}</p>
                                </div>
                            </div>
                            <Link href={route('guests.index')}>
                                <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar</Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <span className="font-bold block text-sm text-gray-500">Documento</span>
                                <span className="text-lg">{guest.document}</span>
                            </div>
                            <div>
                                <span className="font-bold block text-sm text-gray-500">Telefone</span>
                                <span className="text-lg">{guest.phone}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Histórico de Reservas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Hospedagem</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Quarto</TableHead>
                                        <TableHead>Valor Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {guest.reservations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-gray-500">
                                                Nenhuma reserva encontrada para este hóspede.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        guest.reservations.map((res) => (
                                            <TableRow key={res.id}>
                                                <TableCell>
                                                    {dayjs(res.check_in).format('DD/MM/YYYY')}
                                                </TableCell>
                                                <TableCell>Quarto {res.room.number}</TableCell>
                                                <TableCell>R$ {parseFloat(res.total_amount).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{res.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={route('reservations.show', res.id)}>
                                                        <Button size="sm" variant="ghost">Ver Detalhes</Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
