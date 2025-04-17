<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StatusCompra
 * 
 * @property int $ID_Status
 * @property string|null $Descricao
 * 
 * @property Collection|Compra[] $compras
 *
 * @package App\Models
 */
class StatusCompra extends Model
{
	protected $table = 'status_compra';
	protected $primaryKey = 'ID_Status';
	public $timestamps = false;

	protected $fillable = [
		'Descricao'
	];

	public function compras()
	{
		return $this->hasMany(Compra::class, 'StatusID_Status', 'ID_Status');
	}
}
