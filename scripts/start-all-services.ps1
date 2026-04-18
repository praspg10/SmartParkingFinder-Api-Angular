$baseDir = "C:\1VGTech-Sep2025\1AGWorkspace_10Apr2026\SmartParkingFinder"

Write-Host "Booting Service Registry..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd $baseDir\discovery-server; mvn spring-boot:run`"" -WindowStyle Minimized
Write-Host "Waiting 20 seconds for Eureka to securely instantiate dynamically..."
Start-Sleep -Seconds 20

Write-Host "Triggering Native Microservice Infrastructure Dynamically..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd $baseDir\parking-lot-service; mvn spring-boot:run`"" -WindowStyle Minimized
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd $baseDir\user-service; mvn spring-boot:run`"" -WindowStyle Minimized
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd $baseDir\availability-service; mvn spring-boot:run`"" -WindowStyle Minimized
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd $baseDir\reservation-service; mvn spring-boot:run`"" -WindowStyle Minimized

Write-Host "Waiting 25 seconds allowing core logic layers to formally register onto the Discovery Engine."
Start-Sleep -Seconds 25

Write-Host "Executing Gateway Interface safely..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd $baseDir\api-gateway; mvn spring-boot:run`"" -WindowStyle Minimized

Write-Host "Waiting 15 seconds ensuring local API arrays lock securely on port 8080."
Start-Sleep -Seconds 15

Write-Host "Starting Angular UI Core Engine organically..."
Start-Process "powershell" -ArgumentList "-NoExit -Command `"cd $baseDir\smart-parking-ui; npm start`"" -WindowStyle Minimized

Write-Host "All JVM Background Instances and JS servers are officially running remotely!"
