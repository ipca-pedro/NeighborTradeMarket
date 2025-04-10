<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StatusAnuncio
 * 
 * @property int $ID_Status_Anuncio
 * @property string|null $Descricao_status_anuncio
 * 
 * @property Collection|Anuncio[] $anuncios
 *
 * @package App\Models
 */
class StatusAnuncio extends Model
{
	protected $table = 'status_anuncio';
	protected $primaryKey = 'ID_Status_Anuncio';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_status_anuncio'
	];

	public function anuncios()
	{
		return $this->hasMany(Anuncio::class, 'Status_AnuncioID_Status_Anuncio');
	}
}
