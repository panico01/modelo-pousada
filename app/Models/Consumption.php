<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consumption extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'unit_price_snapshot' => 'decimal:2',
        'total_price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    /**
     * Relacionamento: Este consumo pertence a UMA reserva específica.
     */
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * Relacionamento: Este consumo se refere a UM produto específico.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
