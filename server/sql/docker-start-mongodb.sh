#!/bin/bash

if [ "$1" = "-d" ]
then

  DB=socobo_dev MOCKDATA_DIR=data docker-compose --project-name socobo up -d

elif [ "$1" = "-t" ]
then

  DB=socobo_test MOCKDATA_DIR=data docker-compose --project-name socobo up -d

fi
