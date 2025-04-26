<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateStatusTrocaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('status_troca', function (Blueprint $table) {
            $table->id('ID_Status_Troca');
            $table->string('Descricao_status_troca')->nullable();
        });

        // Insert default status values
        DB::table('status_troca')->insert([
            ['ID_Status_Troca' => 1, 'Descricao_status_troca' => 'Pendente'],
            ['ID_Status_Troca' => 2, 'Descricao_status_troca' => 'Aceita'],
            ['ID_Status_Troca' => 3, 'Descricao_status_troca' => 'Rejeitada'],
            ['ID_Status_Troca' => 4, 'Descricao_status_troca' => 'Cancelada'],
            ['ID_Status_Troca' => 5, 'Descricao_status_troca' => 'Solicitada'],
            ['ID_Status_Troca' => 8, 'Descricao_status_troca' => 'Concluída'],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('status_troca');
    }
} 