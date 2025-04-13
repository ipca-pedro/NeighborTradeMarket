<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TipoItem
 * 
 * @property int $ID_Tipo
 * @property string|null $Descricao_TipoItem
 * 
 * @property Collection|Anuncio[] $anuncios
 *
 * @package App\Models
 */
class TipoItem extends Model
{
    // Constantes para tipos de item
    const TIPO_PRODUTO = 1;
    const TIPO_SERVICO = 2;
    const TIPO_DOACAO = 3;

    protected $table = 'tipo_item';
    protected $primaryKey = 'ID_Tipo';
    public $timestamps = false;

    protected $fillable = [
        'Descricao_TipoItem'
    ];

    /**
     * Valida se um tipo de item é válido
     *
     * @param int $tipoId
     * @return bool
     */
    public static function isValidTipo($tipoId)
    {
        return in_array($tipoId, [
            self::TIPO_PRODUTO,
            self::TIPO_SERVICO,
            self::TIPO_DOACAO
        ]);
    }

    /**
     * Obtém o tipo por ID
     *
     * @param int $tipoId
     * @return TipoItem|null
     */
    public static function getTipoById($tipoId)
    {
        return self::find($tipoId);
    }

    /**
     * Obtém todos os tipos válidos
     *
     * @return Collection
     */
    public static function getAllValidTypes()
    {
        return self::whereIn('ID_Tipo', [
            self::TIPO_PRODUTO,
            self::TIPO_SERVICO,
            self::TIPO_DOACAO
        ])->get();
    }

    public function anuncios()
    {
        return $this->hasMany(Anuncio::class, 'Tipo_ItemID_Tipo');
    }
}
