<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Referenciatipo
 * 
 * @property int $ID_ReferenciaTipo
 * @property string|null $Descricao
 * 
 * @property Collection|Notificacao[] $notificacaos
 *
 * @package App\Models
 */
class Referenciatipo extends Model
{
	protected $table = 'referenciatipo';
	protected $primaryKey = 'ID_ReferenciaTipo';
	public $timestamps = false;

	protected $fillable = [
		'Descricao'
	];

	public function notificacaos()
	{
		return $this->hasMany(Notificacao::class, 'ReferenciaTipoID_ReferenciaTipo');
	}
}
