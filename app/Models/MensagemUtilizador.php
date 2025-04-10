<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class MensagemUtilizador
 * 
 * @property int $MensagemID_Mensagem
 * @property int $UtilizadorID_User
 * 
 * @property Utilizador $utilizador
 * @property Mensagem $mensagem
 *
 * @package App\Models
 */
class MensagemUtilizador extends Model
{
	protected $table = 'mensagem_utilizador';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'MensagemID_Mensagem' => 'int',
		'UtilizadorID_User' => 'int'
	];

	public function utilizador()
	{
		return $this->belongsTo(Utilizador::class, 'UtilizadorID_User');
	}

	public function mensagem()
	{
		return $this->belongsTo(Mensagem::class, 'MensagemID_Mensagem');
	}
}
