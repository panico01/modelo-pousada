import React from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PlusCircle, Pencil, Trash2, Package } from "lucide-react";
import { Input } from "@/Components/ui/input";

export default function ProductIndex({ products, filters }) {

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('products.index'), { search: e.target.value }, { preserveState: true });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            router.delete(route('products.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Estoque e Produtos</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Catálogo de Produtos</CardTitle>
                            <Link href={route('products.create')}>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Novo Produto
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <Input
                                    placeholder="Buscar produto..."
                                    className="max-w-sm"
                                    defaultValue={filters.search}
                                    onKeyDown={handleSearch}
                                />
                            </div>

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>Preço</TableHead>
                                            <TableHead>Estoque</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                    Nenhum produto cadastrado.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            products.data.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell className="font-medium flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-gray-400" />
                                                        {product.name}
                                                    </TableCell>
                                                    <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <span className={product.stock < 5 ? "text-red-500 font-bold" : "text-green-600"}>
                                                            {product.stock} un.
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <Link href={route('products.edit', product.id)}>
                                                            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4 text-blue-600" /></Button>
                                                        </Link>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {/* Paginação aqui se necessário */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
