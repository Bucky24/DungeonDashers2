#!/bin/bash

echo Cleanup old app
rm -rf electron_game
rm dd2_game.zip
rm dist/dd2_game.zip
echo Preparing environment
unzip electron-*.zip -d electron_game 1>/dev/null
mv electron_game/electron.exe electron_game/dd2.exe
mkdir electron_game/resources/app
echo Building new game
npm run build
echo Copying app
cp -p index.js electron_game/resources/app
cp -rp build electron_game/resources/app
cp -rp server electron_game/resources/app
cp -p package.json electron_game/resources/app
cp -rp data electron_game/resources/app
mkdir electron_game/resources/app/node_modules
cp -rp node_modules/appdata-path electron_game/resources/app/node_modules
echo Creating zip
cd electron_game
zip -r dd2_game * 1>/dev/null
cd ..
mkdir -p dist
mv electron_game/dd2_game.zip dist
echo Done!