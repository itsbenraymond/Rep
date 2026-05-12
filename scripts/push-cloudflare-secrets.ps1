param(
  [string[]]$Names = @(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  )
)

$ErrorActionPreference = "Stop"

if (-not $env:CLOUDFLARE_API_TOKEN) {
  throw "Set CLOUDFLARE_API_TOKEN in your shell before running this script."
}

foreach ($name in $Names) {
  $value = [Environment]::GetEnvironmentVariable($name, "Process")
  if (-not $value) {
    $value = [Environment]::GetEnvironmentVariable($name, "User")
  }
  if (-not $value) {
    Write-Host "Skipping $name because it is not set locally."
    continue
  }

  Write-Host "Pushing $name to Cloudflare..."
  $value | npx wrangler secret put $name
}
