# Advanced TypeScript to JavaScript cleanup script
Write-Host "Cleaning up remaining TypeScript syntax..." -ForegroundColor Cyan

$clientJsPath = "c:/Users/suruk/OneDrive/Desktop/Food-Delivery/client-js/src"

function Remove-TypeScriptSyntax {
    param($filePath)
    
    if (-not (Test-Path $filePath)) { return }
    
    $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
    if (-not $content) { return }
    
    Write-Host "  Cleaning $($filePath | Split-Path -Leaf)" -ForegroundColor Gray
    
    # Remove generic type parameters from useState, useReducer, etc
    $content = $content -replace 'useState<[^>]+>', 'useState'
    $content = $content -replace 'useReducer<[^>]+>', 'useReducer'
    $content = $content -replace 'useContext<[^>]+>', 'useContext'
    $content = $content -replace 'useRef<[^>]+>', 'useRef'
    $content = $content -replace 'useMemo<[^>]+>', 'useMemo'
    $content = $content -replace 'useCallback<[^>]+>', 'useCallback'
    
    # Remove type annotations from function parameters  
    $content = $content -replace '\(([^:)]+):\s*React\.[^)]+\)', '($1)'
    $content = $content -replace '\(([^:)]+):\s*[A-Z][a-zA-Z<>[\]]+\)', '($1)'
    $content = $content -replace ':\s*React\.[A-Z][a-zA-Z<>]+', ''
    
    # Remove type annotations from arrow functions
    $content = $content -replace '=\s*\(([^)]*)\)\s*:\s*[A-Z][a-zA-Z<>[\]]+\s*=>', '= ($1) =>'
    $content = $content -replace '=\s*\(([^)]*)\)\s*:\s*void\s*=>', '= ($1) =>'
    
    # Remove 'as Type' assertions
    $content = $content -replace '\s+as\s+[A-Z][a-zA-Z<>[\]]+', ''
    
    # Remove interface imports
    $content = $content -replace "import\s+\{\s*([^}]*)\}\s+from\s+'@/types'[;]?", ""
    $content = $content -replace "import\s+type\s+\{[^}]*\}\s+from\s+'[^']*'[;]?", ""
    
    # Fix lucide-react imports to react-icons
    if ($content -match 'lucide-react') {
        $content = $content -replace "import\s+\{([^}]+)\}\s+from\s+'lucide-react'", ""
        Write-Host "    Removed lucide-react import" -ForegroundColor Yellow
    }
    
    Set-Content $filePath $content -NoNewline
}

# Clean all JSX files
Write-Host "Cleaning component files..." -ForegroundColor Yellow
Get-ChildItem "$clientJsPath/components" -Include *.jsx -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-TypeScriptSyntax $_.FullName
}

Write-Host "Cleaning page files..." -ForegroundColor Yellow
Get-ChildItem "$clientJsPath/pages" -Include *.jsx -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-TypeScriptSyntax $_.FullName
}

Write-Host "Cleaning context files..." -ForegroundColor Yellow
Get-ChildItem "$clientJsPath/context" -Include *.js -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-TypeScriptSyntax $_.FullName
}

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
