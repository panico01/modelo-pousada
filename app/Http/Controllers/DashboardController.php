<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Consumption;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        // 1. Estatísticas Rápidas
        $totalRooms = Room::count();
        $occupiedRooms = Room::where('status', 'occupied')->count();
        $occupancyRate = $totalRooms > 0 ? ($occupiedRooms / $totalRooms) * 100 : 0;

        // Faturamento (Simplificado: soma valor total de reservas criadas no mês)
        $revenueMonth = Reservation::where('created_at', '>=', $startOfMonth)->sum('total_amount');

        // Faturamento de Consumo no mês
        $consumptionMonth = Consumption::where('created_at', '>=', $startOfMonth)->sum('total_price');

        // 2. Ranking de Produtos (Top 5)
        $topProducts = Consumption::select('product_id', DB::raw('sum(quantity) as total_qty'))
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(5)
            ->with('product') // Traz o nome do produto
            ->get();

        // 3. Últimas Reservas
        $recentReservations = Reservation::with(['guest', 'room'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'occupancyRate' => round($occupancyRate, 1),
                'occupiedRooms' => $occupiedRooms,
                'totalRooms' => $totalRooms,
                'revenueMonth' => $revenueMonth + $consumptionMonth,
                'checkinsToday' => Reservation::whereDate('check_in', $today)->count(),
            ],
            'topProducts' => $topProducts,
            'recentReservations' => $recentReservations
        ]);
    }
}
