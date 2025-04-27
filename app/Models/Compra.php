<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
	protected $table = 'Compra';
	protected $primaryKey = 'ID_Compra';
	public $timestamps = false;

	protected $casts = [
		'Data' => 'datetime',
		'UtilizadorID_User' => 'integer',
		'AnuncioID_Anuncio' => 'integer'
	];

	protected $fillable = [
		'Data',
		'UtilizadorID_User',
		'AnuncioID_Anuncio'
	];

	public function utilizador(): BelongsTo
	{
		return $this->belongsTo(Utilizador::class, 'UtilizadorID_User', 'ID_User');
	}

	public function anuncio(): BelongsTo
	{
		return $this->belongsTo(Anuncio::class, 'AnuncioID_Anuncio', 'ID_Anuncio');
	}

	public function avaliacoes()
	{
		return $this->hasMany(Avaliacao::class, 'OrdemID_Produto');
	}

	public function reclamacoes()
	{
		return $this->belongsToMany(Reclamacao::class, 'Compra_Reclamacao', 'CompraID_Compra', 'ReclamacaoID_Reclamacao');
	}

	public function pagamentos()
	{
		return $this->hasMany(Pagamento::class, 'CompraID_Compra');
	}

	/**
	 * Get the status of the purchase through the associated announcement's status
	 */
	public function getStatusAttribute()
	{
		return $this->anuncio->status_anuncio;
	}
}
