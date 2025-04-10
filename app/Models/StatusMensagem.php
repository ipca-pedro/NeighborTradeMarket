<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StatusMensagem
 * 
 * @property int $ID_Status_Mensagem
 * @property string|null $Descricao_status_mensagem
 * 
 * @property Collection|Mensagem[] $mensagems
 *
 * @package App\Models
 */
class StatusMensagem extends Model
{
	protected $table = 'status_mensagem';
	protected $primaryKey = 'ID_Status_Mensagem';
	public $timestamps = false;

	protected $fillable = [
		'Descricao_status_mensagem'
	];

	public function mensagems()
	{
		return $this->hasMany(Mensagem::class, 'Status_MensagemID_Status_Mensagem');
	}
}
