#!/bin/bash

clear

echo "------------------------------------------------------------------"
echo "Start deploying socobo..."
echo "------------------------------------------------------------------"
echo 
echo

echo "------------------------------------------------------------------"
echo "1. step: clean dist directories"
echo "------------------------------------------------------------------"
echo 

if test -d client/dist
then
  rm -r client/dist
fi

if test -d server/dist
then
  rm -r server/dist
fi

echo
echo "------------------------------------------------------------------"
echo "2. step: build frontend project"
echo "------------------------------------------------------------------"
echo

if [ "$1" = "-p" ]
then
  cd client && npm run ng build -prod && cd ..
else
  cd client && npm run ng build && cd ..
fi

echo
echo "------------------------------------------------------------------"
echo "3. step: copy frontend project into public server dist folder"
echo "------------------------------------------------------------------"
echo

if ! test -d server/dist/public
then
  mkdir server/dist && mkdir server/dist/public
fi

cp -rv client/dist/* server/dist/public

echo
echo "------------------------------------------------------------------"
echo "4. step: build server project and open browser"
echo "------------------------------------------------------------------"
echo

cd server && npm run start:p

