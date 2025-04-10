<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StatusUtilizador
 * 
 * @property int $ID_status_utilizador
 * @property string|null $Descricao_status_utilizador
 * 
 * @property Collection|Utilizador[] $utilizadors
 *
 * @package App\Models
 */
class StatusUtilizador extends Model
{
	protected $table = 'status_utilizador';
	protected $primaryKey = 'ID_status_utilizador';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_status_utilizador'
	];

	public function utilizadors()
	{
		return $this->hasMany(Utilizador::class, 'Status_UtilizadorID_status_utilizador');
	}
}
