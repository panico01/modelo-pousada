<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::query();

        if ($search = $request->input('search')) {
            $query->where('number', 'like', "%{$search}%");
        }

        return Inertia::render('Rooms/Index', [
            'rooms' => $query->orderBy('number')->paginate(12)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Rooms/Form');
    }

    public function store(StoreRoomRequest $request)
    {
        Room::create($request->validated());
        return redirect()->route('rooms.index')->with('success', 'Quarto criado com sucesso!');
    }

    public function edit(Room $room)
    {
        return Inertia::render('Rooms/Form', [
            'room' => $room
        ]);
    }

    public function update(StoreRoomRequest $request, Room $room)
    {
        $room->update($request->validated());
        return redirect()->route('rooms.index')->with('success', 'Quarto atualizado!');
    }

    public function destroy(Room $room)
    {
        // Opcional: Impedir exclusão se tiver reservas futuras
        $room->delete();
        return redirect()->route('rooms.index')->with('success', 'Quarto removido.');
    }
}
