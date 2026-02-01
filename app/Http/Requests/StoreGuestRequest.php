<?php

// app/Http/Requests/StoreGuestRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuestRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        // Pega o ID se for edição (para ignorar o unique do próprio usuário)
        $guestId = $this->route('guest') ? $this->route('guest')->id : null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'document' => ['required', 'string', 'unique:guests,document,' . $guestId],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
        ];
    }

    public function messages()
    {
        return [
            'document.unique' => 'Este documento já está cadastrado.',
            'required' => 'Este campo é obrigatório.'
        ];
    }
}
