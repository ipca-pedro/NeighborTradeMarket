<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Reclamacao
 * 
 * @property int $ID_Reclamacao
 * @property string|null $Descricao
 * @property Carbon|null $DataReclamacao
 * @property int $AprovacaoID_aprovacao
 * @property int $Status_ReclamacaoID_Status_Reclamacao
 * 
 * @property StatusReclamacao $status
 * @property Aprovacao $aprovacao
 * @property Collection|Compra[] $compras
 *
 * @package App\Models
 */
class Reclamacao extends Model
{
	protected $table = 'Reclamacao';
	protected $primaryKey = 'ID_Reclamacao';
	public $timestamps = false;

	protected $casts = [
		'DataReclamacao' => 'datetime',
		'AprovacaoID_aprovacao' => 'int',
		'Status_ReclamacaoID_Status_Reclamacao' => 'int'
	];

	protected $fillable = [
		'Descricao',
		'DataReclamacao',
		'Status_ReclamacaoID_Status_Reclamacao',
		'AprovacaoID_aprovacao'
	];

	/**
	 * Get the status of the complaint
	 */
	public function status()
	{
		return $this->belongsTo(StatusReclamacao::class, 'Status_ReclamacaoID_Status_Reclamacao', 'ID_Status_Reclamacao');
	}

	/**
	 * Get the purchases associated with the complaint
	 */
	public function compras()
	{
		return $this->belongsToMany(Compra::class, 'Compra_Reclamacao', 'ReclamacaoID_Reclamacao', 'CompraID_Compra');
	}

	public function aprovacao()
	{
		return $this->belongsTo(Aprovacao::class, 'AprovacaoID_aprovacao');
	}
}
