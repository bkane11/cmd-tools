@echo off
SETLOCAL EnableDelayedExpansion

for /f %%f in ('dir /b .') do (
  @echo %%f
  powershell -command "$collection=\"%cd%\".ToLower().split(\"\\\")[-1]; $collection+=\"_\"; $collection+=\"%%f\".ToLower().split(\".\")[0]; %~dp0import-to-mongodb-from-geojson-file-using-jq.bat DB:geo_data INPUT:%%f COLLECTION:venturamhmp_$basedir_$collection;"
)