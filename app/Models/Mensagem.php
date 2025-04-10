<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Mensagem
 * 
 * @property int $ID_Mensagem
 * @property string|null $Conteudo
 * @property Carbon|null $Data_mensagem
 * @property int $ItemID_Item
 * @property int $Status_MensagemID_Status_Mensagem
 * 
 * @property Anuncio $anuncio
 * @property StatusMensagem $status_mensagem
 * @property Collection|Utilizador[] $utilizadors
 *
 * @package App\Models
 */
class Mensagem extends Model
{
	protected $table = 'mensagem';
	protected $primaryKey = 'ID_Mensagem';
	public $timestamps = false;

	protected $casts = [
		'Data_mensagem' => 'datetime',
		'ItemID_Item' => 'int',
		'Status_MensagemID_Status_Mensagem' => 'int'
	];

	protected $fillable = [
		'Conteudo',
		'Data_mensagem',
		'ItemID_Item',
		'Status_MensagemID_Status_Mensagem'
	];

	public function anuncio()
	{
		return $this->belongsTo(Anuncio::class, 'ItemID_Item');
	}

	public function status_mensagem()
	{
		return $this->belongsTo(StatusMensagem::class, 'Status_MensagemID_Status_Mensagem');
	}

	public function utilizadors()
	{
		return $this->belongsToMany(Utilizador::class, 'mensagem_utilizador', 'MensagemID_Mensagem', 'UtilizadorID_User');
	}
}
