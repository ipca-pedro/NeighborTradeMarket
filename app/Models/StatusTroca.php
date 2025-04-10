<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StatusTroca
 * 
 * @property int $ID_Status_Troca
 * @property string|null $Descricao_status_troca
 * 
 * @property Collection|Troca[] $trocas
 *
 * @package App\Models
 */
class StatusTroca extends Model
{
	protected $table = 'status_troca';
	protected $primaryKey = 'ID_Status_Troca';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_status_troca'
	];

	public function trocas()
	{
		return $this->hasMany(Troca::class, 'Status_TrocaID_Status_Troca');
	}
}
