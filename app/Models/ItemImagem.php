<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ItemImagem
 * 
 * @property int $ItemID_Item
 * @property int $ImagemID_Imagem
 * 
 * @property Anuncio $anuncio
 * @property Imagem $imagem
 *
 * @package App\Models
 */
class ItemImagem extends Model
{
	protected $table = 'item_imagem';
	protected $primaryKey = ['ItemID_Item', 'ImagemID_Imagem'];
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'ItemID_Item' => 'int',
		'ImagemID_Imagem' => 'int',
		'Principal' => 'int'
	];

	protected $fillable = [
		'ItemID_Item',
		'ImagemID_Imagem',
		'Principal'
	];

	public function anuncio()
	{
		return $this->belongsTo(Anuncio::class, 'ItemID_Item');
	}

	public function imagem()
	{
		return $this->belongsTo(Imagem::class, 'ImagemID_Imagem');
	}
}
