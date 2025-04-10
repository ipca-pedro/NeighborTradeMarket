<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Morada
 * 
 * @property int $ID_Morada
 * @property string|null $Rua
 * 
 * @property Collection|Utilizador[] $utilizadors
 *
 * @package App\Models
 */
class Morada extends Model
{
	protected $table = 'morada';
	protected $primaryKey = 'ID_Morada';
	public $timestamps = false;

	protected $fillable = [
		'Rua'
	];

	public function utilizadors()
	{
		return $this->hasMany(Utilizador::class, 'MoradaID_Morada');
	}
}
