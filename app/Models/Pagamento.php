<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Pagamento
 * 
 * @property int $ID_Pagamento
 * @property int|null $Valor
 * @property Carbon|null $Data
 * @property int $CompraID_Compra
 * 
 * @property Compra $compra
 *
 * @package App\Models
 */
class Pagamento extends Model
{
	protected $table = 'pagamento';
	protected $primaryKey = 'ID_Pagamento';
	public $timestamps = false;

	protected $casts = [
		'Valor' => 'int',
		'Data' => 'datetime',
		'CompraID_Compra' => 'int'
	];

	protected $fillable = [
		'Valor',
		'Data',
		'CompraID_Compra'
	];

	public function compra()
	{
		return $this->belongsTo(Compra::class, 'CompraID_Compra');
	}
}
