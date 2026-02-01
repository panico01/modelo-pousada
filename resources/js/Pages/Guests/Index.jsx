import React from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PlusCircle, Pencil, Trash2, Search, Eye } from "lucide-react"; // Adicionei o Eye aqui
import { Input } from "@/Components/ui/input";

export default function GuestIndex({ guests, filters }) {

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('guests.index'), { search: e.target.value }, { preserveState: true });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este hóspede?')) {
            router.delete(route('guests.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Hóspedes</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Lista de Hóspedes</CardTitle>
                            <Link href={route('guests.create')}>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Novo Hóspede
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center gap-2">
                                <Search className="h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Buscar por nome ou documento (Enter para buscar)..."
                                    className="max-w-sm"
                                    defaultValue={filters.search}
                                    onKeyDown={handleSearch}
                                />
                            </div>

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Documento</TableHead>
                                            <TableHead>Telefone</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guests.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                    Nenhum hóspede encontrado.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            // AQUI COMEÇA O LOOP (Onde 'guest' é definido)
                                            guests.data.map((guest) => (
                                                <TableRow key={guest.id}>
                                                    <TableCell className="font-medium">{guest.name}</TableCell>
                                                    <TableCell>{guest.document}</TableCell>
                                                    <TableCell>{guest.phone}</TableCell>

                                                    {/* Coluna de Ações */}
                                                    <TableCell className="text-right flex justify-end gap-2">

                                                        {/* Botão Ver Histórico */}
                                                        <Link href={route('guests.show', guest.id)}>
                                                            <Button variant="ghost" size="icon" title="Ver Histórico">
                                                                <Eye className="h-4 w-4 text-slate-600" />
                                                            </Button>
                                                        </Link>

                                                        {/* Botão Editar */}
                                                        <Link href={route('guests.edit', guest.id)}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4 text-blue-600" />
                                                            </Button>
                                                        </Link>

                                                        {/* Botão Excluir */}
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(guest.id)}>
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Paginação */}
                            <div className="mt-4 flex justify-end gap-2">
                                {guests.links.map((link, i) => (
                                    link.url ? (
                                        <Link key={i} href={link.url}>
                                            <Button
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </Link>
                                    ) : (
                                        <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="text-gray-400 px-3 py-2 text-sm" />
                                    )
                                ))}
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
