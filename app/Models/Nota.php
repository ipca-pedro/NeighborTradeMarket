<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $table = 'nota';
    protected $primaryKey = 'ID_Nota';
    public $timestamps = false;

    protected $fillable = [
        'Descricao_nota'
    ];

    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class, 'NotaID_Nota');
    }
}
