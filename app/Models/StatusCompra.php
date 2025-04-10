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
 * @property int $ID_Status_Compra
 * @property string|null $Descricao_status_compra
 * 
 * @property Collection|Compra[] $compras
 *
 * @package App\Models
 */
class StatusCompra extends Model
{
	protected $table = 'status_compra';
	protected $primaryKey = 'ID_Status_Compra';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_status_compra'
	];

	public function compras()
	{
		return $this->hasMany(Compra::class, 'Status_CompraID_Status_Compra');
	}
}
