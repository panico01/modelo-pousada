import React from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge"; // Certifique-se de ter instalado (npx shadcn-ui@latest add badge)
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PlusCircle, Pencil, Trash2, BedDouble } from "lucide-react";

// Mapa de Cores/Estilos dos Badges
const statusMap = {
    available: { label: 'Disponível', variant: 'default', className: 'bg-green-600 hover:bg-green-700' },
    occupied: { label: 'Ocupado', variant: 'destructive', className: '' }, // Vermelho padrão do destructive
    cleaning: { label: 'Limpeza', variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    maintenance: { label: 'Manutenção', variant: 'outline', className: 'text-gray-500 border-gray-500' },
};

export default function RoomIndex({ rooms }) {

    const handleDelete = (id) => {
        if (confirm('Excluir este quarto?')) {
            router.delete(route('rooms.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Acomodações</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Gestão de Quartos</CardTitle>
                            <Link href={route('rooms.create')}>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Novo Quarto
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>

                            {/* Grid de Cards em vez de Tabela (Mais visual para Quartos) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {rooms.data.map((room) => {
                                    const status = statusMap[room.status] || statusMap.available;

                                    return (
                                        <div key={room.id} className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-slate-100 rounded-full">
                                                        <BedDouble className="h-5 w-5 text-slate-600" />
                                                    </div>
                                                    <span className="font-bold text-lg">#{room.number}</span>
                                                </div>
                                                <Badge variant={status.variant} className={status.className}>
                                                    {status.label}
                                                </Badge>
                                            </div>

                                            <div className="text-sm text-gray-500 mb-4">
                                                <p>{room.type}</p>
                                                <p className="font-semibold text-gray-900">R$ {parseFloat(room.price_per_night).toFixed(2)} / dia</p>
                                            </div>

                                            <div className="flex gap-2 mt-auto pt-4 border-t">
                                                <Link href={route('rooms.edit', room.id)} className="w-full">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Pencil className="h-3 w-3 mr-2" /> Editar
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(room.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {rooms.data.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    Nenhum quarto cadastrado.
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
