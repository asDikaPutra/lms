<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Status & Visibility
            $table->enum('status', ['draft', 'active', 'closed', 'archived'])->default('active')->after('is_active');
            $table->boolean('is_visible')->default(true)->after('status');
            $table->date('start_date')->nullable()->after('is_visible');
            $table->date('end_date')->nullable()->after('start_date');
            
            // Settings JSON column for flexible configuration
            $table->json('settings')->nullable()->after('certificate_criteria');
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['status', 'is_visible', 'start_date', 'end_date', 'settings']);
        });
    }
};
