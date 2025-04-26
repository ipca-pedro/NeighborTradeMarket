<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('utilizador', function (Blueprint $table) {
            $table->id('ID_User');
            $table->string('Nome', 255);
            $table->string('Email', 255)->unique();
            $table->string('Password', 255);
            $table->string('Telefone', 15)->nullable();
            $table->date('DataNascimento')->nullable();
            $table->date('DataCriacao');
            $table->unsignedBigInteger('TipoUserID_TipoUser');
            $table->integer('Status')->default(1);
            $table->rememberToken();
            $table->timestamps();
        });

        // Criar a tabela tipo_user se ainda não existir
        if (!Schema::hasTable('tipo_user')) {
            Schema::create('tipo_user', function (Blueprint $table) {
                $table->id('ID_TipoUser');
                $table->string('Descricao', 255);
            });
            
            // Inserir valores padrão
            DB::table('tipo_user')->insert([
                ['ID_TipoUser' => 1, 'Descricao' => 'Administrador'],
                ['ID_TipoUser' => 2, 'Descricao' => 'Utilizador Normal']
            ]);
        }

        // Adicionar a foreign key depois de garantir que a tabela tipo_user existe
        Schema::table('utilizador', function (Blueprint $table) {
            $table->foreign('TipoUserID_TipoUser')->references('ID_TipoUser')->on('tipo_user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilizador');
    }
}; 