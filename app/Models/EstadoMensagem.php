<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoMensagem extends Model
{
    protected $table = 'Status_Mensagem';
    protected $primaryKey = 'ID_Status_Mensagem';
    public $timestamps = false;

    protected $fillable = [
        'Descricao_status_mensagem'
    ];

    public function mensagens()
    {
        return $this->hasMany(Mensagem::class, 'Status_MensagemID_Status_Mensagem');
    }
} 