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
 * @property int $AprovacaoID_aprovacao
 * 
 * @property Nota $nota
 * @property Compra $compra
 * @property Aprovacao $aprovacao
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
		'OrdemID_Produto' => 'int',
		'AprovacaoID_aprovacao' => 'int'
	];

	protected $fillable = [
		'Comentario',
		'Resposta',
		'Data_Avaliacao',
		'Data_Resposta',
		'NotaID_Nota',
		'OrdemID_Produto',
		'AprovacaoID_aprovacao'
	];

	public function nota()
	{
		return $this->belongsTo(Nota::class, 'NotaID_Nota');
	}

	public function compra()
	{
		return $this->belongsTo(Compra::class, 'OrdemID_Produto');
	}

	public function aprovacao()
	{
		return $this->belongsTo(Aprovacao::class, 'AprovacaoID_aprovacao');
	}
}
