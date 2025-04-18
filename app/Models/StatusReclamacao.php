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
 * @property string|null $Descricao
 * 
 * @property Collection|Reclamacao[] $reclamacoes
 *
 * @package App\Models
 */
class StatusReclamacao extends Model
{
	protected $table = 'Status_Reclamacao';
	protected $primaryKey = 'ID_Status_Reclamacao';
	public $timestamps = false;

	protected $fillable = [
		'Descricao'
	];

	/**
	 * Get the complaints with this status
	 */
	public function reclamacoes()
	{
		return $this->hasMany(Reclamacao::class, 'Status_ReclamacaoID_Status_Reclamacao', 'ID_Status_Reclamacao');
	}
}
