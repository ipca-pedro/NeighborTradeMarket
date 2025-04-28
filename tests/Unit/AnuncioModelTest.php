<?php

namespace Tests\Unit;

use App\Models\Anuncio;
use Tests\TestCase;

class AnuncioModelTest extends TestCase
{
    #[\PHPUnit\Framework\Attributes\Test]
    public function test_anuncio_preco_is_casted_to_float()
    {
        $anuncio = new Anuncio(['Preco' => '123.45']);
        $this->assertIsFloat($anuncio->Preco);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_anuncio_has_correct_table_name()
    {
        $anuncio = new Anuncio();
        $tableName = $anuncio->getTable();
        echo "\nDEBUG: Nome da tabela do modelo Anuncio: '$tableName'\n";
        $this->assertTrue(in_array($tableName, ['anuncio']), "Nome da tabela deve ser 'anuncio', mas foi '$tableName'");
    }
}
