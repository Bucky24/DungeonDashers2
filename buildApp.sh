#!/bin/bash

echo Cleanup old app
rm -rf electron_app
rm dd2.zip
unzip electron-v5.0.2-win32-ia32.zip -d electron_app
mv electron_app/electron.exe electron_app/dd2.exe
mkdir electron_app/resources/app
echo Copying app
cp -rp build electron_app/resources/app
cp -p package.json electron_app/resources/app
mkdir electron_app/resources/app/src
cp -rp src/gameClientElectron electron_app/resources/app/src
echo Creating zip
zip -r dd2 electron_app
mkdir -p dist
mv dd2.zip dist
echo Done!