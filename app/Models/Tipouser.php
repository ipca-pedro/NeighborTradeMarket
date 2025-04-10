<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Tipouser
 * 
 * @property int $ID_TipoUser
 * @property string|null $Descrição_TipoUtilizador
 * 
 * @property Collection|Utilizador[] $utilizadors
 *
 * @package App\Models
 */
class Tipouser extends Model
{
	protected $table = 'tipouser';
	protected $primaryKey = 'ID_TipoUser';
	public $timestamps = false;

	protected $fillable = [
		'Descrição_TipoUtilizador'
	];

	public function utilizadors()
	{
		return $this->hasMany(Utilizador::class, 'TipoUserID_TipoUser');
	}
}
