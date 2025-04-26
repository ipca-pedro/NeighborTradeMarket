<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cartao', function (Blueprint $table) {
            $table->id('ID_Cartao');
            $table->integer('Numero');
            $table->string('Nome_Titular', 255);
            $table->string('Validade', 5);
            $table->integer('CVC');
            $table->unsignedBigInteger('UtilizadorID_User');
            $table->foreign('UtilizadorID_User')->references('ID_User')->on('utilizador');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cartao');
    }
}; 