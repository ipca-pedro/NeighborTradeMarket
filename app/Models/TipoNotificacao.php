<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TipoNotificacao
 * 
 * @property int $ID_TipoNotificacao
 * @property string|null $Descricao
 * 
 * @property Collection|Notificacao[] $notificacaos
 *
 * @package App\Models
 */
class TipoNotificacao extends Model
{
	protected $table = 'tipo_notificacao';
	protected $primaryKey = 'ID_TipoNotificacao';
	public $timestamps = false;

	protected $fillable = [
		'Descricao'
	];

	public function notificacaos()
	{
		return $this->hasMany(Notificacao::class, 'TIpo_notificacaoID_TipoNotificacao');
	}
}
