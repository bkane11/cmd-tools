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
  REM remove `,0]` (the z coordinate) with sed 's/\,0\]/\]/g'
  REM - TODO - that might not always be what you want to do
  powershell -command "jq -r --compact-output .features[]  %INPUT% | sed 's/\,0\]/\]/g' | mongoimport -d %DB% -c %COLLECTION%" 

  @echo MAKING INDICES
  REM %~dp0 is batch file directory
  mongo --nodb --quiet --eval "var collection='%COLLECTION%'"^
   "%~dp0ensure-indexes-on-all-properties.js"
  exit /b
) else (
  @echo *** TEST *** on %INPUT%
  @echo preparing to import %INPUT% into %DB%.%COLLECTION%
  powershell -command "jq -r --compact-output .features[]  %INPUT% | sed 's/\,0\]/\]/g' "
)

exit /b


:messageAndExit
@echo %1
exit /b 1

REM test with:
REM cd "C:\temp\Mendocino Hazard KMZ Files"
REM "C:\projects\cmd-tools\mongo-tools\import-to-mongodb-from-geojson-file-using-jq.bat" ^
 INPUT:8Asbestos_KMZ.json COLLECTION:venturamhmp_asbestos DB:geo_data ^
 TEST:true