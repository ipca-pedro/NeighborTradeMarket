<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TipoItem
 * 
 * @property int $ID_Tipo
 * @property string|null $Descricao_TipoItem
 * 
 * @property Collection|Anuncio[] $anuncios
 *
 * @package App\Models
 */
class TipoItem extends Model
{
	protected $table = 'tipo_item';
	protected $primaryKey = 'ID_Tipo';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_TipoItem'
	];

	public function anuncios()
	{
		return $this->hasMany(Anuncio::class, 'Tipo_ItemID_Tipo');
	}
}
