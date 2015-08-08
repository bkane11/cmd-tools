@echo off
REM spaces and mapped drives cause problems
REM - for now just CD into the target dir first

SETLOCAL EnableDelayedExpansion

FOR %%A IN (%*) DO (
   FOR /f "tokens=1,2 delims=:" %%G IN ("%%A") DO (
    @echo setting %%G = %%H
    SET %%G=%%H
   )
)


if "%INPUT%"=="" call :messageAndExit "Must specify INPUT"
if "%DB%"=="" call :messageAndExit "Must specify DB (database)"
if "%COLLECTION%"=="" call :messageAndExit "Must specify COLLECTION"

if "%TEST%"=="" (
  @echo preparing to import %INPUT% into %DB%.%COLLECTION%
  FOR /F "delims=" %%i in ('jq -r --compact-output .features[]  %INPUT% ') DO (
    set formatted=%%i
    REM remove the empty z entry in coordinates
    call set formatted=%%formatted:,0]=]%%
    @echo !formatted! | mongoimport -d %DB% -c %COLLECTION% 
    REM --verbose
  )
  @echo MAKING INDICES
  mongo --nodb --quiet --eval "var collection='%COLLECTION%'"^
   "C:\Users\ben_kane\Documents\Aptana Studio 3 Workspace\cmd-tools\mongo-tools\ensure-indexes-on-all-properties.js"
  REM jq -r --compact-output .features[] %INPUT% | mongoimport -d %DB% -c %COLLECTION% --verbose
  exit /b
) else (
  @echo *** TEST ***
  @echo preparing to import %INPUT% into %DB%.%COLLECTION%
  FOR /F "delims=" %%i in ('jq -r --compact-output .features[]  %INPUT% ') DO (
    set formatted=%%i
    REM remove the empty z entry in coordinates
    call set formatted=%%formatted:,0]=]%%
    @echo. !formatted!
  )
  REM FOR /F "delims=" %%i in ('jq -r --compact-output .features[] %INPUT%') DO @echo. %%i
)

exit /b


:messageAndExit
@echo %1
exit /b 1

REM test with:
REM cd "C:\temp\Mendocino Hazard KMZ Files"
REM "C:\Users\ben_kane\Documents\Aptana Studio 3 Workspace\cmd-tools\mongo-tools\import-to-mongodb-from-geojson-file-using-jq.bat" ^
 INPUT:8Asbestos_KMZ.json COLLECTION:venturamhmp_asbestos DB:geo_data ^
 TEST:true