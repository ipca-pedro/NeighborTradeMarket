<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Imagem
 * 
 * @property int $ID_Imagem
 * @property string|null $Caminho
 * 
 * @property Collection|ItemImagem[] $item_imagems
 * @property Collection|Utilizador[] $utilizadors
 *
 * @package App\Models
 */
class Imagem extends Model
{
	protected $table = 'imagem';
	protected $primaryKey = 'ID_Imagem';
	public $timestamps = false;

	protected $fillable = [
		'Caminho'
	];

	public function item_imagems()
	{
		return $this->hasMany(ItemImagem::class, 'ImagemID_Imagem');
	}

	public function utilizadors()
	{
		return $this->hasMany(Utilizador::class, 'ImagemID_Imagem');
	}
}
