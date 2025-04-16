<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
	use HasFactory;

	protected $table = 'cartao';
	protected $primaryKey = 'ID_Cartao';
	public $timestamps = false;

	protected $casts = [
		'Numero' => 'int',
		'CVC' => 'int',
		'Data' => 'date'
	];

	protected $fillable = [
		'Numero',
		'CVC',
		'Data'
	];

	/**
	 * Relação com o utilizador
	 */
	public function utilizadores()
	{
		return $this->hasMany(Utilizador::class, 'cartaoID_Cartao', 'ID_Cartao');
	}
}
