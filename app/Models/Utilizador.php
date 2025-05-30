<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class Utilizador
 * 
 * @property int $ID_User
 * @property string $User_Name
 * @property string $Name
 * @property Carbon $Data_Nascimento
 * @property string $Password
 * @property int $CC
 * @property string $Email
 * @property int $MoradaID_Morada
 * @property int|null $AprovacaoID_aprovacao
 * @property int|null $cartaoID_Cartao
 * @property int $TipoUserID_TipoUser
 * @property int $ImagemID_Imagem
 * @property int $Status_UtilizadorID_status_utilizador
 * 
 * @property StatusUtilizador $status_utilizador
 * @property Cartao|null $cartao
 * @property Aprovacao|null $aprovacao
 * @property Morada $morada
 * @property Imagem $imagem
 * @property Tipouser $tipouser
 * @property Collection|Anuncio[] $anuncios
 * @property Collection|Aprovacao[] $aprovacaos
 * @property Collection|Compra[] $compras
 * @property Collection|Mensagem[] $mensagems
 * @property Collection|Notificacao[] $notificacaos
 *
 * @package App\Models
 */
class Utilizador extends Authenticatable
{
	use HasApiTokens;
	
	protected $table = 'utilizador';
	protected $primaryKey = 'ID_User';
	public $timestamps = false;
	
	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var array<int, string>
	 */
	protected $hidden = [
		'Password',
	];

	protected $casts = [
		'Data_Nascimento' => 'datetime',
		'CC' => 'int',
		'MoradaID_Morada' => 'int',
		'AprovacaoID_aprovacao' => 'int',
		'cartaoID_Cartao' => 'int',
		'TipoUserID_TipoUser' => 'int',
		'ImagemID_Imagem' => 'int',
		'Status_UtilizadorID_status_utilizador' => 'int'
	];

	protected $fillable = [
		'User_Name',
		'Name',
		'Data_Nascimento',
		'Password',
		'CC',
		'Email',
		'MoradaID_Morada',
		'AprovacaoID_aprovacao',
		'cartaoID_Cartao',
		'TipoUserID_TipoUser',
		'ImagemID_Imagem',
		'Status_UtilizadorID_status_utilizador'
	];

	public function status_utilizador()
	{
		return $this->belongsTo(StatusUtilizador::class, 'Status_UtilizadorID_status_utilizador');
	}

	public function cartao()
	{
		return $this->belongsTo(Cartao::class, 'cartaoID_Cartao', 'ID_Cartao');
	}

	public function aprovacao()
	{
		return $this->belongsTo(Aprovacao::class, 'AprovacaoID_aprovacao');
	}

	public function morada()
	{
		return $this->belongsTo(Morada::class, 'MoradaID_Morada');
	}

	public function imagem()
	{
		return $this->belongsTo(Imagem::class, 'ImagemID_Imagem');
	}

	public function tipouser()
	{
		return $this->belongsTo(Tipouser::class, 'TipoUserID_TipoUser');
	}

	public function anuncios()
	{
		return $this->hasMany(Anuncio::class, 'UtilizadorID_User');
	}

	public function aprovacaos()
	{
		return $this->hasMany(Aprovacao::class, 'UtilizadorID_Admin');
	}

	public function compras()
	{
		return $this->hasMany(Compra::class, 'UtilizadorID_User');
	}

	public function mensagems()
	{
		return $this->belongsToMany(Mensagem::class, 'mensagem_utilizador', 'UtilizadorID_User', 'MensagemID_Mensagem');
	}

	public function notificacaos()
	{
		return $this->hasMany(Notificacao::class, 'UtilizadorID_User');
	}

	public function avaliacoes_recebidas()
	{
		return $this->hasManyThrough(
			Avaliacao::class,    // Final model we want to access
			Compra::class,       // Intermediate model
			'AnuncioID_Anuncio', // Foreign key on Compra table
			'Id_Avaliacao',      // Foreign key on Avaliacao table
			'ID_User',           // Local key on Utilizador table
			'ID_Compra'          // Local key on intermediate table (Compra)
		)->join('anuncio', function($join) {
			$join->on('Compra.AnuncioID_Anuncio', '=', 'anuncio.ID_Anuncio')
				 ->where('anuncio.UtilizadorID_User', '=', $this->ID_User);
		})->select('avaliacao.*');
	}

	/**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->Password;
    }

    /**
     * Get the login username to be used by the controller.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'Email';
    }

    /**
     * Get the column name for the "remember me" token.
     *
     * @return string
     */
    public function getRememberTokenName()
    {
        return 'remember_token';
    }
    
    /**
     * Verifica se o usuário tem um determinado papel
     *
     * @param string $role Nome do papel a ser verificado (ex: 'admin')
     * @return bool
     */
    public function hasRole($role)
    {
        // Caso específico para 'admin'
        if ($role === 'admin') {
            return $this->TipoUserID_TipoUser === 1;
        }
        
        // Caso necessário adicionar mais papéis no futuro
        $roles = [
            'admin' => 1,
            'user' => 2
            // Adicionar outros papéis conforme necessário
        ];
        
        return isset($roles[$role]) && $this->TipoUserID_TipoUser === $roles[$role];
    }
}
