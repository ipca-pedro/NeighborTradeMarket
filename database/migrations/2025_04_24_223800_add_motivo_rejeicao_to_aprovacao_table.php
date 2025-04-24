<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('aprovacao', function (Blueprint $table) {
            if (!Schema::hasColumn('aprovacao', 'motivo_rejeicao')) {
                $table->string('motivo_rejeicao', 255)->nullable()->after('Comentario');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('aprovacao', function (Blueprint $table) {
            if (Schema::hasColumn('aprovacao', 'motivo_rejeicao')) {
                $table->dropColumn('motivo_rejeicao');
            }
        });
    }
};
