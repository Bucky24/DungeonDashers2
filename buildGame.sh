#!/bin/bash

echo Cleanup old app
rm -rf electron_game
rm dd2_game.zip
unzip electron-v5.0.2-win32-ia32.zip -d electron_game
mv electron_game/electron.exe electron_game/dd2.exe
mkdir electron_game/resources/app
echo Copying app
cp -rp build electron_game/resources/app
cp -p package.json electron_game/resources/app
mkdir electron_game/resources/app/src
cp -rp src/gameClientElectron electron_game/resources/app/src
echo Creating zip
zip -r dd2_game electron_game
mkdir -p dist
mv dd2_game.zip dist
echo Done!