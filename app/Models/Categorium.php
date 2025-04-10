<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Categorium
 * 
 * @property int $ID_Categoria
 * @property string|null $Descricao_Categoria
 * 
 * @property Collection|Anuncio[] $anuncios
 *
 * @package App\Models
 */
class Categorium extends Model
{
	protected $table = 'categoria';
	protected $primaryKey = 'ID_Categoria';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_Categoria'
	];

	public function anuncios()
	{
		return $this->hasMany(Anuncio::class, 'CategoriaID_Categoria');
	}
}
