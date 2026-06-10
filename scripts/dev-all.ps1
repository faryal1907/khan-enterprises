Write-Host "Starting backend (API) and both frontends (Web and Admin)..."
# Start API backend
Start-Process -FilePath "powershell.exe" -ArgumentList @('-NoExit','-Command','npm.cmd run dev --workspace=api') -WorkingDirectory "$PSScriptRoot\.."
# Start Web frontend (port 3000)
Start-Process -FilePath "powershell.exe" -ArgumentList @('-NoExit','-Command','npm.cmd run dev --workspace=web') -WorkingDirectory "$PSScriptRoot\.."
# Start Admin frontend (port 3001)
Start-Process -FilePath "powershell.exe" -ArgumentList @('-NoExit','-Command','npm.cmd run dev --workspace=admin') -WorkingDirectory "$PSScriptRoot\.."
Write-Host "All services are starting. Use Ctrl+C to stop if needed."
