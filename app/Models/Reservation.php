<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Reservation extends Model
{
        protected $guarded = [];

        protected $casts = [
            'check_in' => 'date',
            'check_out' => 'date',
        ];

        public function guest(): BelongsTo { return $this->belongsTo(Guest::class); }
        public function room(): BelongsTo { return $this->belongsTo(Room::class); }
        public function consumptions(): HasMany { return $this->hasMany(Consumption::class); }
}
