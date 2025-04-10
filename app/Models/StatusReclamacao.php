<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StatusReclamacao
 * 
 * @property int $ID_Status_Reclamacao
 * @property string|null $Descricao_status_reclamacao
 * 
 * @property Collection|Reclamacao[] $reclamacaos
 *
 * @package App\Models
 */
class StatusReclamacao extends Model
{
	protected $table = 'status_reclamacao';
	protected $primaryKey = 'ID_Status_Reclamacao';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_status_reclamacao'
	];

	public function reclamacaos()
	{
		return $this->hasMany(Reclamacao::class, 'Status_ReclamacaoID_Status_Reclamacao');
	}
}
