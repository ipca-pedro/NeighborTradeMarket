<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use App\Models\Imagem;
use Illuminate\Support\Facades\Log;

class FileController extends Controller
{
    /**
     * Serve a file from storage by ID
     */
    public function serveById($id)
    {
        // Find the image record by ID
        $imagem = Imagem::find($id);
        
        if (!$imagem) {
            return response()->json(['message' => 'Imagem não encontrada'], 404);
        }
        
        // Get the file path from the database
        $path = $imagem->Caminho;
        
        // Log attempt
        Log::info('Tentando servir imagem', [
            'id' => $id,
            'path' => $path
        ]);
        
        // Try multiple path variations
        $pathVariations = [
            $path,                      // Original path
            'public/' . $path,          // With public/ prefix
            str_replace('public/', '', $path), // Without public/ prefix
            'app/public/' . $path,      // With app/public/ prefix
            'app/' . $path              // With app/ prefix
        ];
        
        $fileExists = false;
        $fullPath = null;
        
        foreach ($pathVariations as $testPath) {
            Log::info('Testando caminho', ['path' => $testPath, 'exists' => Storage::exists($testPath)]);
            if (Storage::exists($testPath)) {
                $fileExists = true;
                $fullPath = $testPath;
                Log::info('Caminho encontrado', ['path' => $fullPath]);
                break;
            }
        }
        
        // If still not found, try direct file system access
        if (!$fileExists) {
            $storagePath = storage_path('app/public/' . str_replace('public/', '', $path));
            Log::info('Testando acesso direto ao sistema de arquivos', ['path' => $storagePath, 'exists' => file_exists($storagePath)]);
            if (file_exists($storagePath)) {
                $fileExists = true;
                Log::info('Arquivo encontrado via acesso direto');
                return response()->file($storagePath);
            }
        }
        
        // Check if the file exists
        if (!$fileExists) {
            Log::warning('Arquivo não encontrado', [
                'id' => $id,
                'path' => $path,
                'tried_paths' => $pathVariations,
                'storage_base_path' => storage_path('app/public')
            ]);
            
            return response()->json([
                'message' => 'Arquivo não encontrado',
                'path' => $path,
                'tried_paths' => $pathVariations,
                'storage_base_path' => storage_path('app/public')
            ], 404);
        }
        
        // Get the file content
        $file = Storage::get($fullPath);
        
        // Get the file mime type
        $type = Storage::mimeType($fullPath);
        
        // Create a response with the file content
        $response = Response::make($file, 200);
        
        // Set the content type header
        $response->header('Content-Type', $type);
        
        Log::info('Arquivo servido com sucesso', [
            'id' => $id,
            'path' => $fullPath,
            'type' => $type
        ]);
        
        return $response;
    }
    
    /**
     * Provide debug information about image paths
     */
    public function debug()
    {
        // Get some sample images
        $imagens = Imagem::take(5)->get();
        $results = [];
        
        foreach ($imagens as $imagem) {
            $path = $imagem->Caminho;
            $pathVariations = [
                'original' => $path,
                'public_prefix' => 'public/' . $path,
                'no_public' => str_replace('public/', '', $path),
                'app_public' => 'app/public/' . $path,
                'app_prefix' => 'app/' . $path
            ];
            
            $existsResults = [];
            foreach ($pathVariations as $key => $testPath) {
                $existsResults[$key] = [
                    'path' => $testPath,
                    'exists' => Storage::exists($testPath)
                ];
            }
            
            // Check direct file access
            $storagePath = storage_path('app/public/' . str_replace('public/', '', $path));
            $existsResults['direct_access'] = [
                'path' => $storagePath,
                'exists' => file_exists($storagePath)
            ];
            
            $publicPath = public_path('storage/' . str_replace('public/', '', $path));
            $existsResults['public_access'] = [
                'path' => $publicPath,
                'exists' => file_exists($publicPath)
            ];
            
            $results[] = [
                'imagem_id' => $imagem->ID_Imagem,
                'path' => $path,
                'path_checks' => $existsResults
            ];
        }
        
        // Storage info
        $storageInfo = [
            'storage_path' => storage_path(),
            'public_path' => public_path(),
            'public_storage_path' => public_path('storage'),
            'storage_app_public' => storage_path('app/public'),
            'disk_public_exists' => Storage::disk('public')->exists(''),
            'disk_local_exists' => Storage::disk('local')->exists('')
        ];
        
        return response()->json([
            'imagens' => $results,
            'storage_info' => $storageInfo
        ]);
    }
}
