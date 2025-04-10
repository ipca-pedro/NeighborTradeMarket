<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StatusAprovacao
 * 
 * @property int $ID_Status_Aprovacao
 * @property string|null $Descricao_Status_aprovacao
 * 
 * @property Collection|Aprovacao[] $aprovacaos
 *
 * @package App\Models
 */
class StatusAprovacao extends Model
{
	protected $table = 'status_aprovacao';
	protected $primaryKey = 'ID_Status_Aprovacao';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_Status_aprovacao'
	];

	public function aprovacaos()
	{
		return $this->hasMany(Aprovacao::class, 'Status_AprovacaoID_Status_Aprovacao');
	}
}
