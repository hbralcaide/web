# Admin Invite Edge Function Deployment Script
# Run this in PowerShell from your project root directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Admin Invite Function Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
Write-Host "Checking for Supabase CLI..." -ForegroundColor Yellow
$supabaseCli = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseCli) {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "Installing Supabase CLI..." -ForegroundColor Yellow
    npm install -g supabase
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Supabase CLI" -ForegroundColor Red
        Write-Host "Please run: npm install -g supabase" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Supabase CLI installed successfully" -ForegroundColor Green
} else {
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Link Your Project" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for Project ID
Write-Host "Enter your Supabase Project ID" -ForegroundColor Yellow
Write-Host "(Find it in: Supabase Dashboard → Project Settings → General → Reference ID)" -ForegroundColor Gray
$projectId = Read-Host "Project ID"

if ([string]::IsNullOrWhiteSpace($projectId)) {
    Write-Host "❌ Project ID is required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Linking project..." -ForegroundColor Yellow
supabase link --project-ref $projectId

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to link project" -ForegroundColor Red
    Write-Host "Make sure you entered the correct Project ID and Access Token" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Project linked successfully" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Deploy Edge Function" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deploying invite-admin function..." -ForegroundColor Yellow
supabase functions deploy invite-admin

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy function" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Function deployed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Set Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "You'll need to set 4 environment variables." -ForegroundColor Yellow
Write-Host "Find these values in: Supabase Dashboard → Project Settings → API" -ForegroundColor Gray
Write-Host ""

# SUPABASE_URL
Write-Host "Enter your Supabase URL" -ForegroundColor Yellow
Write-Host "(Example: https://abcdefghijk.supabase.co)" -ForegroundColor Gray
$supabaseUrl = Read-Host "SUPABASE_URL"

if ([string]::IsNullOrWhiteSpace($supabaseUrl)) {
    Write-Host "❌ Supabase URL is required" -ForegroundColor Red
    exit 1
}

Write-Host "Setting SUPABASE_URL..." -ForegroundColor Yellow
supabase secrets set SUPABASE_URL=$supabaseUrl

Write-Host ""

# SUPABASE_ANON_KEY
Write-Host "Enter your Supabase Anon Key" -ForegroundColor Yellow
Write-Host "(The 'anon' 'public' key from Project Settings → API)" -ForegroundColor Gray
$anonKey = Read-Host "SUPABASE_ANON_KEY"

if ([string]::IsNullOrWhiteSpace($anonKey)) {
    Write-Host "❌ Anon Key is required" -ForegroundColor Red
    exit 1
}

Write-Host "Setting SUPABASE_ANON_KEY..." -ForegroundColor Yellow
supabase secrets set SUPABASE_ANON_KEY=$anonKey

Write-Host ""

# SUPABASE_SERVICE_ROLE_KEY
Write-Host "Enter your Supabase Service Role Key" -ForegroundColor Yellow
Write-Host "(The 'service_role' 'secret' key from Project Settings → API)" -ForegroundColor Gray
Write-Host "⚠️  KEEP THIS SECRET - Never commit it to git!" -ForegroundColor Red
$serviceRoleKey = Read-Host "SUPABASE_SERVICE_ROLE_KEY"

if ([string]::IsNullOrWhiteSpace($serviceRoleKey)) {
    Write-Host "❌ Service Role Key is required" -ForegroundColor Red
    exit 1
}

Write-Host "Setting SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Yellow
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=$serviceRoleKey

Write-Host ""

# PUBLIC_SITE_URL
Write-Host "Enter your public site URL" -ForegroundColor Yellow
Write-Host "(For local dev: http://localhost:5173, For production: your Vercel URL)" -ForegroundColor Gray
$siteUrl = Read-Host "PUBLIC_SITE_URL"

if ([string]::IsNullOrWhiteSpace($siteUrl)) {
    Write-Host "❌ Site URL is required" -ForegroundColor Red
    exit 1
}

Write-Host "Setting PUBLIC_SITE_URL..." -ForegroundColor Yellow
supabase secrets set PUBLIC_SITE_URL=$siteUrl

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open your app and log in as admin" -ForegroundColor White
Write-Host "2. Go to the 'Admins' page" -ForegroundColor White
Write-Host "3. Click 'Invite New Admin' and test the feature" -ForegroundColor White
Write-Host ""

Write-Host "To view function logs:" -ForegroundColor Yellow
Write-Host "  supabase functions logs invite-admin --follow" -ForegroundColor Gray
Write-Host ""

Write-Host "To list all secrets:" -ForegroundColor Yellow
Write-Host "  supabase secrets list" -ForegroundColor Gray
Write-Host ""

Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
