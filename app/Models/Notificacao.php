<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Notificacao
 * 
 * @property int $ID_Notificacao
 * @property string|null $Mensagem
 * @property Carbon|null $DataNotificacao
 * @property int|null $ReferenciaID
 * @property int $UtilizadorID_User
 * @property int $ReferenciaTipoID_ReferenciaTipo
 * @property int $TIpo_notificacaoID_TipoNotificacao
 * @property bool $Lida
 * 
 * @property Referenciatipo $referenciatipo
 * @property TipoNotificacao $tipo_notificacao
 * @property Utilizador $utilizador
 * @property EstadoNotificacao $estado_notificacao
 *
 * @package App\Models
 */
class Notificacao extends Model
{
	protected $table = 'notificacao';
	protected $primaryKey = 'ID_Notificacao';
	public $timestamps = false;

	protected $casts = [
		'DataNotificacao' => 'datetime',
		'ReferenciaID' => 'int',
		'UtilizadorID_User' => 'int',
		'ReferenciaTipoID_ReferenciaTipo' => 'int',
		'TIpo_notificacaoID_TipoNotificacao' => 'int',
		'Lida' => 'boolean'
	];

	protected $fillable = [
		'Mensagem',
		'DataNotificacao',
		'ReferenciaID',
		'UtilizadorID_User',
		'ReferenciaTipoID_ReferenciaTipo',
		'TIpo_notificacaoID_TipoNotificacao',
		'Estado_notificacaoID_estado_notificacao'
	];

	public function referenciatipo()
	{
		return $this->belongsTo(Referenciatipo::class, 'ReferenciaTipoID_ReferenciaTipo');
	}

	public function tipo_notificacao()
	{
		return $this->belongsTo(TipoNotificacao::class, 'TIpo_notificacaoID_TipoNotificacao');
	}

	public function utilizador()
	{
		return $this->belongsTo(Utilizador::class, 'UtilizadorID_User');
	}

	public function estado_notificacao()
	{
		return $this->belongsTo(EstadoNotificacao::class, 'Estado_notificacaoID_estado_notificacao');
	}
}
