#!/bin/bash

echo Cleanup old app
rm -rf electron_editor
rm dd2_editor.zip
rm dist/dd2_editor.zip
unzip electron-v5.0.2-win32-ia32.zip -d electron_editor 1>/dev/null
mv electron_editor/electron.exe electron_editor/dd2_editor.exe
mkdir electron_editor/resources/app
echo Building new editor
ELECTRON=true npm run build-editor
echo Copying app
cp -rp build electron_editor/resources/app
cp -p package.json electron_editor/resources/app
mkdir electron_editor/resources/app/src
cp -rp src/electronClient electron_editor/resources/app/src
cp -rp src/common electron_editor/resources/app/src
cp -rp src/data electron_editor/resources/app/src
echo Creating zip
cd electron_editor
zip -r dd2_editor * 1>/dev/null
cd ..
mkdir -p dist
mv electron_editor/dd2_editor.zip dist
echo Done!