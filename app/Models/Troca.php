<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class Troca
 * 
 * @property int $ID_Troca
 * @property Carbon|null $DataTroca
 * @property int $ItemID_ItemOferecido
 * @property int $ItemID_Solicitado
 * @property int $Status_TrocaID_Status_Troca
 * 
 * @property Anuncio $anuncioOferecido
 * @property Anuncio $anuncioSolicitado
 * @property StatusTroca $statusTroca
 *
 * @package App\Models
 */
class Troca extends Model
{
	use HasFactory;

	protected $table = 'troca';
	protected $primaryKey = 'ID_Troca';
	public $timestamps = false;

	protected $casts = [
		'DataTroca' => 'datetime',
		'ItemID_ItemOferecido' => 'int',
		'ItemID_Solicitado' => 'int',
		'Status_TrocaID_Status_Troca' => 'int'
	];

	protected $fillable = [
		'DataTroca',
		'ItemID_ItemOferecido',
		'ItemID_Solicitado',
		'Status_TrocaID_Status_Troca'
	];

	/**
	 * Get the offered item advertisement.
	 */
	public function anuncioOferecido()
	{
		return $this->belongsTo(Anuncio::class, 'ItemID_ItemOferecido', 'ID_Anuncio');
	}

	/**
	 * Get the requested item advertisement.
	 */
	public function anuncioSolicitado()
	{
		return $this->belongsTo(Anuncio::class, 'ItemID_Solicitado', 'ID_Anuncio');
	}

	/**
	 * Get the status of this trade.
	 */
	public function statusTroca()
	{
		return $this->belongsTo(StatusTroca::class, 'Status_TrocaID_Status_Troca', 'ID_Status_Troca');
	}
}
