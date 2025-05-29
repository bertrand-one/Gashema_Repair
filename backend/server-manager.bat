@echo off
cls
:menu
echo ========================================
echo   SmartPark Backend Server Manager
echo ========================================
echo.
echo 1. Start Development Server (with auto-restart)
echo 2. Start Production Server
echo 3. Test Server Connection
echo 4. Check Server Status
echo 5. Stop All Node Processes
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto start_dev
if "%choice%"=="2" goto start_prod
if "%choice%"=="3" goto test_server
if "%choice%"=="4" goto check_status
if "%choice%"=="5" goto stop_all
if "%choice%"=="6" goto exit

echo Invalid choice. Please try again.
pause
goto menu

:start_dev
echo.
echo Starting development server with nodemon...
echo Press Ctrl+C to stop the server
echo.
npm run dev
goto menu

:start_prod
echo.
echo Starting production server...
echo.
npm start
goto menu

:test_server
echo.
echo Testing server connection...
powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:5000 -UseBasicParsing; Write-Host 'Server is running! Status:' $response.StatusCode; Write-Host 'Response:' $response.Content } catch { Write-Host 'Server is not responding. Make sure it is running.' }"
echo.
pause
goto menu

:check_status
echo.
echo Checking for running Node processes...
tasklist | findstr node.exe
echo.
echo Checking port 5000...
netstat -ano | findstr :5000
echo.
pause
goto menu

:stop_all
echo.
echo Stopping all Node processes...
taskkill /f /im node.exe 2>nul
echo Done.
echo.
pause
goto menu

:exit
echo Goodbye!
exit
