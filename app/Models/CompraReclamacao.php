<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CompraReclamacao
 * 
 * @property int $CompraID_Compra
 * @property int $ReclamacaoID_Reclamacao
 * 
 * @property Reclamacao $reclamacao
 * @property Compra $compra
 *
 * @package App\Models
 */
class CompraReclamacao extends Model
{
	protected $table = 'compra_reclamacao';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'CompraID_Compra' => 'int',
		'ReclamacaoID_Reclamacao' => 'int'
	];

	public function reclamacao()
	{
		return $this->belongsTo(Reclamacao::class, 'ReclamacaoID_Reclamacao');
	}

	public function compra()
	{
		return $this->belongsTo(Compra::class, 'CompraID_Compra');
	}
}
