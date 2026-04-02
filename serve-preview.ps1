$port = 4173
$root = Join-Path $PSScriptRoot 'web-preview'
$localIps = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike '169.254*' -and $_.IPAddress -ne '127.0.0.1' } |
  Select-Object -ExpandProperty IPAddress

Write-Host ""
Write-Host "LifeOS preview server"
Write-Host "Folder: $root"
Write-Host "Port:   $port"
Write-Host ""
Write-Host "Open on this PC:"
Write-Host "  http://localhost:$port"
Write-Host ""
Write-Host "Open on iPhone (same Wi-Fi):"
$localIps | ForEach-Object { Write-Host "  http://$_:$port" }
Write-Host ""
Write-Host "To install on iPhone:"
Write-Host "1. Open the address in Safari"
Write-Host "2. Tap Share"
Write-Host "3. Tap 'Add to Home Screen'"
Write-Host ""

py -3 -m http.server $port --directory $root
