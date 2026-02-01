<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Garante que o preço venha sempre formatado corretamente
    protected $casts = [
        'price_per_night' => 'decimal:2',
    ];

    // Relacionamento: Um quarto tem várias reservas ao longo do tempo
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    // Escopo: Para usar Room::available()->get();
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }
}
