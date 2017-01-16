#!/bin/bash

PW="socobo"

if [ "$1" = "-d" ]
then

  PGPASSWORD=$PW psql -h localhost -U postgres -f ./dev/create-db-dev.sql
  PGPASSWORD=$PW psql -h localhost -U postgres -f ./dev/create-tables-dev.sql
  PGPASSWORD=$PW psql -h localhost -U postgres -f ./dev/fill-tables-dev.sql

elif [ "$1" = "-t" ]
then

  PGPASSWORD=$PW psql -h localhost -U postgres -f ./test/create-db-test.sql
  PGPASSWORD=$PW psql -h localhost -U postgres -f ./test/create-tables-test.sql
  PGPASSWORD=$PW psql -h localhost -U postgres -f ./test/fill-tables-test.sql

else

  PGPASSWORD=$PW psql -h localhost -U postgres -f ./prod/create-db.sql
  PGPASSWORD=$PW psql -h localhost -U postgres -f ./prod/create-tables.sql

fi
