<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Avaliacao
 * 
 * @property int $Id_Avaliacao
 * @property string|null $Comentario
 * @property string|null $Resposta
 * @property Carbon|null $Data_Avaliacao
 * @property Carbon|null $Data_Resposta
 * @property int $NotaID_Nota
 * @property int $OrdemID_Produto
 * 
 * @property Nota $nota
 * @property Compra $compra
 *
 * @package App\Models
 */
class Avaliacao extends Model
{
	protected $table = 'avaliacao';
	protected $primaryKey = 'Id_Avaliacao';
	public $timestamps = false;

	protected $casts = [
		'Data_Avaliacao' => 'datetime',
		'Data_Resposta' => 'datetime',
		'NotaID_Nota' => 'int',
		'OrdemID_Produto' => 'int'
	];

	protected $fillable = [
		'Comentario',
		'Resposta',
		'Data_Avaliacao',
		'Data_Resposta',
		'NotaID_Nota',
		'OrdemID_Produto'
	];

	public function nota()
	{
		return $this->belongsTo(Nota::class, 'NotaID_Nota');
	}

	public function compra()
	{
		return $this->belongsTo(Compra::class, 'OrdemID_Produto');
	}
}
