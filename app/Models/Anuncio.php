<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Anuncio
 * 
 * @property int $ID_Anuncio
 * @property string|null $Titulo
 * @property string|null $Descricao
 * @property float|null $Preco
 * @property int $UtilizadorID_User
 * @property int $AprovacaoID_aprovacao
 * @property int $Tipo_ItemID_Tipo
 * @property int $CategoriaID_Categoria
 * @property int $Status_AnuncioID_Status_Anuncio
 * 
 * @property Aprovacao $aprovacao
 * @property TipoItem $tipo_item
 * @property StatusAnuncio $status_anuncio
 * @property Categorium $categorium
 * @property Utilizador $utilizador
 * @property Collection|Compra[] $compras
 * @property Collection|ItemImagem[] $item_imagems
 * @property Collection|Mensagem[] $mensagems
 * @property Collection|Troca[] $trocas
 *
 * @package App\Models
 */
class Anuncio extends Model
{
	protected $table = 'anuncio';
	protected $primaryKey = 'ID_Anuncio';
	public $timestamps = false;

	protected $casts = [
		'Preco' => 'float',
		'UtilizadorID_User' => 'int',
		'AprovacaoID_aprovacao' => 'int',
		'Tipo_ItemID_Tipo' => 'int',
		'CategoriaID_Categoria' => 'int',
		'Status_AnuncioID_Status_Anuncio' => 'int'
	];

	protected $fillable = [
		'Titulo',
		'Descricao',
		'Preco',
		'UtilizadorID_User',
		'AprovacaoID_aprovacao',
		'Tipo_ItemID_Tipo',
		'CategoriaID_Categoria',
		'Status_AnuncioID_Status_Anuncio'
	];

	public function aprovacao()
	{
		return $this->belongsTo(Aprovacao::class, 'AprovacaoID_aprovacao');
	}

	public function tipo_item()
	{
		return $this->belongsTo(TipoItem::class, 'Tipo_ItemID_Tipo');
	}

	public function status_anuncio()
	{
		return $this->belongsTo(StatusAnuncio::class, 'Status_AnuncioID_Status_Anuncio');
	}

	public function categorium()
	{
		return $this->belongsTo(Categorium::class, 'CategoriaID_Categoria');
	}

	public function utilizador()
	{
		return $this->belongsTo(Utilizador::class, 'UtilizadorID_User');
	}

	public function compras()
	{
		return $this->hasMany(Compra::class, 'AnuncioID_Anuncio');
	}

	public function item_imagems()
	{
		return $this->hasMany(ItemImagem::class, 'ItemID_Item');
	}

	public function mensagems()
	{
		return $this->hasMany(Mensagem::class, 'ItemID_Item');
	}

	public function trocas()
	{
		return $this->hasMany(Troca::class, 'ItemID_Solicitado');
	}
}
