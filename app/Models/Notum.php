<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Notum
 * 
 * @property int $ID_Nota
 * @property string|null $Descricao_nota
 * 
 * @property Collection|Avaliacao[] $avaliacaos
 *
 * @package App\Models
 */
class Notum extends Model
{
	protected $table = 'nota';
	protected $primaryKey = 'ID_Nota';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_nota'
	];

	public function avaliacaos()
	{
		return $this->hasMany(Avaliacao::class, 'NotaID_Nota');
	}
}
