<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class TestController extends Controller
{
    public function test()
    {
        return response()->json(['message' => 'API is working!']);
    }
    
    public function dbConnection()
    {
        try {
            DB::connection()->getPdo();
            return response()->json([
                'status' => 'success',
                'message' => 'Database connection is working!',
                'database' => DB::connection()->getDatabaseName()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Database connection failed!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function authTest(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Authentication is working!',
            'user' => Auth::user()
        ]);
    }
    
    public function requestInfo(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'method' => $request->method(),
            'url' => $request->url(),
            'path' => $request->path(),
            'headers' => $request->headers->all(),
            'ip' => $request->ip(),
            'query' => $request->query(),
            'input' => $request->all()
        ]);
    }
    
    public function serverInfo()
    {
        return response()->json([
            'status' => 'success',
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'environment' => app()->environment(),
            'debug_mode' => config('app.debug')
        ]);
    }
    
    public function dbTables()
    {
        try {
            $tables = DB::select('SHOW TABLES');
            $tableNames = [];
            
            foreach ($tables as $table) {
                $tableName = array_values((array) $table)[0];
                $tableNames[] = $tableName;
            }
            
            return response()->json([
                'status' => 'success',
                'tables' => $tableNames,
                'count' => count($tableNames)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get database tables!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}