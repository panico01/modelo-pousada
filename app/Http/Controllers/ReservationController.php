<?php

// app/Http/Controllers/ReservationController.php
namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Guest;
use App\Models\Room;
use App\Models\Product;
use App\Services\ReservationService;
use App\Http\Requests\StoreReservationRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;


class ReservationController extends Controller
{
    protected $service;

    public function __construct(ReservationService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $query = Reservation::with(['guest', 'room']);

        // Filtro por Status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Filtro por Data (Início e Fim baseados no Check-in)
        if ($dateStart = $request->input('date_start')) {
            $query->whereDate('check_in', '>=', $dateStart);
        }

        if ($dateEnd = $request->input('date_end')) {
            $query->whereDate('check_in', '<=', $dateEnd);
        }

        // Filtro por nome do hóspede (Search)
        if ($search = $request->input('search')) {
            $query->whereHas('guest', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Reservations/Index', [
            'reservations' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['status', 'date_start', 'date_end', 'search']),
        ]);
    }

    public function create()
    {
        // Enviamos apenas quartos disponíveis para o formulário
        return Inertia::render('Reservations/Create', [
            'guests' => Guest::orderBy('name')->get(['id', 'name', 'document']),
            'rooms' => Room::where('status', 'available')->orderBy('number')->get()
        ]);
    }

    public function store(StoreReservationRequest $request)
    {
        try {
            $this->service->createReservation($request->validated());
            return redirect()->route('reservations.index')->with('success', 'Reserva realizada com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['room_id' => $e->getMessage()]);
        }
    }

    // Método para cancelar (adicional simples)
    public function cancel(Reservation $reservation)
    {
        $this->service->cancelReservation($reservation);
        return back()->with('success', 'Reserva cancelada e quarto liberado.');
    }

    // Método para checkout (adicional simples)
    public function checkout(Reservation $reservation)
    {
        $this->service->checkOut($reservation);
        return back()->with('success', 'Check-out realizado. Quarto em limpeza.');
    }

    public function show(Reservation $reservation)
{
    // Carrega tudo que precisamos para a tela de detalhes
    $reservation->load(['guest', 'room', 'consumptions.product']);

    return Inertia::render('Reservations/Show', [
        'reservation' => $reservation,
        // Envia apenas produtos com estoque para o select
        'products' => Product::where('stock', '>', 0)->orderBy('name')->get()
    ]);
}

public function storeConsumption(Request $request, Reservation $reservation)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            $this->service->addConsumption(
                $reservation->id,
                $request->product_id,
                $request->quantity
            );
            return back()->with('success', 'Consumo lançado com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['quantity' => $e->getMessage()]);
        }
    }
}
