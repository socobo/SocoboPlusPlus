#!/bin/bash

PW='socobo'
 
PGPASSWORD=$PW psql -h localhost -U postgres -f create-db.sql
PGPASSWORD=$PW psql -h localhost -U postgres -f create-tables.sql
PGPASSWORD=$PW psql -h localhost -U postgres -f fill-tables.sql


