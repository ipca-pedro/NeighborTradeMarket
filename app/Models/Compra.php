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
 * @property int $Quantidade
 * @property float $Valor_total
 * @property Carbon|null $Data
 * @property string|null $Endereco_entrega
 * @property string|null $Metodo_pagamento
 * @property int $UtilizadorID_User
 * @property int $AnuncioID_Anuncio
 * @property int $Status_CompraID_Status_Compra
 * 
 * @property Utilizador $utilizador
 * @property Anuncio $anuncio
 * @property StatusCompra $status_compra
 * @property Collection|Avaliacao[] $avaliacaos
 * @property Collection|Reclamacao[] $reclamacaos
 * @property Collection|Pagamento[] $pagamentos
 * @property Avaliacao $avaliacao
 *
 * @package App\Models
 */
class Compra extends Model
{
	protected $table = 'compra';
	protected $primaryKey = 'ID_Compra';
	public $timestamps = false;

	protected $casts = [
		'Quantidade' => 'int',
		'Valor_total' => 'float',
		'Data' => 'datetime',
		'UtilizadorID_User' => 'int',
		'AnuncioID_Anuncio' => 'int',
		'Status_CompraID_Status_Compra' => 'int'
	];

	protected $fillable = [
		'Quantidade',
		'Valor_total',
		'Data',
		'Endereco_entrega',
		'Metodo_pagamento',
		'UtilizadorID_User',
		'AnuncioID_Anuncio',
		'Status_CompraID_Status_Compra'
	];

	public function utilizador()
	{
		return $this->belongsTo(Utilizador::class, 'UtilizadorID_User');
	}

	public function anuncio()
	{
		return $this->belongsTo(Anuncio::class, 'AnuncioID_Anuncio');
	}

	public function avaliacaos()
	{
		return $this->hasMany(Avaliacao::class, 'OrdemID_Produto');
	}

	public function avaliacao()
	{
		return $this->hasOne(Avaliacao::class, 'OrdemID_Produto');
	}

	public function status_compra()
	{
		return $this->belongsTo(StatusCompra::class, 'Status_CompraID_Status_Compra');
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
