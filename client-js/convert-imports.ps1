# TypeScript to JavaScript Conversion Script
Write-Host "Converting TypeScript files to JavaScript..." -ForegroundColor Cyan

$clientJsPath = "c:/Users/suruk/OneDrive/Desktop/Food-Delivery/client-js/src"

# Function to convert TS imports to JS imports
function Convert-TSImports {
    param($filePath)
    
    $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
    if (-not $content) { return }
    
    # Fix imports - remove @/ prefix and adjust paths
    $content = $content -replace "from '@/", "from '../"
    $content = $content -replace "from '@components/", "from '../components/"
    $content = $content -replace "from '@pages/", "from '../pages/"
    $content = $content -replace "from '@context/", "from '../context/"
    $content = $content -replace "from '@services/", "from '../services/"
    $content = $content -replace "from '@utils/", "from '../utils/"
    $content = $content -replace "from '@data/", "from '../data/"
    
    # Remove TypeScript-specific syntax
    # Remove type annotations from function parameters
    $content = $content -replace ":\s*React\.FC<[^>]*>", ""
    $content = $content -replace ":\s*FC<[^>]*>", ""
    
    # Remove interface/type imports
    $content = $content -replace "import\s+\{\s*([^}]*?),?\s*\}\s+from\s+'@/types'[;]?", ""
    $content = $content -replace "import\s+type\s+\{[^}]*\}\s+from\s+'[^']*'[;]?", ""
    
    # Remove explicit return type annotations
    $content = $content -replace "(\w+)\s*=\s*\([^)]*\)\s*:\s*\w+[\[\]<>]*\s*=>", '$1 = ($2) =>'
    $content = $content -replace "function\s+(\w+)\s*\([^)]*\)\s*:\s*\w+[\[\]<>]*\s*\{", 'function $1($2) {'
    
    # Remove type assertions
    $content = $content -replace "\s+as\s+\w+[\[\]<>]*", ""
    
    # Remove type annotations from variables
    $content = $content -replace "const\s+(\w+)\s*:\s*\w+[\[\]<>]*\s*=", 'const $1 ='
    $content = $content -replace "let\s+(\w+)\s*:\s*\w+[\[\]<>]*\s*=", 'let $1 ='
    
    # Add PropTypes import if component has props
    if ($content -match "function\s+\w+\s*\(\s*\{\s*\w+" -and $content -notmatch "import.*PropTypes") {
        $content = "import PropTypes from 'prop-types';`n" + $content
    }
    
    Set-Content $filePath $content -NoNewline
}

# Convert all .jsx and .js files in components and pages
Write-Host "Converting component files..." -ForegroundColor Yellow
Get-ChildItem "$clientJsPath/components" -Include *.jsx -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Converting $($_.Name)" -ForegroundColor Gray
    Convert-TSImports $_.FullName
}

Write-Host "Converting page files..." -ForegroundColor Yellow
Get-ChildItem "$clientJsPath/pages" -Include *.jsx -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Converting $($_.Name)" -ForegroundColor Gray
    Convert-TSImports $_.FullName
}

Write-Host "Conversion complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. cd client-js" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. npm start" -ForegroundColor White
