#!/bin/bash

echo Cleanup old app
rm -rf electron_game
rm dd2_game.zip
rm dist/dd2_game.zip
unzip electron-v6.1.11-win32-ia32.zip -d electron_game 1>/dev/null
mv electron_game/electron.exe electron_game/dd2.exe
mkdir electron_game/resources/app
echo Building new game
ELECTRON=true npm run build-game
echo Copying app
cp -rp build electron_game/resources/app
cp -p package.json electron_game/resources/app
mkdir electron_game/resources/app/src
cp -rp src/electronClient electron_game/resources/app/src
cp -rp src/common electron_game/resources/app/src
cp -rp src/data electron_game/resources/app/src
echo Creating zip
cd electron_game
zip -r dd2_game * 1>/dev/null
cd ..
mkdir -p dist
mv electron_game/dd2_game.zip dist
echo Done!