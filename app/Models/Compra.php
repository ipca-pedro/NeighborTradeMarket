<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Compra
 * 
 * @property int $ID_Compra
 * @property Carbon|null $Data
 * @property int $UtilizadorID_User
 * @property int $AnuncioID_Anuncio
 * 
 * @property Utilizador $utilizador
 * @property Anuncio $anuncio
 * @property Collection|Avaliacao[] $avaliacaos
 * @property Collection|Reclamacao[] $reclamacaos
 * @property Collection|Pagamento[] $pagamentos
 *
 * @package App\Models
 */
class Compra extends Model
{
	protected $table = 'compra';
	protected $primaryKey = 'ID_Compra';
	public $timestamps = false;

	protected $casts = [
		'Data' => 'datetime',
		'UtilizadorID_User' => 'int',
		'AnuncioID_Anuncio' => 'int'
	];

	protected $fillable = [
		'Data',
		'UtilizadorID_User',
		'AnuncioID_Anuncio'
	];

	public function utilizador()
	{
		return $this->belongsTo(Utilizador::class, 'UtilizadorID_User');
	}

	public function anuncio()
	{
		return $this->belongsTo(Anuncio::class, 'AnuncioID_Anuncio', 'ID_Anuncio');
	}

	public function avaliacaos()
	{
		return $this->hasMany(Avaliacao::class, 'OrdemID_Produto');
	}

	public function reclamacaos()
	{
		return $this->belongsToMany(Reclamacao::class, 'compra_reclamacao', 'CompraID_Compra', 'ReclamacaoID_Reclamacao');
	}

	public function pagamentos()
	{
		return $this->hasMany(Pagamento::class, 'CompraID_Compra');
	}
}
