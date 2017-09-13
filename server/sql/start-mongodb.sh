#!/bin/bash

if [ "$1" = "-d" ]
then

  DB=socobo_dev MOCKDATA_DIR=dev docker-compose --project-name socobo up

elif [ "$1" = "-t" ]
then

  DB=socobo_test MOCKDATA_DIR=test docker-compose --project-name socobo up

fi
