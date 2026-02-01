import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { DollarSign, Users, BedDouble, CalendarCheck } from "lucide-react"
import { Badge } from "@/Components/ui/badge";

export default function Dashboard({ stats, topProducts, recentReservations }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Visão Geral</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* 1. KPIs (Indicadores Chave) */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Faturamento (Mês)</CardTitle>
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">R$ {parseFloat(stats.revenueMonth).toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">Diárias + Consumo</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
                                <BedDouble className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.occupiedRooms} de {stats.totalRooms} quartos ocupados
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Check-ins Hoje</CardTitle>
                                <CalendarCheck className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.checkinsToday}</div>
                                <p className="text-xs text-muted-foreground">Chegadas previstas</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 2. Área Principal: Tabela Recente + Ranking */}
                    <div className="grid gap-4 md:grid-cols-7">

                        {/* Tabela de Reservas (Ocupa 4 colunas) */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Últimas Reservas</CardTitle>
                                <CardDescription>Movimentações recentes no hotel.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentReservations.map((res) => (
                                        <div key={res.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{res.guest.name}</span>
                                                <span className="text-sm text-gray-500">Quarto {res.room.number}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{res.status}</Badge>
                                                <span className="font-bold text-sm">R$ {parseFloat(res.total_amount).toFixed(0)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ranking de Produtos (Ocupa 3 colunas) */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Produtos Mais Vendidos</CardTitle>
                                <CardDescription>Itens mais consumidos do frigobar/extras.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProducts.length === 0 ? (
                                        <p className="text-sm text-gray-500">Nenhum consumo registrado.</p>
                                    ) : (
                                        topProducts.map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm mr-4">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">{item.product.name}</p>
                                                    <p className="text-xs text-muted-foreground">Total vendido</p>
                                                </div>
                                                <div className="font-bold">
                                                    {item.total_qty} un
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
