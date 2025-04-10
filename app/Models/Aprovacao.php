<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Aprovacao
 * 
 * @property int $ID_aprovacao
 * @property string|null $Comentario
 * @property Carbon|null $Data_Submissao
 * @property Carbon|null $Data_Aprovacao
 * @property int $UtilizadorID_Admin
 * @property int $Status_AprovacaoID_Status_Aprovacao
 * 
 * @property Utilizador $utilizador
 * @property StatusAprovacao $status_aprovacao
 * @property Collection|Anuncio[] $anuncios
 * @property Collection|Avaliacao[] $avaliacaos
 * @property Collection|Reclamacao[] $reclamacaos
 * @property Collection|Utilizador[] $utilizadors
 *
 * @package App\Models
 */
class Aprovacao extends Model
{
	protected $table = 'aprovacao';
	protected $primaryKey = 'ID_aprovacao';
	public $timestamps = false;

	protected $casts = [
		'Data_Submissao' => 'datetime',
		'Data_Aprovacao' => 'datetime',
		'UtilizadorID_Admin' => 'int',
		'Status_AprovacaoID_Status_Aprovacao' => 'int'
	];

	protected $fillable = [
		'Comentario',
		'Data_Submissao',
		'Data_Aprovacao',
		'UtilizadorID_Admin',
		'Status_AprovacaoID_Status_Aprovacao'
	];

	public function utilizador()
	{
		return $this->belongsTo(Utilizador::class, 'UtilizadorID_Admin');
	}

	public function status_aprovacao()
	{
		return $this->belongsTo(StatusAprovacao::class, 'Status_AprovacaoID_Status_Aprovacao');
	}

	public function anuncios()
	{
		return $this->hasMany(Anuncio::class, 'AprovacaoID_aprovacao');
	}

	public function avaliacaos()
	{
		return $this->hasMany(Avaliacao::class, 'AprovacaoID_aprovacao');
	}

	public function reclamacaos()
	{
		return $this->hasMany(Reclamacao::class, 'AprovacaoID_aprovacao');
	}

	public function utilizadors()
	{
		return $this->hasMany(Utilizador::class, 'AprovacaoID_aprovacao');
	}
}
