<?php

// app/Http/Controllers/GuestController.php
namespace App\Http\Controllers;

use App\Models\Guest;
use App\Http\Requests\StoreGuestRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index(Request $request)
    {
        // Busca com filtro simples (pesquisa por nome ou documento)
        $query = Guest::query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('document', 'like', "%{$search}%");
        }

        return Inertia::render('Guests/Index', [
            'guests' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Guests/Form');
    }

    public function store(StoreGuestRequest $request)
    {
        Guest::create($request->validated());
        return redirect()->route('guests.index')->with('success', 'Hóspede cadastrado com sucesso!');
    }

    public function edit(Guest $guest)
    {
        return Inertia::render('Guests/Form', [
            'guest' => $guest
        ]);
    }

    public function update(StoreGuestRequest $request, Guest $guest)
    {
        $guest->update($request->validated());
        return redirect()->route('guests.index')->with('success', 'Hóspede atualizado!');
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();
        return redirect()->route('guests.index')->with('success', 'Hóspede removido.');
    }

    public function show(Guest $guest)
    {
        // Carrega as reservas do hóspede ordenadas pela mais recente
        $guest->load(['reservations.room']);

        return Inertia::render('Guests/Show', [
            'guest' => $guest
        ]);
    }
}
