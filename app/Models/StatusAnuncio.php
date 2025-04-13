<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StatusAnuncio
 * 
 * @property int $ID_Status_Anuncio
 * @property string|null $Descricao_status_anuncio
 * 
 * @property Collection|Anuncio[] $anuncios
 *
 * @package App\Models
 */
class StatusAnuncio extends Model
{
    // Constantes para status
    const STATUS_PENDENTE = 1;
    const STATUS_APROVADO = 2;
    const STATUS_REJEITADO = 3;

    protected $table = 'status_anuncio';
    protected $primaryKey = 'ID_Status_Anuncio';
    public $timestamps = false;

    protected $fillable = [
        'Descricao_status_anuncio'
    ];

    /**
     * Verifica se um status é válido
     *
     * @param int $statusId
     * @return bool
     */
    public static function isValidStatus($statusId)
    {
        return in_array($statusId, [
            self::STATUS_PENDENTE,
            self::STATUS_APROVADO,
            self::STATUS_REJEITADO
        ]);
    }

    /**
     * Obtém o status por ID
     *
     * @param int $statusId
     * @return StatusAnuncio|null
     */
    public static function getStatusById($statusId)
    {
        return self::find($statusId);
    }

    /**
     * Obtém todos os status válidos
     *
     * @return Collection
     */
    public static function getAllValidStatus()
    {
        return self::whereIn('ID_Status_Anuncio', [
            self::STATUS_PENDENTE,
            self::STATUS_APROVADO,
            self::STATUS_REJEITADO
        ])->get();
    }

    public function anuncios()
    {
        return $this->hasMany(Anuncio::class, 'Status_AnuncioID_Status_Anuncio');
    }
}
