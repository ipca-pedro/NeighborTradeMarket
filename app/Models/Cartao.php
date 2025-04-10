<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Cartao
 * 
 * @property int $ID_Cartao
 * @property int $Numero
 * @property int $CVC
 * @property Carbon $Data
 * 
 * @property Collection|Utilizador[] $utilizadors
 *
 * @package App\Models
 */
class Cartao extends Model
{
	protected $table = 'cartao';
	protected $primaryKey = 'ID_Cartao';
	public $timestamps = false;

	protected $casts = [
		'Numero' => 'int',
		'CVC' => 'int',
		'Data' => 'datetime'
	];

	protected $fillable = [
		'Numero',
		'CVC',
		'Data'
	];

	public function utilizadors()
	{
		return $this->hasMany(Utilizador::class, 'cartaoID_Cartao');
	}
}
