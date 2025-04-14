<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use App\Models\Imagem;

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
            if (Storage::exists($testPath)) {
                $fileExists = true;
                $fullPath = $testPath;
                break;
            }
        }
        
        // If still not found, try direct file system access
        if (!$fileExists) {
            $storagePath = storage_path('app/public/' . str_replace('public/', '', $path));
            if (file_exists($storagePath)) {
                $fileExists = true;
                return response()->file($storagePath);
            }
        }
        
        // Check if the file exists
        if (!$fileExists) {
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
        
        return $response;
    }
}
