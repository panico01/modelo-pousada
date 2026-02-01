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

const productSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    price: z.string().or(z.number()).transform((val) => Number(val)),
    stock: z.string().or(z.number()).transform((val) => Number(val)),
});

export default function ProductForm({ product = null }) {
    const isEditing = !!product;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || '',
            price: product?.price || '',
            stock: product?.stock || '',
        }
    });

    const onSubmit = (data) => {
        if (isEditing) {
            router.put(route('products.update', product.id), data);
        } else {
            router.post(route('products.store'), data);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {isEditing ? `Editar Produto: ${product.name}` : 'Novo Produto'}
            </h2>}
        >
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados do Produto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                <div>
                                    <Label htmlFor="name">Nome do Produto</Label>
                                    <Input id="name" {...register('name')} placeholder="Ex: Coca-Cola Lata" />
                                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Preço Unitário (R$)</Label>
                                        <Input id="price" type="number" step="0.01" {...register('price')} placeholder="0.00" />
                                        {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
                                    </div>

                                    <div>
                                        <Label htmlFor="stock">Estoque Inicial</Label>
                                        <Input id="stock" type="number" {...register('stock')} placeholder="0" />
                                        {errors.stock && <span className="text-red-500 text-sm">{errors.stock.message}</span>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => router.visit(route('products.index'))}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        Salvar Produto
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
