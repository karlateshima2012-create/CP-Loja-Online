<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flix_cards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->unique();
            $table->string('slug')->unique();
            $table->string('display_name');
            $table->string('category')->nullable();
            $table->string('city')->nullable();
            $table->string('profile_image_url')->nullable();
            $table->string('poster_image_url')->nullable();
            $table->boolean('is_premium')->default(false);
            $table->integer('stats_views')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flix_cards');
    }
};
