<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrocaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('troca', function (Blueprint $table) {
            $table->id('ID_Troca');
            $table->timestamp('DataTroca')->nullable();
            $table->unsignedBigInteger('ItemID_ItemOferecido');
            $table->unsignedBigInteger('ItemID_Solicitado');
            $table->unsignedBigInteger('Status_TrocaID_Status_Troca');

            // Foreign keys
            $table->foreign('ItemID_ItemOferecido')->references('ID_Anuncio')->on('anuncio');
            $table->foreign('ItemID_Solicitado')->references('ID_Anuncio')->on('anuncio');
            $table->foreign('Status_TrocaID_Status_Troca')->references('ID_Status_Troca')->on('status_troca');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('troca');
    }
} 